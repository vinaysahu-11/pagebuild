import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus } from 'lucide-react';

const ClientManager = () => {
  const { clients } = useAppContext();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Client Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your active 7-day projects and payments.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> New Client
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Project Type</th>
              <th>Deadline</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td style={{ fontWeight: '500' }}>{client.name}</td>
                <td>{client.project}</td>
                <td>{new Date(client.deadline).toLocaleDateString()}</td>
                <td style={{ fontWeight: '600' }}>{client.amount}</td>
                <td>
                  <span className={`badge ${client.status === 'In Progress' ? 'warning' : 'success'}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${client.payment === 'Paid' ? 'success' : 'warning'}`}>
                    {client.payment}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientManager;
