import { useEffect, useState } from 'react';

export default function PaymentsAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState({ paypal: true, razorpay: true });

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      const res = await fetch('/api/payments');
      const data = await res.json();
      setPayments(data);
      setLoading(false);
    }
    fetchPayments();
  }, []);

  // Persist payment method enable/disable state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('paymentMethodsEnabled');
    if (saved) setEnabled(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem('paymentMethodsEnabled', JSON.stringify(enabled));
  }, [enabled]);

  return (
    <div>
      <h2>Payments Admin Panel</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={enabled.paypal}
            onChange={e => setEnabled({ ...enabled, paypal: e.target.checked })}
          />
          Enable PayPal
        </label>
        {'  '}
        <label>
          <input
            type="checkbox"
            checked={enabled.razorpay}
            onChange={e => setEnabled({ ...enabled, razorpay: e.target.checked })}
          />
          Enable Razorpay
        </label>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Provider</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.transaction_id || p._id}>
                <td>{p.provider}</td>
                <td>{p.user_id}</td>
                <td>{p.amount}</td>
                <td>{p.status}</td>
                <td>{p.transaction_id}</td>
                <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{marginTop: 16, color: '#888'}}>
        <b>Note:</b> Toggling payment methods here only affects the UI. To enforce on/off in backend, check these flags before showing payment options or processing payments.
      </div>
    </div>
  );
}
