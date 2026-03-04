const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const asyncHandler = require('../utils/asyncHandler')
const sendResponse = require('../utils/sendResponse')

// @GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart) return sendResponse(res, 200, true, 'Cart is empty', { items: [] })
  sendResponse(res, 200, true, 'Cart fetched', cart)
})

// @POST /api/cart/add
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body

  const product = await Product.findById(productId)
  if (!product) return sendResponse(res, 404, false, 'Product not found')
  if (product.stock < quantity) return sendResponse(res, 400, false, 'Insufficient stock')

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity }] })
  } else {
    const existingItem = cart.items.find(item => item.product.toString() === productId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product: productId, quantity })
    }
    await cart.save()
  }

  await cart.populate('items.product')
  sendResponse(res, 200, true, 'Item added to cart', cart)
})

// @PUT /api/cart/update
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return sendResponse(res, 404, false, 'Cart not found')

  const item = cart.items.find(item => item.product.toString() === productId)
  if (!item) return sendResponse(res, 404, false, 'Item not in cart')

  if (quantity <= 0) {
    cart.items = cart.items.filter(item => item.product.toString() !== productId)
  } else {
    item.quantity = quantity
  }

  await cart.save()
  await cart.populate('items.product')
  sendResponse(res, 200, true, 'Cart updated', cart)
})

// @DELETE /api/cart/remove/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return sendResponse(res, 404, false, 'Cart not found')

  cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId)
  await cart.save()
  sendResponse(res, 200, true, 'Item removed from cart')
})

// @DELETE /api/cart/clear
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id })
  sendResponse(res, 200, true, 'Cart cleared')
})

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }