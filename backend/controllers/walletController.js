// backend/controllers/walletController.js
import Wallet from '../models/Wallet.js';

// Get wallet balance
export const getBalance = async (req, res) => {
  const { userId } = req.params;

  try {
    let wallet = await Wallet.findOne({ userId });

    // If wallet doesn't exist, create with default balance
    if (!wallet) {
      wallet = new Wallet({ userId });
      await wallet.save();
    }

    res.json({ balance: wallet.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching balance" });
  }
};

// Add funds to wallet
export const addFunds = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true } 
    );

    res.json({ balance: wallet.balance, message: `₹${amount} added successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while adding funds" });
  }
};

// Withdraw funds from wallet
export const withdraw = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    wallet.balance -= amount;
    await wallet.save();

    res.json({ balance: wallet.balance, message: `₹${amount} withdrawn successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while withdrawing funds" });
  }
};
