const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/product.routes')
const cartRoutes = require('./routes/cart.routes')
const orderRoutes = require('./routes/order.routes')
const chatRoutes = require('./routes/chat.routes')
const errorMiddleware = require('./middleware/error.middleware')

const app = express()

// Security & Parsing Middleware
app.use(helmet())
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
  ],
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/chat', chatRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SCATCH API is running' })
})

// Global error handler (always last)
app.use(errorMiddleware)

module.exports = app