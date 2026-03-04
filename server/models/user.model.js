const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  avatar: {
    type: String,
    default: '',
  },
  address: [addressSchema],
  refreshToken: {
    type: String,
    select: false,
  },
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)