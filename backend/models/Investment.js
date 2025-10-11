import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  property_id: { type: String, required: true },
  user_id: { type: String, required: true },
  property_name: { type: String, required: true },
  shares_owned: { type: Number, required: true },
  total_investment: { type: Number, required: true },
  date: { type: String, required: true },
  current_value: { type: Number, required: true },
  growth_percentage: { type: Number, required: true },
  profit: { type: Number, default: 0 },
  admin_commission: { type: Number, default: 0 },
});

export default mongoose.model("Investment", investmentSchema);
