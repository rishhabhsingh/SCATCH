const Order = require('../models/order.model')
const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const asyncHandler = require('../utils/asyncHandler')
const sendResponse = require('../utils/sendResponse')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// @POST /api/orders/create-razorpay-order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body // amount in paise (₹1 = 100 paise)

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  }

  const razorpayOrder = await razorpay.orders.create(options)
  sendResponse(res, 200, true, 'Razorpay order created', {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  })
})

// @POST /api/orders/verify-payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, shippingAddress } = req.body

  // Verify signature (THIS IS CRITICAL — never skip this)
  const sign = razorpayOrderId + '|' + razorpayPaymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest('hex')

  if (expectedSignature !== razorpaySignature) {
    return sendResponse(res, 400, false, 'Payment verification failed')
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart || cart.items.length === 0) {
    return sendResponse(res, 400, false, 'Cart is empty')
  }

  // Calculate total
  const totalAmount = cart.items.reduce((acc, item) => {
    return acc + (item.product.discountPrice || item.product.price) * item.quantity
  }, 0)

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price,
    })),
    totalAmount,
    shippingAddress,
    status: 'confirmed',
    paymentInfo: {
      razorpayOrderId,
      razorpayPaymentId,
      status: 'paid',
    },
  })

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    })
  }

  // Clear cart
  await Cart.findOneAndDelete({ user: req.user._id })

  sendResponse(res, 201, true, 'Order placed successfully', order)
})

// @GET /api/orders/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 })
  sendResponse(res, 200, true, 'Orders fetched', orders)
})

// @GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product')
  if (!order) return sendResponse(res, 404, false, 'Order not found')
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendResponse(res, 403, false, 'Not authorized')
  }
  sendResponse(res, 200, true, 'Order fetched', order)
})

// @GET /api/orders (admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name')
    .sort({ createdAt: -1 })
  sendResponse(res, 200, true, 'All orders fetched', orders)
})

// @PUT /api/orders/:id/status (admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
  if (!order) return sendResponse(res, 404, false, 'Order not found')
  sendResponse(res, 200, true, 'Order status updated', order)
})

// @POST /api/orders/mock-payment
// Simulates a complete payment flow for demo purposes
const mockPayment = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')

  if (!cart || cart.items.length === 0) {
    return sendResponse(res, 400, false, 'Cart is empty')
  }

  const totalAmount = cart.items.reduce((acc, item) => {
    return acc + (item.product.discountPrice || item.product.price) * item.quantity
  }, 0)

  // Simulate a payment intent ID (in real app this comes from payment gateway)
  const mockPaymentId = `mock_pay_${Date.now()}`

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price,
    })),
    totalAmount,
    shippingAddress,
    status: 'confirmed',
    paymentInfo: {
      razorpayOrderId: mockPaymentId,
      razorpayPaymentId: mockPaymentId,
      status: 'paid',
    },
  })

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    })
  }

  await Cart.findOneAndDelete({ user: req.user._id })

  sendResponse(res, 201, true, 'Order placed successfully (demo payment)', { order })
})

module.exports = {
  mockPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
}