const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  images: [{ type: String }],
  category: {
    type: String,
    required: true,
    enum: ['tote', 'crossbody', 'wallet', 'backpack', 'clutch'],
  },
  tags: [{ type: String }],
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  ratingAvg: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

// Index for search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' })

module.exports = mongoose.model('Product', productSchema)