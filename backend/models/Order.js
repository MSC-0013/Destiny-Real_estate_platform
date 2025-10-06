import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['purchase', 'rental'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  startDate: { type: Date },
  endDate: { type: Date },
  duration: { type: String },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
