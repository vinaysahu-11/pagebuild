import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import ChatWidget from './ChatWidget';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';

const Pricing = () => {
  const { location, setLocation, pricingServices } = useAppContext();

  const renderIcon = (name, color) => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent size={24} color={color} />;
  };

  // Reference to ChatWidget
  const chatWidgetRef = useRef(null);

  // Helper to open chat and pre-select service
  const handleStartProject = (serviceTitle) => {
    // Try to open chat and set service
    if (window && window.openChatWidget) {
      window.openChatWidget(serviceTitle);
    }
  };

  return (
    <section className="container section-padding" id="pricing" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div className="animate-fade-in" style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>
        Transparent Pricing
      </div>
      <h2 className="text-gradient section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Choose Your Plan</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', fontSize: '1.1rem' }}>
        Premium software and web development in 7 days. See our tailored pricing for your region.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
        <div className="toggle-switch" style={{ padding: '0.5rem', background: 'var(--bg-secondary)' }}>
          <div 
            className={`toggle-option ${location === 'IN' ? 'active' : ''}`}
            onClick={() => setLocation('IN')}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}
          >
            🇮🇳 India (INR)
          </div>
          <div 
            className={`toggle-option ${location === 'US' ? 'active' : ''}`}
            onClick={() => setLocation('US')}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}
          >
            🌐 International (USD)
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
        {pricingServices.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No services available right now.</div>
        )}
        {pricingServices.map((service, index) => (
          <div key={service.id} className="glass-panel animate-fade-in" style={{ 
            animationDelay: `${index * 0.1}s`, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            border: service.popular ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)'
          }}>
            {service.popular && (
              <div style={{ position: 'absolute', top: '-14px', right: '1.5rem', background: 'var(--primary-color)', color: 'white', padding: '0.25rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 10px var(--primary-glow)' }}>
                MOST POPULAR
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: '12px' }}>
                {renderIcon(service.iconName, service.iconColor)}
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>{service.title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '48px' }}>
              {service.desc}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {location === 'IN' ? '₹' : '$'}
              </span>
              <span style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>
                {location === 'IN' ? service.priceIN : service.priceUS}
              </span>
            </div>
            
            <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {service.features.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div style={{ marginTop: '2px' }}><Check size={18} color="var(--primary-color)" /></div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              className={`btn ${service.popular ? 'btn-primary' : 'btn-outline'}`}
              style={{ width: '100%', padding: '1rem' }}
              onClick={() => handleStartProject(service.title)}
            >
              Start Project
            </button>
          </div>
        ))}
      </div>
      <ChatWidget ref={chatWidgetRef} />
    </section>
  );
};

export default Pricing;
