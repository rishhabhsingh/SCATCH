const rateLimit = require('express-rate-limit')

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },
})

module.exports = { authRateLimit }