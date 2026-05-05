import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || `${post.title} | PageBuild`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.metaDescription || post.excerpt);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.metaDescription || post.excerpt;
        document.head.appendChild(meta);
      }
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '2rem', fontWeight: '500' }}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <article>
          <header style={{ marginBottom: '3rem' }}>
            <span style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{post.category}</span>
            <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginTop: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>Published on {post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          <img 
            src={post.image} 
            alt={post.title} 
            style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '3rem', objectFit: 'cover' }} 
          />

          <div className="blog-content" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)' }}>
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
