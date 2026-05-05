import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, success, pending, failed

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/payments`);
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchPayments();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchPayments();
    } catch (err) {
      console.error('Error deleting payment:', err);
    }
  };

  const filteredPayments = payments.filter(p => filter === 'all' || p.status === filter);

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + (p.currency === 'USD' ? p.amount * 83.5 : p.amount), 0); // Approx INR conversion for total if mixed

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Payments & Orders</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your client transactions</p>
        </div>
        <button onClick={fetchPayments} className="btn btn-primary">Refresh Data</button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', borderRadius: '12px' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Revenue (Est. INR)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', color: '#facc15', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending Payments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingCount}</div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <Filter size={20} color="var(--text-secondary)" />
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              padding: '0.5rem',
              borderRadius: '8px',
              outline: 'none'
            }}
          >
            <option value="all">All Payments</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Txn ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Service</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Gateway</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading payments...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No payments found.</td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', opacity: 0.8 }}>
                        {payment.transactionId || payment._id.slice(-8)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{payment.serviceName}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      {payment.currency === 'INR' ? '₹' : '$'}{payment.amount}
                    </td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{payment.gateway}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: payment.status === 'success' ? 'rgba(34, 197, 94, 0.2)' : 
                                    payment.status === 'pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: payment.status === 'success' ? '#4ade80' : 
                               payment.status === 'pending' ? '#facc15' : '#f87171'
                      }}>
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(payment._id, 'success')}
                            style={{ background: 'transparent', border: 'none', color: '#4ade80', cursor: 'pointer' }}
                            title="Mark as Success"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => deletePayment(payment._id)}
                          style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManager;
