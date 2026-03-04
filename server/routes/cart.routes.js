const express = require('express')
const router = express.Router()
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cart.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect) // all cart routes are protected

router.get('/', getCart)
router.post('/add', addToCart)
router.put('/update', updateCartItem)
router.delete('/remove/:productId', removeFromCart)
router.delete('/clear', clearCart)

module.exports = router