const express = require('express')
const router = express.Router()
const {
  getAllProducts, getProductById, createProduct,
  updateProduct, deleteProduct, addReview
} = require('../controllers/product.controller')
const { protect } = require('../middleware/auth.middleware')
const { isAdmin } = require('../middleware/admin.middleware')

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', protect, isAdmin, createProduct)
router.put('/:id', protect, isAdmin, updateProduct)
router.delete('/:id', protect, isAdmin, deleteProduct)
router.post('/:id/reviews', protect, addReview)

module.exports = router