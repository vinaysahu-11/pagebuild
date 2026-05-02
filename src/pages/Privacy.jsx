import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
const Privacy = () => {
  return (
    <div>
      <nav
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>
      </nav>

      <main
        className="container"
        style={{
          padding: '4rem 1.5rem',
          maxWidth: '800px',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            marginBottom: '2rem',
          }}
        >
          Privacy Policy
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}
        >
          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when
              you fill out a contact form, use our live chat, request a quote,
              or communicate with us via email. This may include your name,
              email address, phone number, and project details.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect to provide, maintain, and
              improve our services. Specifically, we use it to communicate with
              you about your project, process payments, and send important
              notices regarding our service.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              3. Information Sharing
            </h2>
            <p>
              We do not share your personal information with third parties
              except as necessary to provide our services (e.g., sharing with
              payment processors like Stripe or Razorpay) or when required by
              law. We will never sell your personal data.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              4. Data Security
            </h2>
            <p>
              We take reasonable measures to help protect information about you
              from loss, theft, misuse, and unauthorized access, disclosure,
              alteration, and destruction. However, no internet transmission is
              ever fully secure.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              5. Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar tracking technologies to track the
              activity on our Service and hold certain information. You can
              instruct your browser to refuse all cookies or to indicate when a
              cookie is being sent.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Privacy;
