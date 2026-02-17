import mongoose from "mongoose";
import slugify from "slugify";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },

    slug: {
      type: String,
      unique: true
    },

    description: {
      type: String,
      required: [true, "Product description is required"]
    },

    price: {
      type: Number,
      required: [true, "Product price is required"]
    },

    mainCategory: {
      type: String,
      required: true,
      index: true
    },

    subCategory: {
      type: String,
      required: true,
      index: true
    },

    brand: {
      type: String,
      required: true,
      index: true
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },

    images: [
      {
        type: String
      }
    ],

    tags: [
      {
        type: String
      }
    ],

    reviews: [reviewSchema],

    rating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


// ✅ Auto-generate slug (Mongoose v8 compatible)
productSchema.pre("save", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true
    });
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
