const express = require('express')
const router = express.Router()
const {
  mockPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/order.controller')
const { protect } = require('../middleware/auth.middleware')
const { isAdmin } = require('../middleware/admin.middleware')

router.use(protect)

router.post('/mock-payment', mockPayment)
router.get('/my-orders', getMyOrders)
router.get('/', isAdmin, getAllOrders)
router.get('/:id', getOrderById)
router.put('/:id/status', isAdmin, updateOrderStatus)

module.exports = router