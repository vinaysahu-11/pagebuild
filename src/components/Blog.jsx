import React from 'react';
import { ArrowRight } from 'lucide-react';
const Blog = () => {
  const posts = [
    {
      title: 'Why Startups Need an MVP in 7 Days',
      category: 'Startups',
      date: 'May 10, 2026',
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      excerpt:
        "In today's fast-paced market, spending months building your first version is a death sentence. Learn why speed is the ultimate advantage.\n\nWe interviewed 12 founders who launched MVPs in under a week. Their secret? Ruthless prioritization, rapid prototyping, and a willingness to launch before feeling 'ready.' Read how they iterated based on real user feedback and secured their first paying customers within days.",
    },
    {
      title: 'The Future of React and Vite in 2026',
      category: 'Engineering',
      date: 'May 5, 2026',
      image:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      excerpt:
        "How modern tooling has enabled us to build enterprise-grade applications in a fraction of the time it used to take.\n\nReact Server Components, Vite's instant HMR, and AI-powered code generation are changing the way teams ship features. We break down the latest trends, interview engineers at top startups, and share tips for staying ahead in the ever-evolving frontend landscape.",
    },
    {
      title: 'Designing for Conversion: UI/UX Principles',
      category: 'Design',
      date: 'April 28, 2026',
      image:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      excerpt:
        "A beautiful website is useless if it doesn't convert. Here are the core principles we apply to every landing page we build.\n\nFrom color psychology to micro-interactions, discover actionable UI/UX strategies backed by real A/B test results. Plus, see before-and-after case studies from our recent client projects.",
    },
  ];
  return (
    <section
      className="container section-padding"
      id="blog"
      style={{
        padding: '5rem 1.5rem',
      }}
    >
      <div
        className="flex-stack-mobile"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          gap: '1rem',
        }}
      >
        <div>
          <h2
            className="section-title"
            style={{
              fontSize: '3rem',
              marginBottom: '0.5rem',
            }}
          >
            Latest Insights
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
            }}
          >
            Thoughts on engineering, design, and building startups.
          </p>
        </div>
        <button className="btn btn-outline hide-on-mobile">
          View All Posts <ArrowRight size={18} />
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {posts.map((post, index) => (
          <div
            key={index}
            className="glass-panel"
            style={{
              padding: '0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: '200px',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>
            <div
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}
              >
                <span
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: '600',
                  }}
                >
                  {post.category}
                </span>
                <span
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  {post.date}
                </span>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                  lineHeight: 1.4,
                }}
              >
                {post.title}
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem',
                  flex: 1,
                }}
              >
                {post.excerpt}
              </p>
              <a
                href="#blog"
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Read More <ArrowRight size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Blog;
