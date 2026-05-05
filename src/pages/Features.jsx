import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Zap, Shield, Globe, Smartphone, CreditCard, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuresList = [
  {
    icon: <Clock size={32} />,
    title: '7-Day Fast Delivery',
    description: 'We build and launch your premium professional website within just 7 days, so you can start growing immediately.'
  },
  {
    icon: <Smartphone size={32} />,
    title: 'Mobile-First Design',
    description: 'Every website is fully responsive and optimized for mobile devices, ensuring a flawless experience for all users.'
  },
  {
    icon: <Zap size={32} />,
    title: 'High Performance & Speed',
    description: 'Our sites are built on modern stacks like React and Vite, delivering blazing fast load times for better SEO.'
  },
  {
    icon: <MessageSquare size={32} />,
    title: 'Real-Time Chat Widget',
    description: 'Engage with your visitors instantly using our integrated real-time chat, turning prospects into paying clients.'
  },
  {
    icon: <CreditCard size={32} />,
    title: 'Integrated Payments',
    description: 'Accept local and international payments seamlessly with built-in Razorpay (INR) and PayPal (USD) gateways.'
  },
  {
    icon: <Shield size={32} />,
    title: 'Secure Admin Dashboard',
    description: 'Manage your clients, chat sessions, and payment requests from a secure, easy-to-use private admin panel.'
  },
  {
    icon: <Globe size={32} />,
    title: 'SEO Optimized',
    description: 'Built-in technical SEO with proper meta tags, sitemaps, and clean code to help you rank higher on Google.'
  },
  {
    icon: <CheckCircle size={32} />,
    title: 'Zero Technical Headaches',
    description: 'We handle everything from deployment to hosting and database management so you can focus on your business.'
  }
];

const Features = () => {
  useEffect(() => {
    document.title = 'All Features & Services | PageBuild SaaS';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore all the premium features of PageBuild, including 7-day delivery, real-time chat, integrated payments, and mobile-first design.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Explore all the premium features of PageBuild, including 7-day delivery, real-time chat, integrated payments, and mobile-first design.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1200px', padding: '2rem 1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '2rem', fontWeight: '500' }}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Capabilities</span>
          <h1 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Everything You Need To Grow Online
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            We provide an end-to-end SaaS platform for agencies and freelancers to establish a premium online presence and manage clients effortlessly.
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {featuresList.map((feature, index) => (
            <div key={index} className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to experience these features?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join PageBuild today and launch your professional business website in just 7 days.
          </p>
          <Link to="/#contact" className="btn btn-primary" onClick={() => {
            setTimeout(() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
