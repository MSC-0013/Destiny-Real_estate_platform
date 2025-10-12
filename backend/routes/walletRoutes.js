import express from 'express';
import { getBalance, addFunds, withdraw } from '../controllers/walletController.js';

const router = express.Router();

router.get('/:userId', getBalance);
router.post('/:userId/add', addFunds);
router.post('/:userId/withdraw', withdraw);

export default router;
