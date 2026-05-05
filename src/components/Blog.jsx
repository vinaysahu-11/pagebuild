import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts as posts } from '../data/blogPosts';

const Blog = () => {
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

      <div className="content-grid">
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
                className="line-clamp-2"
                style={{
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                  lineHeight: 1.4,
                }}
              >
                {post.title}
              </h3>
              <p
                className="line-clamp-3"
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem',
                  flex: 1,
                }}
              >
                {post.excerpt}
              </p>
              {post.slug ? (
                <Link
                  to={`/blog/${post.slug}`}
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  Read More <ArrowRight size={16} />
                </Link>
              ) : (
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
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Blog;
