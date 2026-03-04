const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const User = require('../models/user.model')

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized' })
  }

  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
  req.user = await User.findById(decoded.userId)

  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not found' })
  }

  next()
})

module.exports = { protect }