import React from 'react';
import { Target, Users, Zap } from 'lucide-react';

const About = () => {
  return (
    <section className="container" id="about" style={{ padding: '5rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div className="animate-fade-in" style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>
            About Us
          </div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>We build products at <span className="text-gradient">warp speed.</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Traditional development agencies take months to deliver basic websites and charge exorbitant fees. We recognized that startups and businesses need to move fast.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
            PageBuild was founded to bridge this gap. Using modern tech stacks, robust pre-built modules, and a highly skilled team, we guarantee delivery of premium digital products in exactly one week.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>100+</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Projects Delivered</p>
            </div>
            <div>
              <h4 style={{ fontSize: '2rem', color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>100%</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>On-time Delivery</p>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div className="glass-panel" style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.05)', padding: '3rem 2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', height: 'fit-content' }}>
                  <Zap color="var(--primary-color)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Speed</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>7 days from requirement gathering to deployment.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', height: 'fit-content' }}>
                  <Target color="var(--secondary-color)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Precision</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pixel-perfect design and bug-free code.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', height: 'fit-content' }}>
                  <Users color="var(--warning)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Partnership</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We act as your technical co-founders.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative glow behind the panel */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'var(--primary-glow)', filter: 'blur(80px)', zIndex: 1, borderRadius: '50%' }}></div>
        </div>
      </div>
    </section>
  );
};

export default About;
