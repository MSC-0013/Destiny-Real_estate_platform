import { Payment, ProjectPool } from "../models/Payment.js";

// Get all payments for a project
export const getPaymentsByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const payments = await Payment.find({ projectId });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new payment
export const addPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mark payment as paid
export const markAsPaid = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findByIdAndUpdate(id, { status: "paid" }, { new: true });
    res.status(200).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Pay an installment
export const payInstallment = async (req, res) => {
  const { paymentId, installmentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const installment = payment.installments.id(installmentId);
    if (!installment) return res.status(404).json({ message: "Installment not found" });

    installment.status = "paid";
    await payment.save();
    res.status(200).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Initialize project pool
export const initializeProjectPool = async (req, res) => {
  const { projectId, totalCost, materialCost } = req.body;
  try {
    const pool = await ProjectPool.findOneAndUpdate(
      { projectId },
      { projectId, totalCost, remainingPool: totalCost - materialCost, materialCost, salariesCost: 0 },
      { upsert: true, new: true }
    );

    if (materialCost > 0) {
      const payment = new Payment({
        projectId,
        description: "Material Cost",
        type: "material",
        amount: materialCost,
        dueDate: new Date(),
        status: "paid",
      });
      await payment.save();
    }

    res.status(200).json(pool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Allocate payment from pool
export const allocatePayment = async (req, res) => {
  const { projectId, recipient, amount, type } = req.body;

  try {
    const pool = await ProjectPool.findOne({ projectId });
    if (!pool) return res.status(404).json({ message: "Project pool not found" });

    if (amount > pool.remainingPool) {
      return res.status(400).json({ message: "Not enough funds in project pool" });
    }

    pool.remainingPool -= amount;
    if (type === "salary") pool.salariesCost += amount;
    await pool.save();

    const payment = new Payment({
      projectId,
      description: `Payment to ${recipient}`,
      type,
      amount,
      dueDate: new Date(),
      status: "paid",
      recipient,
    });
    await payment.save();

    res.status(200).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get pool balance
export const getPoolBalance = async (req, res) => {
  const { projectId } = req.params;
  try {
    const pool = await ProjectPool.findOne({ projectId });
    res.status(200).json(pool);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
