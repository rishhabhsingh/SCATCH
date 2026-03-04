const express = require('express')
const router = express.Router()
const { sendMessage, getChatHistory, clearChat } = require('../controllers/chat.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)

router.post('/message', sendMessage)
router.get('/history', getChatHistory)
router.delete('/clear', clearChat)

module.exports = router