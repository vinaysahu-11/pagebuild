import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut, Zap, Briefcase, CreditCard, BarChart3, Megaphone, Layers, Moon, Sun } from 'lucide-react';
import ClientManager from '../components/admin/ClientManager';
import ChatManager from '../components/admin/ChatManager';
import DashboardOverview from '../components/admin/DashboardOverview';
import ServiceManager from '../components/admin/ServiceManager';
import { useAppContext } from '../context/AppContext';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clients, chats, logout } = useAppContext();

  // Admin specific theme logic
  const [adminTheme, setAdminTheme] = React.useState(() => {
    return localStorage.getItem('adminTheme') || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const safeClients = clients || [];
  const safeChats = chats || [];

  const totalRevenue = safeClients.reduce((acc, client) => {
    const amountStr = String(client?.amount || '');
    const val = amountStr.replace(/[^0-9]/g, '');
    return acc + (parseInt(val) || 0);
  }, 0);

  const unreadChats = safeChats.filter(c => c.sender === 'user').length; // Simplification

  return (
    <div className="admin-layout" data-theme={adminTheme} style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', transition: 'all 0.3s' }}>
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ transition: 'all 0.3s' }}>
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
          <Link to="/admin/services" className={`nav-item ${location.pathname === '/admin/services' ? 'active' : ''}`}>
            <Briefcase size={20} /> Services
          </Link>
          <Link to="/admin/orders" className={`nav-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
            <CreditCard size={20} /> Orders & Payments
          </Link>
          <Link to="/admin/analytics" className={`nav-item ${location.pathname === '/admin/analytics' ? 'active' : ''}`}>
            <BarChart3 size={20} /> Analytics
          </Link>
          <Link to="/admin/marketing" className={`nav-item ${location.pathname === '/admin/marketing' ? 'active' : ''}`}>
            <Megaphone size={20} /> Marketing
          </Link>
          <Link to="/admin/team" className={`nav-item ${location.pathname === '/admin/team' ? 'active' : ''}`}>
            <Layers size={20} /> Team
          </Link>
          <Link to="/admin/settings" className={`nav-item ${location.pathname === '/admin/settings' ? 'active' : ''}`}>
            <Settings size={20} /> Settings
          </Link>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
          <button onClick={toggleTheme} className="nav-item" style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%', fontSize: '1rem' }}>
            {adminTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} 
            {adminTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout} className="nav-item" style={{ color: 'var(--danger)', background: 'transparent', border: 'none', textAlign: 'left', width: '100%', fontSize: '1rem' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/clients" element={<div className="animate-fade-in"><ClientManager /></div>} />
          <Route path="/services" element={<div className="animate-fade-in"><ServiceManager /></div>} />
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
