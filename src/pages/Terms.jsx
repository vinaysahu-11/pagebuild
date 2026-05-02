import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
const Terms = () => {
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
          Terms & Conditions
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
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using PageBuild services, you accept and agree to
              be bound by the terms and provision of this agreement. Our 7-day
              turnaround guarantee is subject to timely communication and
              provision of necessary assets from the client side.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              2. Payment Terms
            </h2>
            <p>
              A 50% upfront payment is required to commence development. The
              remaining 50% is due upon project completion and before final
              handover or deployment. Prices may vary based on custom
              requirements not covered in our standard packages.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              3. The 7-Day Guarantee
            </h2>
            <p>
              The 7-day timeline begins only after the initial kickoff meeting
              is completed, all necessary assets (logos, content, credentials)
              are provided, and the initial deposit is cleared. Any delay in
              client feedback will extend the timeline proportionally.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              4. Revisions
            </h2>
            <p>
              Our standard packages include up to two rounds of minor revisions
              within 14 days of project delivery. Major structural or functional
              changes requested post-delivery will be billed at an hourly rate.
            </p>
          </section>

          <section>
            <h2
              style={{
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              5. Intellectual Property
            </h2>
            <p>
              Upon final payment, all custom code, designs, and assets created
              specifically for your project become your intellectual property.
              We reserve the right to showcase the completed work in our
              portfolio unless a Non-Disclosure Agreement (NDA) is signed.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Terms;
