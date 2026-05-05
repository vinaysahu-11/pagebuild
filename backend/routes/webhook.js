import express from 'express';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

// Raw body parser for PayPal webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // TODO: Add PayPal webhook signature verification here for production
    const event = JSON.parse(req.body);
    const resource = event.resource || {};
    let status = '';
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') status = 'SUCCESS';
    else if (event.event_type === 'PAYMENT.CAPTURE.DENIED') status = 'FAILED';
    else if (event.event_type === 'PAYMENT.CAPTURE.REFUNDED') status = 'REFUNDED';
    else return res.sendStatus(200);

    // Store payment in DB
    await db.collection('payments').add({
      user_id: resource.custom_id || 'unknown',
      amount: resource.amount && resource.amount.value,
      status,
      provider: 'paypal',
      transaction_id: resource.id,
      createdAt: new Date().toISOString()
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
