import crypto from 'crypto';
import Razorpay from 'razorpay';
import paypal from '@paypal/checkout-server-sdk';
import { db } from '../firebaseAdmin.js';

// Fallback in-memory store if DB is not connected
const mockPayments = [];

const isDbConnected = () => db !== null;

export const createOrder = async (req, res) => {
  try {
    const { amount, currency, serviceName, userId, chatId } = req.body;

    let paymentData = {
      userId: userId || 'anonymous',
      chatId,
      serviceName,
      amount,
      currency,
      gateway: currency === 'INR' ? 'razorpay' : 'paypal',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    let paymentId;
    if (isDbConnected()) {
      const docRef = await db.collection('payments').add(paymentData);
      paymentId = docRef.id;
    } else {
      paymentId = 'mock_id_' + Date.now();
      paymentData._id = paymentId;
      mockPayments.push(paymentData);
    }

    // Razorpay Integration
    if (currency === 'INR') {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
          amount: amount * 100, // amount in smallest currency unit
          currency: 'INR',
          receipt: paymentId,
        };

        const order = await razorpay.orders.create(options);
        
        // Update document with orderId if DB connected
        if (isDbConnected()) {
          await db.collection('payments').doc(paymentId).update({ orderId: order.id });
        }

        return res.json({
          success: true,
          gateway: 'razorpay',
          orderId: order.id,
          paymentId,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID,
        });
      } else {
        // Mock Mode for Razorpay
        return res.json({
          success: true,
          gateway: 'razorpay',
          orderId: 'mock_order_' + Date.now(),
          paymentId,
          amount: amount * 100,
          currency: 'INR',
          mockMode: true,
        });
      }
    }

    // PayPal Integration
    if (currency === 'USD') {
      if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
        // User explicitly requested 'real wala' (Live Environment)
        const environment = new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        );
        const client = new paypal.core.PayPalHttpClient(environment);

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: paymentId,
              amount: {
                currency_code: 'USD',
                value: amount.toString(),
              },
              description: serviceName,
            },
          ],
        });

        const order = await client.execute(request);
        
        if (isDbConnected()) {
          await db.collection('payments').doc(paymentId).update({ orderId: order.result.id });
        }

        return res.json({
          success: true,
          gateway: 'paypal',
          orderId: order.result.id,
          paymentId,
          amount,
          currency: 'USD',
          clientId: process.env.PAYPAL_CLIENT_ID,
        });
      } else {
        // Mock Mode for PayPal
        return res.json({
          success: true,
          gateway: 'paypal',
          orderId: 'mock_paypal_' + Date.now(),
          paymentId,
          amount,
          currency: 'USD',
          mockMode: true,
        });
      }
    }

    return res.status(400).json({ success: false, message: 'Invalid currency' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpayWebhook = async (req, res) => {
  try {
    const { paymentId, status, mockMode, transactionId } = req.body;
    
    if (status === 'success') {
      if (isDbConnected() && paymentId) {
        await db.collection('payments').doc(paymentId).update({
          status: 'success',
          transactionId: transactionId || 'mock_txn_' + Date.now(),
          updatedAt: new Date().toISOString()
        });
      } else {
        const payment = mockPayments.find((p) => p._id === paymentId);
        if (payment) {
          payment.status = 'success';
          payment.transactionId = transactionId || 'mock_txn_' + Date.now();
        }
      }

      if (req.io) {
        req.io.emit('payment_success', { paymentId, status: 'success' });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};

export const verifyPaypalWebhook = async (req, res) => {
  try {
    const { paymentId, status, mockMode, transactionId } = req.body;

    if (status === 'success') {
      if (isDbConnected() && paymentId) {
        await db.collection('payments').doc(paymentId).update({
          status: 'success',
          transactionId: transactionId || 'mock_txn_' + Date.now(),
          updatedAt: new Date().toISOString()
        });
      } else {
        const payment = mockPayments.find((p) => p._id === paymentId);
        if (payment) {
          payment.status = 'success';
          payment.transactionId = transactionId || 'mock_txn_' + Date.now();
        }
      }

      if (req.io) {
        req.io.emit('payment_success', { paymentId, status: 'success' });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};

export const getPayments = async (req, res) => {
  try {
    if (isDbConnected()) {
      const snapshot = await db.collection('payments').orderBy('createdAt', 'desc').get();
      const payments = [];
      snapshot.forEach(doc => {
        payments.push({ _id: doc.id, ...doc.data() });
      });
      res.json(payments);
    } else {
      res.json([...mockPayments].reverse());
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isDbConnected()) {
      await db.collection('payments').doc(id).update({ 
        status,
        updatedAt: new Date().toISOString()
      });
      const updatedDoc = await db.collection('payments').doc(id).get();
      res.json({ _id: updatedDoc.id, ...updatedDoc.data() });
    } else {
      const payment = mockPayments.find((p) => p._id === id);
      if (payment) payment.status = status;
      res.json(payment);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      await db.collection('payments').doc(id).delete();
      res.json({ success: true });
    } else {
      const index = mockPayments.findIndex((p) => p._id === id);
      if (index > -1) mockPayments.splice(index, 1);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
