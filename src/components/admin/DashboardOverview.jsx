import React, { useState, useEffect } from 'react';
import { Users, Eye, DollarSign, CreditCard, TrendingUp, Circle, CheckCircle, Clock, MessageSquare, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../../firebase';

const DashboardOverview = () => {
  const { clients, chats, exchangeRates } = useAppContext();
  const navigate = useNavigate();
  const [dbUsers, setDbUsers] = useState([]);
  const [primaryCurrency, setPrimaryCurrency] = useState('INR');
  const [secondaryCurrency, setSecondaryCurrency] = useState('USD');
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setDbUsers(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  // Parse amount string to get a numeric value and its currency type
  const parseAmount = (amountStr, clientCurrency) => {
    if (amountStr == null) return { value: 0, curr: 'INR' };
    const str = String(amountStr);
    const curr = clientCurrency || (str.includes('$') || str.toUpperCase().includes('USD') ? 'USD' : 'INR');
    const cleanStr = str.replace(/,/g, '').replace(/[^0-9.]/g, '');
    const val = parseFloat(cleanStr) || 0;
    return { value: val, curr };
  };

  // Convert parsed amount to any currency
  const convertTo = (value, fromCurr, toCurr) => {
    if (!exchangeRates || fromCurr === toCurr || !exchangeRates[fromCurr] || !exchangeRates[toCurr]) return value;
    const valueInUSD = value / exchangeRates[fromCurr];
    return valueInUSD * exchangeRates[toCurr];
  };

  const formatCurrency = (val, currCode) => {
    try {
      if (val == null || isNaN(val)) return '';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currCode }).format(val);
    } catch(e) {
      return `${currCode} ${Number(val || 0).toFixed(2)}`;
    }
  };

  // Calculate Revenues for Primary Currency
  let totalRevenue1 = 0;
  let totalRevenue2 = 0;
  let pendingPayments1 = 0;
  let pendingPayments2 = 0;

  clients.forEach(client => {
    const { value, curr } = parseAmount(client.amount, client.currency);
    if (client.payment === 'Paid') {
      totalRevenue1 += convertTo(value, curr, primaryCurrency);
      totalRevenue2 += convertTo(value, curr, secondaryCurrency);
    } else if (client.payment === 'Pending' || client.payment === 'Partial') {
      pendingPayments1 += convertTo(value, curr, primaryCurrency);
      pendingPayments2 += convertTo(value, curr, secondaryCurrency);
    }
  });

  const completedRevenue1 = totalRevenue1;

  // Real data for charts (Empty if no clients, Recharts handles empty gracefully)
  // We try to group revenue by deadline month/day as a basic chart
  const revenueByDate = {};
  clients.forEach(c => {
    if (c.deadline && c.payment === 'Paid') {
      const d = new Date(c.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!revenueByDate[d]) revenueByDate[d] = 0;
      const { value, curr } = parseAmount(c.amount, c.currency);
      revenueByDate[d] += convertTo(value, curr, primaryCurrency);
    }
  });
  const revenueData = Object.keys(revenueByDate).map(key => ({
    name: key,
    revenue: Math.round(revenueByDate[key])
  }));

  // Visitor data from Firebase users (grouped by creation date)
  const visitorsByDate = {};
  dbUsers.forEach(u => {
    if (u.createdAt) {
      const d = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!visitorsByDate[d]) visitorsByDate[d] = 0;
      visitorsByDate[d] += 1;
    }
  });
  const visitorData = Object.keys(visitorsByDate).map(key => ({
    name: key,
    visitors: visitorsByDate[key]
  }));

  const donutData = [
    { name: 'Completed', value: completedRevenue1, color: '#10b981' },
    { name: 'Pending', value: pendingPayments1, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  // Top Services (Derived from actual clients)
  const serviceMap = {};
  clients.forEach(c => {
    const proj = c.project || 'Unknown';
    if (!serviceMap[proj]) serviceMap[proj] = { name: proj, orders: 0, revenue: 0 };
    serviceMap[proj].orders += 1;
    if(c.payment === 'Paid') {
      const { value, curr } = parseAmount(c.amount, c.currency);
      serviceMap[proj].revenue += convertTo(value, curr, primaryCurrency);
    }
  });
  const topServices = Object.values(serviceMap)
    .sort((a, b) => b.orders - a.orders)
    .map(s => ({
      ...s,
      revenueStr: formatCurrency(s.revenue, primaryCurrency),
      percent: clients.length > 0 ? Math.round((s.orders / clients.length) * 100) : 0
    }));

  // Live Activity from actual chats
  const liveActivities = [...chats]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 4)
    .map(c => ({
      icon: <MessageSquare size={14} />,
      color: c.sender === 'user' ? 'var(--neon-blue)' : 'var(--success)',
      title: c.sender === 'user' ? 'New message from visitor' : 'Admin replied',
      sub: c.text.substring(0, 40) + (c.text.length > 40 ? '...' : ''),
      time: new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

  const conversions = clients.filter(c => c.status === 'Completed').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Admin! Here's what's happening with your business today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={primaryCurrency} 
            onChange={(e) => setPrimaryCurrency(e.target.value)} 
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', outline: 'none' }}
          >
            {Object.keys(exchangeRates || { INR: 1, USD: 1 }).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            value={secondaryCurrency} 
            onChange={(e) => setSecondaryCurrency(e.target.value)} 
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', outline: 'none' }}
          >
            {Object.keys(exchangeRates || { INR: 1, USD: 1 }).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
            Real-time Conversions
          </div>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        <MetricCard title="Total Visitors" value={dbUsers.length} icon={<Users size={20} color="var(--neon-purple)" />} percent="" graphColor="var(--neon-purple)" />
        <MetricCard title="Total Clients" value={clients.length} icon={<Briefcase size={20} color="var(--neon-blue)" />} percent="" graphColor="var(--neon-blue)" />
        <MetricCard title="Total Revenue" value={formatCurrency(totalRevenue1, primaryCurrency)} subValue={formatCurrency(totalRevenue2, secondaryCurrency)} icon={<DollarSign size={20} color="var(--success)" />} percent="" graphColor="var(--success)" />
        <MetricCard title="Pending Payments" value={formatCurrency(pendingPayments1, primaryCurrency)} subValue={formatCurrency(pendingPayments2, secondaryCurrency)} icon={<CreditCard size={20} color="var(--warning)" />} percent="" isNegative graphColor="var(--warning)" />
        <MetricCard title="Conversions" value={conversions} icon={<TrendingUp size={20} color="var(--secondary-color)" />} percent="" graphColor="var(--secondary-color)" />
      </div>

      {/* Main Grid: Charts & Live Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr', gap: '1.5rem' }}>
        
        {/* Visitors Chart */}
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Visitors Over Time</h3>
          </div>
          <div style={{ height: '200px' }}>
            {visitorData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No visitor data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="visitors" stroke="var(--neon-purple)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-color)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Expected Revenue Over Time</h3>
          </div>
          <div style={{ height: '200px' }}>
            {revenueData.length === 0 ? (
               <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No revenue data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, primaryCurrency)} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} formatter={(value) => [formatCurrency(value, primaryCurrency), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--success)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-color)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Live Activity */}
        <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Live Activity</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
              <Circle size={8} fill="currentColor" /> Live
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            {liveActivities.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No recent activity</div>
            ) : (
              liveActivities.map((act, i) => <ActivityItem key={i} {...act} />)
            )}
          </div>
          <button onClick={() => navigate('/admin/chats')} className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}>View All Chats</button>
        </div>

      </div>

      {/* Third Row: Services, Funnel, Revenue Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr', gap: '1.5rem' }}>
        
        {/* Top Services */}
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Top Services (Real Data)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topServices.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No services booked yet</div>
            ) : (
              topServices.map((srv, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)', width: '15px' }}>{idx + 1}</span>
                  <span style={{ flex: 1, fontWeight: '500' }}>{srv.name}</span>
                  <span style={{ color: 'var(--text-secondary)', width: '60px', textAlign: 'right' }}>{srv.orders} Orders</span>
                  <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${srv.percent}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                  </div>
                  <span style={{ width: '60px', textAlign: 'right', fontWeight: '600' }}>{srv.revenueStr}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Sales Funnel</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', marginTop: '1rem' }}>
            {dbUsers.length === 0 && clients.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No funnel data yet</div>
            ) : (
              <>
                <FunnelLayer width="100%" color="var(--neon-blue)" label={`${dbUsers.length} Visitors`} percent="100%" />
                <FunnelLayer width="60%" color="var(--warning)" label={`${clients.length} Leads`} percent={dbUsers.length > 0 ? `${Math.round((clients.length/dbUsers.length)*100)}%` : '0%'} />
                <FunnelLayer width="30%" color="var(--success)" label={`${conversions} Conversions`} percent={clients.length > 0 ? `${Math.round((conversions/clients.length)*100)}%` : '0%'} />
              </>
            )}
          </div>
        </div>

        {/* Revenue Summary Donut */}
        <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Revenue Summary</h3>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {totalRevenue1 === 0 && pendingPayments1 === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>No revenue yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={donutData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} formatter={(value) => formatCurrency(value, primaryCurrency)} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{formatCurrency(totalRevenue1 + pendingPayments1, primaryCurrency)}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Acc.</div>
                </div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Circle size={10} fill="var(--success)" color="var(--success)" /> Completed</div>
              <div style={{ fontWeight: '600' }}>{formatCurrency(completedRevenue1, primaryCurrency)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Circle size={10} fill="var(--warning)" color="var(--warning)" /> Pending</div>
              <div style={{ fontWeight: '600' }}>{formatCurrency(pendingPayments1, primaryCurrency)}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Fourth Row: Clients Table & Quick Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 1.5fr', gap: '1.5rem' }}>
        
        {/* Recent Clients */}
        <div className="stat-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Recent Clients & Projects</h3>
            <button onClick={() => navigate('/admin/clients')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', border: 'none', color: 'var(--primary-color)' }}>View All Projects →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500' }}>Client</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500' }}>Project</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500' }}>Value</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: '500' }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent clients</td></tr>
                ) : (
                  clients.slice(0, 4).map((client, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== Math.min(clients.length-1, 3) ? '1px solid var(--glass-border)' : 'none' }}>
                      <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Users size={14} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{client.name}</span>
                      </td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{client.project}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', background: client.status === 'Completed' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', color: client.status === 'Completed' ? 'var(--success)' : 'var(--primary-color)' }}>{client.status}</span>
                      </td>
                      <td style={{ padding: '1rem 0', fontWeight: '600' }}>{client.amount}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                             <div style={{ width: client.status === 'Completed' ? '100%' : '60%', height: '100%', background: client.status === 'Completed' ? 'var(--success)' : 'var(--primary-color)', borderRadius: '2px' }}></div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{client.status === 'Completed' ? '100%' : '60%'}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Quick Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            <SummaryItem icon={<Users size={16} />} color="var(--primary-color)" label="Active Projects" value={clients.filter(c => c.status !== 'Completed').length} />
            <SummaryItem icon={<Users size={16} />} color="var(--neon-blue)" label="Total Clients" value={clients.length} />
            <SummaryItem icon={<CheckCircle size={16} />} color="var(--success)" label="Total Conversions" value={conversions} />
            <SummaryItem icon={<DollarSign size={16} />} color="var(--warning)" label="Total Revenue" value={formatCurrency(totalRevenue1, primaryCurrency)} />
          </div>
        </div>

      </div>

    </div>
  );
};

