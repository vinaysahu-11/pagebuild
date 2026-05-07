import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

export default function PayPalCheckout({ amount, currency, service, user, paymentDetails, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const db = getFirestore(app);

  return (
    <div className="w-full">
      <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: 'USD' }}>
        <PayPalButtons
          style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
          disabled={loading}
          createOrder={async () => {
            setLoading(true);
            setError(null);
            try {
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
              const data = await res.json();
              if (!data.success) {
                throw new Error(data.message || 'Failed to create PayPal order.');
              }
              setLoading(false);
              return data.orderId;
            } catch (err) {
              setError(err.message);
              setLoading(false);
              return null;
            }
          }}
          onApprove={async (data) => {
            setLoading(true);
            setError(null);
            try {
              // The backend webhook will handle the capture and DB update.
              // Here we just update the local state to reflect completion.
              const paymentRef = doc(db, 'chats', user.uid, 'messages', paymentDetails.id);
              await updateDoc(paymentRef, {
                status: 'paid',
                paypal_order_id: data.orderID,
              });
              if (onSuccess) onSuccess();
              alert('Payment Successful!');
            } catch (err) {
              setError('Failed to finalize payment.');
            } finally {
              setLoading(false);
            }
          }}
          onError={(err) => {
            setError('PayPal error: ' + err);
            setLoading(false);
          }}
        />
      </PayPalScriptProvider>
      {loading && <div className="text-center p-2">Processing payment...</div>}
      {error && <div className="text-center p-2 text-red-500">{error}</div>}
    </div>
  );
}
