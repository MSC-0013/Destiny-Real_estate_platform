import express from "express";
import {
  getPaymentsByProject,
  addPayment,
  markAsPaid,
  payInstallment,
  initializeProjectPool,
  allocatePayment,
  getPoolBalance,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/project/:projectId", getPaymentsByProject);
router.post("/", addPayment);
router.patch("/paid/:id", markAsPaid);
router.patch("/installment/:paymentId/:installmentId", payInstallment);
router.post("/pool/init", initializeProjectPool);
router.post("/pool/allocate", allocatePayment);
router.get("/pool/:projectId", getPoolBalance);

export default router;
