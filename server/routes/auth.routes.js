const express = require('express')
const router = express.Router()
const { register, login, refreshAccessToken, logout, getMe } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { authRateLimit } = require('../middleware/rateLimit.middleware')
const { isAdmin } = require('../middleware/admin.middleware')
const passport = require('../config/passport')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')

// Initialize passport
router.use(passport.initialize())

router.post('/register', authRateLimit, register)
router.post('/login', authRateLimit, login)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)
router.get('/me', protect, getMe)

router.put('/profile', protect, async (req, res) => {
  const User = require('../models/user.model')
  const sendResponse = require('../utils/sendResponse')
  const { name, email } = req.body
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
  sendResponse(res, 200, true, 'Profile updated', { user })
})

router.put('/password', protect, async (req, res) => {
  const User = require('../models/user.model')
  const sendResponse = require('../utils/sendResponse')
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')
  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) return sendResponse(res, 400, false, 'Current password is incorrect')
  user.password = newPassword
  await user.save()
  sendResponse(res, 200, true, 'Password updated successfully')
})

router.get('/users', protect, isAdmin, async (req, res) => {
  const User = require('../models/user.model')
  const sendResponse = require('../utils/sendResponse')
  const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 })
  sendResponse(res, 200, true, 'Users fetched', users)
})

// Save address
router.post('/address', protect, async (req, res) => {
  const User = require('../models/user.model')
  const sendResponse = require('../utils/sendResponse')
  const { street, city, state, pincode, label } = req.body

  const user = await User.findById(req.user._id)

  // If setting as default, unset others
  if (req.body.isDefault) {
    user.address.forEach(a => a.isDefault = false)
  }

  user.address.push({ street, city, state, pincode, label: label || 'Home', isDefault: req.body.isDefault || user.address.length === 0 })
  await user.save()
  sendResponse(res, 200, true, 'Address saved', { address: user.address })
})

// Get addresses
router.get('/address', protect, async (req, res) => {
  const User = require('../models/user.model')
  const sendResponse = require('../utils/sendResponse')
  const user = await User.findById(req.user._id)
  sendResponse(res, 200, true, 'Addresses fetched', { address: user.address })
})

// Delete address
router.delete('/address/:addressId', protect, async (req, res) => {
  const User = require('../models/user.model')
  const sendResponse = require('../utils/sendResponse')
  const user = await User.findById(req.user._id)
  user.address = user.address.filter(a => a._id.toString() !== req.params.addressId)
  await user.save()
  sendResponse(res, 200, true, 'Address deleted', { address: user.address })
})

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
  async (req, res) => {
    const user = req.user
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

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${accessToken}&user=${encodeURIComponent(JSON.stringify({ _id: user._id, name: user.name, email: user.email, role: user.role }))}`)
  }
)
module.exports = router