const express = require('express')
const router = express.Router()
const {
  createRazorpayOrder, verifyPayment, getMyOrders,
  getOrderById, getAllOrders, updateOrderStatus
} = require('../controllers/order.controller')
const { protect } = require('../middleware/auth.middleware')
const { isAdmin } = require('../middleware/admin.middleware')

router.use(protect)

router.post('/create-razorpay-order', createRazorpayOrder)
router.post('/verify-payment', verifyPayment)
router.get('/my-orders', getMyOrders)
router.get('/', isAdmin, getAllOrders)
router.get('/:id', getOrderById)
router.put('/:id/status', isAdmin, updateOrderStatus)
router.post('/mock-payment', placeOrder)

module.exports = router