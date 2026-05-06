import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pricing from '../components/Pricing';
import ChatWidget from '../components/ChatWidget';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Contact from '../components/Contact';
import Blog from '../components/Blog';
import Footer from '../components/Footer';
import { Zap, Code, Shield, Clock } from 'lucide-react';
const LandingPage = () => {
  const { theme, setTheme } = useAppContext();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return (
    <div>
      {}
      <button
        aria-label={
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        }
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 1000,
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          transition: 'background 0.2s, border 0.2s',
        }}
      >
        {theme === 'dark' ? (
          <Sun size={22} color="var(--primary-color)" />
        ) : (
          <Moon size={22} color="var(--primary-color)" />
        )}
      </button>
      {}
      <nav
        style={{
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <img src="/logo.png" alt="PageBuild Logo" style={{ height: '32px', width: 'auto' }} />
          PAGEBUILD
        </div>

        {}
        <div
          className="hide-on-mobile"
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          <a
            href="#about"
            style={{
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}
          >
            About
          </a>
          <a
            href="#pricing"
            style={{
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            style={{
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}
          >
            Reviews
          </a>
          <a
            href="#contact"
            style={{
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}
          >
            Contact
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <Link
            to="/admin"
            className="btn btn-outline"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
            }}
          >
            Admin
          </Link>
        </div>
      </nav>

      {}
      <header className="container hero-header">
        <div className="animate-fade-in hero-badge">
          🚀 Launch your dream project today
        </div>
        <h1 className="hero-title">
          Any Website, Software or App in{' '}
          <span className="text-gradient">7 Days.</span>
        </h1>
        <p className="hero-subtitle">
          Stop waiting months for your product. We build premium, fully
          functional web apps and software solutions in just one week.
          Guaranteed.
        </p>
        <div className="hero-buttons">
          <a href="#pricing" className="btn btn-primary">
            Start Your Project
          </a>
          <a href="#about" className="btn btn-outline">
            Learn More
          </a>
        </div>
      </header>

      {}
      <section
        className="container section-padding"
        style={{
          padding: '4rem 1.5rem',
        }}
      >
        <div className="dashboard-grid">
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                marginBottom: '1rem',
                color: 'var(--primary-color)',
              }}
            >
              <Clock size={32} />
            </div>
            <h3
              style={{
                marginBottom: '0.5rem',
              }}
            >
              1-Week Turnaround
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              We work fast without compromising on quality.
            </p>
          </div>
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'rgba(236, 72, 153, 0.1)',
                borderRadius: '12px',
                marginBottom: '1rem',
                color: 'var(--secondary-color)',
              }}
            >
              <Code size={32} />
            </div>
            <h3
              style={{
                marginBottom: '0.5rem',
              }}
            >
              Full Stack Solutions
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              From simple landing pages to complex SaaS platforms.
            </p>
          </div>
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                marginBottom: '1rem',
                color: 'var(--success)',
              }}
            >
              <Shield size={32} />
            </div>
            <h3
              style={{
                marginBottom: '0.5rem',
              }}
            >
              Fully Secure & Scalable
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              Built with modern technologies ready to scale.
            </p>
          </div>
        </div>
      </section>

      <About />
      <Pricing />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />

      <ChatWidget />
    </div>
  );
};
export default LandingPage;
