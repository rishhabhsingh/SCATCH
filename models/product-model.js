const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      short: {
        type: String,
      },
      long: {
        type: String,
      },
    },

    images: [
      {
        type: String, // image URLs
      },
    ],

    thumbnail: {
      type: String,
    },

    price: {
      original: {
        type: Number,
        required: true,
      },
      discountPercentage: {
        type: Number,
        default: 0,
      },
      final: {
        type: Number, // calculated price
      },
    },

    category: {
      type: String,
    },

    brand: {
      type: String,
    },

    tags: [
      {
        type: String,
      },
    ],

    stock: {
      type: Number,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    design: {
      bgColor: {
        type: String,
      },
      panelColor: {
        type: String,
      },
      textColor: {
        type: String,
      },
    },

    ratings: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);
