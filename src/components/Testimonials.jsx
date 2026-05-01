import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const [reviews, setReviews] = useState([
    {
      name: "Arjun Mehta",
      role: "Founder, TechFlow Startup",
      content: "PageBuild delivered our SaaS MVP in exactly 7 days. The quality of the code and the UI was phenomenal. We had daily updates, and they even jumped on a late-night call to fix a last-minute bug before our investor demo. Saved us months of development time and stress. Highly recommend!",
      rating: 5,
    },
    {
      name: "Sarah Jenkins",
      role: "E-commerce Owner",
      content: "I needed a custom Shopify store up and running before the holiday season. They not only hit the deadline but the design converted better than my old site immediately. The team suggested features I hadn't even thought of, and sales went up 22% in the first month!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Marketing Director",
      content: "The best agency experience I've had. Communication was clear, the pricing was transparent, and the final business website looks incredibly premium. Even after launch, they helped us with tweaks and analytics setup. Real partners, not just vendors!",
      rating: 5,
    },
    {
      name: "Rohit Agarwal",
      role: "Product Manager, FinTech",
      content: "We had a complex dashboard with lots of integrations. PageBuild handled everything smoothly and delivered on time. The code quality passed our internal review with flying colors.",
      rating: 4,
    },
    {
      name: "Emily Wang",
      role: "Startup Founder",
      content: "I was skeptical about the 7-day promise, but they delivered! The onboarding was smooth, and I loved the Figma previews before development started. Will use again for my next project.",
      rating: 5,
    }
  ]);

  // State for new review form
  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
  });
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.role.trim() || !newReview.content.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }
    setReviews((prev) => [
      {
        ...newReview,
        name: newReview.name.trim(),
        role: newReview.role.trim(),
        content: newReview.content.trim(),
        rating: Number(newReview.rating),
      },
      ...prev,
    ]);
    setNewReview({ name: '', role: '', content: '', rating: 5 });
    setFormError('');
  };

  return (
    <section className="container" id="testimonials" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div className="animate-fade-in" style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '999px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', border: '1px solid rgba(236, 72, 153, 0.2)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>
        Client Reviews
      </div>
      <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Loved by Founders</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', fontSize: '1.1rem' }}>
        Don't just take our word for it. Here is what our clients have to say about our 7-day delivery.
      </p>

      {/* User Review Submission Form */}
      <div className="glass-panel" style={{ maxWidth: 500, margin: '0 auto 3rem auto', padding: '2rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Share Your Experience</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={newReview.name}
              onChange={handleInputChange}
              style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white' }}
            />
            <input
              type="text"
              name="role"
              placeholder="Your Role (e.g. Founder, Designer)"
              value={newReview.role}
              onChange={handleInputChange}
              style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white' }}
            />
            <textarea
              name="content"
              placeholder="Your Review"
              value={newReview.content}
              onChange={handleInputChange}
              rows={3}
              style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rating:</span>
              {[1,2,3,4,5].map((star) => (
                <span key={star} style={{ cursor: 'pointer' }} onClick={() => handleRatingChange(star)}>
                  <Star size={20} fill={star <= newReview.rating ? 'var(--warning)' : 'none'} color="var(--warning)" />
                </span>
              ))}
            </div>
            {formError && <div style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>{formError}</div>}
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Review</button>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {reviews.map((review, idx) => (
          <div key={idx} className="glass-panel" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={18} fill="var(--warning)" color="var(--warning)" />
              ))}
            </div>
            <p style={{ color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '2rem', flex: 1, fontSize: '1.1rem', lineHeight: 1.6 }}>
              "{review.content}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {review.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: 'white' }}>{review.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{review.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
