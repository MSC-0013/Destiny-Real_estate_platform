import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  location: String,
  address: String,
  type: { type: String, enum: ['house','apartment','villa','land','commercial'], required: true },
  category: { type: String, enum: ['sale','rent'], required: true },
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  images: [String],
  amenities: [String],
  sellerId: String,
  sellerName: String,
  sellerPhone: String,
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  rentDuration: { type: String, enum: ['1month','6months','1year','custom'] },
  constructionStatus: { type: String, enum: ['completed','under-construction','planned'] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Property", propertySchema);
