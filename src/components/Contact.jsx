import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <section className="container section-padding" id="contact" style={{ padding: '5rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="text-gradient section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get in Touch</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Have a project in mind? We're ready to build it. Reach out to us below or use the live chat.
        </p>
      </div>

      <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        
        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Us</h4>
              <p style={{ color: 'var(--text-secondary)' }}>vinaysahu11102006@gmail.com</p>
            </div>
          </div>
          
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%', color: 'var(--secondary-color)' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Call Us</h4>
              <p style={{ color: 'var(--text-secondary)' }}>+91 97708 50156</p>
            </div>
          </div>
          
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: 'var(--success)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Location</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Raipur, Chhattisgarh, India</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel">
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
              <input type="email" placeholder="Your Email" style={{ width: '100%', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Message</label>
              <textarea placeholder="Tell us about your project..." rows="4" style={{ width: '100%', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none', resize: 'vertical' }}></textarea>
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
