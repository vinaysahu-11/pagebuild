import { useEffect, useState } from 'react';

export default function PayPalPaymentsAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      const res = await fetch('/api/payments');
      const data = await res.json();
      setPayments(data.filter(p => p.provider === 'paypal'));
      setLoading(false);
    }
    fetchPayments();
  }, []);

  return (
    <div>
      <h2>PayPal Payments</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
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
    </div>
  );
}
