import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

export default function PayPalCheckout({ amount, user_id, onSuccess }) {
  const [loading, setLoading] = useState(false);
  return (
    <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={async () => {
          setLoading(true);
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency: 'USD', user_id })
          });
          const data = await res.json();
          setLoading(false);
          return data.orderID;
        }}
        onApprove={async (data) => {
          setLoading(true);
          await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID })
          });
          setLoading(false);
          if (onSuccess) onSuccess();
        }}
        onError={(err) => {
          setLoading(false);
          alert('PayPal error: ' + err);
        }}
      />
      {loading && <div>Processing payment...</div>}
    </PayPalScriptProvider>
  );
}