// Sub-components for smaller pieces
const MetricCard = ({ title, value, subValue, icon, percent, isNegative, graphColor }) => (
  <div className="stat-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: '700' }}>{value}</span>
        {percent && <span style={{ fontSize: '0.75rem', fontWeight: '600', color: isNegative ? 'var(--danger)' : 'var(--success)' }}>{percent}</span>}
      </div>
      {subValue && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{subValue}</span>}
    </div>
    {/* Decorative mini graph line */}
    <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.5 }}>
      <path d="M0 20 Q 10 5, 20 15 T 40 10 T 60 15 T 80 5 T 100 15 L 100 20 L 0 20" fill={`url(#gradient-${title.replace(/\s+/g,'')})`} opacity="0.2" />
      <path d="M0 20 Q 10 5, 20 15 T 40 10 T 60 15 T 80 5 T 100 15" fill="none" stroke={graphColor} strokeWidth="2" />
      <defs>
        <linearGradient id={`gradient-${title.replace(/\s+/g,'')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={graphColor} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={graphColor} stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const ActivityItem = ({ icon, color, title, sub, time }) => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: '1.2' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{sub}</div>
    </div>
    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{time}</div>
  </div>
);

const FunnelLayer = ({ width, color, label, percent }) => (
  <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4px' }}>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: width, height: '36px', background: color, clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>
        {label}
      </div>
    </div>
    <div style={{ width: '50px', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>{percent}</div>
  </div>
);

const SummaryItem = ({ icon, color, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
    </div>
    <span style={{ fontWeight: '600' }}>{value}</span>
  </div>
);

export default DashboardOverview;
