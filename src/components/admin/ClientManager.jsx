import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const ClientManager = () => {
  const { clients, addClient, updateClient, deleteClient, pricingServices, exchangeRates } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    deadline: '',
    amount: '',
    currency: 'INR',
    status: 'New Lead',
    payment: 'Pending'
  });

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client.id);
      setFormData({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        project: client.project || '',
        deadline: client.deadline ? new Date(client.deadline).toISOString().split('T')[0] : '',
        amount: client.amount || '',
        currency: client.currency || (client.amount && client.amount.includes('$') ? 'USD' : 'INR'),
        status: client.status,
        payment: client.payment
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        project: '',
        deadline: '',
        amount: '',
        currency: 'INR',
        status: 'New Lead',
        payment: 'Pending'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient, formData);
    } else {
      addClient(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClient(id);
    }
  };

  const handleProjectChange = (e) => {
    const selectedTitle = e.target.value;
    const service = pricingServices.find(s => s.title === selectedTitle);
    setFormData({
      ...formData,
      project: selectedTitle,
      amount: service ? (formData.currency === 'USD' ? `$${service.priceUS}` : `₹${service.priceIN}`) : formData.amount
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Client Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your active 7-day projects and payments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> New Client
        </button>
      </div>

      <div className="table-container">
        {clients.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No clients available. When visitors sign up via chat, they will appear here.
          </div>
        ) : (
          <>
            <div className="hide-on-mobile">
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
                      <td style={{ fontWeight: '500' }}>
                        {client.name}
                        {(client.email || client.phone) && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginTop: '0.2rem' }}>
                            {client.email} {client.email && client.phone ? ' | ' : ''} {client.phone}
                          </div>
                        )}
                      </td>
                      <td>{client.project || '-'}</td>
                      <td>{client.deadline ? new Date(client.deadline).toLocaleDateString() : '-'}</td>
                      <td style={{ fontWeight: '600' }}>{client.amount || '-'}</td>
                      <td>
                        <span className={`badge ${client.status === 'In Progress' ? 'warning' : client.status === 'New Lead' ? 'primary' : 'success'}`}>
                          {client.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${client.payment === 'Paid' ? 'success' : 'warning'}`}>
                          {client.payment}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenModal(client)} className="btn btn-outline" style={{ padding: '0.4rem', border: 'none', background: 'rgba(255,255,255,0.1)' }}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(client.id)} className="btn btn-outline" style={{ padding: '0.4rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="show-on-mobile-block" style={{ display: 'none', padding: '1rem' }}>
              {clients.map(client => (
                <div key={client.id} className="mobile-client-card">
                  <div className="mobile-client-header">
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{client.name}</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(client)} className="btn btn-outline" style={{ padding: '0.4rem', border: 'none' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="btn btn-outline" style={{ padding: '0.4rem', border: 'none', color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {(client.email || client.phone) && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {client.email} {client.email && client.phone ? ' | ' : ''} {client.phone}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Project</div>
                      <div>{client.project || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Deadline</div>
                      <div>{client.deadline ? new Date(client.deadline).toLocaleDateString() : '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Amount</div>
                      <div style={{ fontWeight: '600' }}>{client.amount || '-'}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Status / Payment</div>
                      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.2rem' }}>
                        <span className={`badge ${client.status === 'In Progress' ? 'warning' : client.status === 'New Lead' ? 'primary' : 'success'}`} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>
                          {client.status}
                        </span>
                        <span className={`badge ${client.payment === 'Paid' ? 'success' : 'warning'}`} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>
                          {client.payment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Client Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email (Optional)</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone (Optional)</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Project Type</label>
                  <select value={formData.project} onChange={handleProjectChange} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }}>
                    <option value="" disabled>Select a service...</option>
                    {pricingServices.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Custom Project">Custom Project</option>
                  </select>
                </div>
                <div style={{ width: '120px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Currency</label>
                  <select required value={formData.currency} onChange={e => {
                    const newCurrency = e.target.value;
                    let newAmount = formData.amount;
                    if (formData.project) {
                      const srv = pricingServices.find(s => s.title === formData.project);
                      if (srv) {
                        // Very rough fallback if they pick a currency we don't have predefined prices for,
                        // we could convert priceUS to their new currency, but simplest is keeping the raw USD price format for now or converting.
                        // Let's just leave it blank for manual entry if it's not INR or USD.
                        if (newCurrency === 'USD') newAmount = `$${srv.priceUS}`;
                        else if (newCurrency === 'INR') newAmount = `₹${srv.priceIN}`;
                        else newAmount = ''; 
                      }
                    }
                    setFormData({...formData, currency: newCurrency, amount: newAmount});
                  }} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }}>
                    {exchangeRates ? Object.keys(exchangeRates).map(c => (
                      <option key={c} value={c}>{c}</option>
                    )) : (
                      <>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Deadline</label>
                  <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount</label>
                  <input type="text" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="e.g. ₹40,000 or TBD" style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }}>
                    <option value="New Lead">New Lead</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Payment</label>
                  <select value={formData.payment} onChange={e => setFormData({...formData, payment: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px' }}>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {editingClient ? 'Save Changes' : 'Add Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManager;
