import express from 'express';
import {
  createOrder,
  verifyRazorpayWebhook,
  verifyPaypalWebhook,
  getPayments,
  updatePaymentStatus,
  deletePayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/webhook/razorpay', verifyRazorpayWebhook);
router.post('/webhook/paypal', verifyPaypalWebhook);

// Admin routes
router.get('/', getPayments);
router.put('/:id', updatePaymentStatus);
router.delete('/:id', deletePayment);

export default router;
