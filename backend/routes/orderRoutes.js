import express from 'express';
import {
  createOrder,
  getOrders,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// CRUD endpoints
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/buyer/:userId', getUserOrders);
router.get('/seller/:sellerId', getSellerOrders);
router.put('/:orderId/status', updateOrderStatus);

export default router;
