const User = require('../models/user.model')
const asyncHandler = require('../utils/asyncHandler')
const sendResponse = require('../utils/sendResponse')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const jwt = require('jsonwebtoken')

// @POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return sendResponse(res, 400, false, 'All fields are required')
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return sendResponse(res, 400, false, 'Email already registered')
  }

  const user = await User.create({ name, email, password })

  const accessToken = generateAccessToken(user._id, user.role)
  const refreshToken = generateRefreshToken(user._id)

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  sendResponse(res, 201, true, 'Account created successfully', {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
  })
})

// @POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return sendResponse(res, 400, false, 'Email and password required')
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return sendResponse(res, 401, false, 'Invalid credentials')
  }

  const accessToken = generateAccessToken(user._id, user.role)
  const refreshToken = generateRefreshToken(user._id)

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  sendResponse(res, 200, true, 'Login successful', {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
  })
})

// @POST /api/auth/refresh
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken
  if (!token) return sendResponse(res, 401, false, 'No refresh token')

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
  const user = await User.findById(decoded.userId).select('+refreshToken')

  if (!user || user.refreshToken !== token) {
    return sendResponse(res, 401, false, 'Invalid refresh token')
  }

  const newAccessToken = generateAccessToken(user._id, user.role)
  sendResponse(res, 200, true, 'Token refreshed', { accessToken: newAccessToken })
})

// @POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken
  if (token) {
    const user = await User.findOne({ refreshToken: token }).select('+refreshToken')
    if (user) {
      user.refreshToken = null
      await user.save({ validateBeforeSave: false })
    }
  }

  res.clearCookie('refreshToken')
  sendResponse(res, 200, true, 'Logged out successfully')
})

// @GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  sendResponse(res, 200, true, 'User fetched', { user: req.user })
})

module.exports = { register, login, refreshAccessToken, logout, getMe }