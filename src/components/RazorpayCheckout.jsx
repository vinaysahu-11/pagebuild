import React, { useEffect, useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const RazorpayCheckout = ({ amount, currency, service, user, paymentDetails }) => {
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK could not be loaded. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order on backend
      const res = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          serviceName: service,
          userId: user.uid,
          chatId: user.uid,
        }),
      });
      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error('Order creation failed');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Company Name',
        description: `Payment for ${service}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // 3. Verify payment and update status
          const paymentRef = doc(db, 'chats', user.uid, 'messages', paymentDetails.id);
          await updateDoc(paymentRef, {
            status: 'paid',
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          alert('Payment Successful!');
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response) {
        const paymentRef = doc(db, 'chats', user.uid, 'messages', paymentDetails.id);
        await updateDoc(paymentRef, { status: 'failed' });
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error('Razorpay Error:', error);
      alert('An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
    >
      {loading ? 'Processing...' : `Pay with Razorpay`}
    </button>
  );
};

export default RazorpayCheckout;
