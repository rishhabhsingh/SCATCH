const Product = require('../models/product.model')
const Review = require('../models/review.model')
const asyncHandler = require('../utils/asyncHandler')
const sendResponse = require('../utils/sendResponse')
const redis = require('../config/redis')
const cloudinary = require('../config/cloudinary')

const CACHE_TTL = 3600 // 1 hour in seconds

// @GET /api/products
const getAllProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query

  // Try cache — but never crash if Redis fails
  const cacheKey = `products:${JSON.stringify(req.query)}`
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return sendResponse(res, 200, true, 'Products fetched (cache)', JSON.parse(cached))
    }
  } catch (e) {}

  const query = {}
  if (category) query.category = category
  if (minPrice || maxPrice) query.price = {}
  if (minPrice) query.price.$gte = Number(minPrice)
  if (maxPrice) query.price.$lte = Number(maxPrice)
  if (search) query.$text = { $search: search }

  const sortOptions = {
    newest: { createdAt: -1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    rating: { ratingAvg: -1 },
  }

  const sortBy = sortOptions[sort] || sortOptions.newest
  const skip = (Number(page) - 1) * Number(limit)

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ])

  const data = {
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  }

  // Try to cache — but never crash if Redis fails
  try {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data))
  } catch (e) {}

  sendResponse(res, 200, true, 'Products fetched', data)
})

// @GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const cacheKey = `product:${req.params.id}`

  // Try reading from Redis
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return sendResponse(
        res,
        200,
        true,
        'Product fetched (cache)',
        JSON.parse(cached)
      )
    }
  } catch (err) {
    console.error('Redis GET error:', err.message)
  }

  // Fetch from DB
  const product = await Product.findById(req.params.id)
  if (!product) return sendResponse(res, 404, false, 'Product not found')

  // Try writing to Redis
  try {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(product))
  } catch (err) {
    console.error('Redis SET error:', err.message)
  }

  sendResponse(res, 200, true, 'Product fetched', product)
})

// @POST /api/products (admin only)
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body)
  await redis.del('products:*') // invalidate cache
  sendResponse(res, 201, true, 'Product created', product)
})

// @PUT /api/products/:id (admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) return sendResponse(res, 404, false, 'Product not found')

  await redis.del(`product:${req.params.id}`)
  sendResponse(res, 200, true, 'Product updated', product)
})

// @DELETE /api/products/:id (admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return sendResponse(res, 404, false, 'Product not found')

  await redis.del(`product:${req.params.id}`)
  sendResponse(res, 200, true, 'Product deleted')
})

// @POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const productId = req.params.id

  const existing = await Review.findOne({ product: productId, user: req.user._id })
  if (existing) return sendResponse(res, 400, false, 'You already reviewed this product')

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    comment,
  })

  // Recalculate product rating
  const reviews = await Review.find({ product: productId })
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  await Product.findByIdAndUpdate(productId, {
    ratingAvg: avg.toFixed(1),
    ratingCount: reviews.length,
  })

  await redis.del(`product:${productId}`)
  sendResponse(res, 201, true, 'Review added', review)
})

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview }