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

module.exports = router