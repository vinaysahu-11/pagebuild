import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
const Footer = () => {
  const navigate = useNavigate();
  const handleClick = (e, path, isHash) => {
    e.preventDefault();
    if (isHash) {
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(path);
          if (el)
            el.scrollIntoView({
              behavior: 'smooth',
            });
        }, 100);
      } else {
        const el = document.querySelector(path);
        if (el)
          el.scrollIntoView({
            behavior: 'smooth',
          });
      }
    } else {
      navigate(path);
    }
  };
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        marginTop: '4rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {}
          <div
            style={{
              gridColumn: '1 / -1',
              '@media (min-width: 768px)': {
                gridColumn: 'span 2',
              },
            }}
          >
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <Zap color="var(--primary-color)" fill="var(--primary-color)" />{' '}
              PageBuild
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
                maxWidth: '300px',
              }}
            >
              We build premium, scalable, and fully functional web apps and
              software solutions in just 7 days.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
              }}
            >
              <a
                href="https://twitter.com/pagebuild"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s',
                  fontWeight: '500',
                }}
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/pagebuild"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s',
                  fontWeight: '500',
                }}
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/pagebuild"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s',
                  fontWeight: '500',
                }}
              >
                Instagram
              </a>
            </div>
          </div>

          {}
          <div>
            <h4
              style={{
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                color: 'white',
              }}
            >
              Services
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <li>
                <a
                  href="#pricing"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#pricing', true)}
                >
                  Landing Pages
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#pricing', true)}
                >
                  Business Websites
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#pricing', true)}
                >
                  E-commerce Stores
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#pricing', true)}
                >
                  SaaS MVP
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                color: 'white',
              }}
            >
              Company
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <li>
                <a
                  href="#about"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#about', true)}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#testimonials', true)}
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#blog', true)}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '#contact', true)}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                color: 'white',
              }}
            >
              Legal
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <li>
                <a
                  href="/terms"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '/terms', true)}
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => handleClick(e, '/privacy', true)}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          <p>
            &copy; {new Date().getFullYear()} PageBuild. All rights reserved.
          </p>
        </div>
      </div>
      <style>{`
        .footer-link-animate {
          box-shadow: 0 0 0 3px var(--primary-color);
          border-radius: 6px;
          background: rgba(99,102,241,0.08);
          transition: box-shadow 0.2s, background 0.2s;
        }
      `}</style>
    </footer>
  );
};
export default Footer;
