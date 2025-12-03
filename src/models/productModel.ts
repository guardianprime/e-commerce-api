import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  slug: string;
  category: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  currency: string;
  countInStock: number;
  sold: number;
  sku: string;
  images: string[];
  thumbnail?: string;
  rating: number;
  numReviews: number;
  variants?: {
    color?: string;
    size?: string;
    price?: number;
    countInStock?: number;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    brand: { type: String },

    price: { type: Number, required: true },
    discountPrice: { type: Number },
    currency: { type: String, default: "USD" },

    countInStock: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },

    images: [{ type: String }],
    thumbnail: { type: String },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    variants: [
      {
        color: String,
        size: String,
        price: Number,
        countInStock: Number,
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
