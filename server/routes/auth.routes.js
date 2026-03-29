const express = require('express')
const router = express.Router()
const { register, login, refreshAccessToken, logout, getMe } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { authRateLimit } = require('../middleware/rateLimit.middleware')

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

module.exports = router