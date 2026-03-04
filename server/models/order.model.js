const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentInfo: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)