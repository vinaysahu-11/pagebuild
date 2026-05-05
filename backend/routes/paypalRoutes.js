import express from 'express';
import paypal from '@paypal/checkout-server-sdk';
import { db } from '../firebaseAdmin.js';

const router = express.Router();

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, user_id } = req.body;
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: currency, value: amount },
        custom_id: user_id
      }]
    });
    const order = await client.execute(request);
    res.json({ orderID: order.result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capture PayPal Order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await client.execute(request);
    res.json({ capture: capture.result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
