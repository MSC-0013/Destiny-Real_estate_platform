import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Wallet', WalletSchema);
