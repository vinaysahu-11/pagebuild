import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut, Zap } from 'lucide-react';
import ClientManager from '../components/admin/ClientManager';
import ChatManager from '../components/admin/ChatManager';
import { useAppContext } from '../context/AppContext';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clients, chats, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalRevenue = clients.reduce((acc, client) => {
    const val = client.amount.replace(/[^0-9]/g, '');
    return acc + (parseInt(val) || 0);
  }, 0);

  const unreadChats = chats.filter(c => c.sender === 'user').length; // Simplification

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: '800' }}>
          <Zap color="var(--primary-color)" fill="var(--primary-color)" /> PageBuild Admin
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/clients" className={`nav-item ${location.pathname === '/admin/clients' ? 'active' : ''}`}>
            <Users size={20} /> Clients & Projects
          </Link>
          <Link to="/admin/chats" className={`nav-item ${location.pathname === '/admin/chats' ? 'active' : ''}`} style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageSquare size={20} /> Live Chats
            </div>
            {unreadChats > 0 && (
              <div style={{ background: 'var(--primary-color)', color: 'white', fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 'bold' }}>
                New
              </div>
            )}
          </Link>
          <Link to="/admin/settings" className={`nav-item ${location.pathname === '/admin/settings' ? 'active' : ''}`}>
            <Settings size={20} /> Settings
          </Link>
        </nav>

        <button onClick={handleLogout} className="nav-item" style={{ marginTop: 'auto', color: 'var(--danger)', background: 'transparent', border: 'none', textAlign: 'left', width: '100%', fontSize: '1rem' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin-main">
        <Routes>
          <Route path="/" element={
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Overview</h2>
              <div className="dashboard-grid">
                <div className="stat-card">
                  <div className="stat-card-title">Active Projects</div>
                  <div className="stat-card-value">{clients.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-title">Pending Payments</div>
                  <div className="stat-card-value">{clients.filter(c => c.payment === 'Pending').length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-title">Estimated Revenue</div>
                  <div className="stat-card-value">{totalRevenue > 10000 ? `₹${totalRevenue}` : `$${totalRevenue}`}</div>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <ClientManager />
              </div>
            </div>
          } />
          <Route path="/clients" element={<div className="animate-fade-in"><ClientManager /></div>} />
          <Route path="/chats" element={<div className="animate-fade-in"><ChatManager /></div>} />
          <Route path="/settings" element={
            <div className="animate-fade-in glass-panel">
              <h2 style={{ marginBottom: '1rem' }}>Settings</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Admin settings, payment gateway configuration, and notifications will be managed here.</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
