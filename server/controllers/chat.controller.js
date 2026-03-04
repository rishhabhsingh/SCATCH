const Groq = require('groq-sdk')
const Chat = require('../models/chat.model')
const asyncHandler = require('../utils/asyncHandler')
const sendResponse = require('../utils/sendResponse')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SCATCH_SYSTEM_PROMPT = `You are SCATCH Assistant, a helpful customer support AI for SCATCH — a premium leather bag brand. 

About SCATCH:
- We sell premium handcrafted leather bags including totes, crossbody bags, wallets, backpacks, and clutches
- All bags are made from genuine leather with gold hardware
- Prices range from ₹1,500 (wallets) to ₹15,000 (premium totes)
- We offer free shipping on orders above ₹2,000
- Return policy: 7-day easy returns for unused items
- Shipping time: 3-5 business days within India

You help customers with:
- Product recommendations based on their needs
- Order tracking and status queries
- Return and refund policy questions
- Size and material questions
- Care instructions for leather products

Always be polite, professional, and helpful. If asked about specific order details you cannot access, direct them to their dashboard or our support email: support@scatch.in. Keep responses concise and helpful.`

// @POST /api/chat/message
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body

  if (!message) return sendResponse(res, 400, false, 'Message is required')

  // Get or create chat session
  let chat = await Chat.findOne({ user: req.user._id })
  if (!chat) {
    chat = await Chat.create({ user: req.user._id, messages: [] })
  }

  // Add user message to DB
  chat.messages.push({ role: 'user', content: message })

  // Build conversation history for GROQ (last 10 messages for context)
  const history = chat.messages.slice(-10).map(m => ({
    role: m.role,
    content: m.content,
  }))

  // Call GROQ
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SCATCH_SYSTEM_PROMPT },
      ...history,
    ],
    max_tokens: 500,
  })

  const aiReply = completion.choices[0].message.content

  // Save AI reply to DB
  chat.messages.push({ role: 'assistant', content: aiReply })
  await chat.save()

  sendResponse(res, 200, true, 'Message sent', { reply: aiReply })
})

// @GET /api/chat/history
const getChatHistory = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ user: req.user._id })
  if (!chat) return sendResponse(res, 200, true, 'No history', { messages: [] })
  sendResponse(res, 200, true, 'Chat history fetched', { messages: chat.messages })
})

// @DELETE /api/chat/clear
const clearChat = asyncHandler(async (req, res) => {
  await Chat.findOneAndDelete({ user: req.user._id })
  sendResponse(res, 200, true, 'Chat cleared')
})

module.exports = { sendMessage, getChatHistory, clearChat }