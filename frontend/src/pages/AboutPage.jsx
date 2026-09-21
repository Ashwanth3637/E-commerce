import React from 'react';

export default function AboutPage({ navigateTo }) {
  return (
    <div>
      {/* Page Header */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>About Apex Workspace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
            Designing sustainable, ergonomic, and performance-driven workplace essentials.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="section-padding">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '13px' }}>WHO WE ARE</span>
              <h2 style={{ fontSize: '28px', marginTop: '6px', marginBottom: '16px' }}>
                Pioneering Ergonomic Comfort & Workspace Technology
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
                Apex Workspace was established to bridge the gap between aesthetic architectural design and medical ergonomic standards. We believe that physical comfort directly fuels mental focus and creative problem-solving.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Over the past 8 years, we have outfitted over 500 corporate offices, coworking spaces, and home setups with custom standing desks, orthopaedic mesh seating, and glare-free lighting systems.
              </p>
            </d
            <div>
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
                alt="Workspace design workshop"
                style={{ borderRadius: 'var(--radius)', width: '100%', height: '340px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ backgroundColor: 'var(--bg-light)', padding: '30px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎯</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                To empower professionals with scientifically engineered furniture and accessories that eliminate strain, optimize posture, and enhance everyday workday well-being.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-light)', padding: '30px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔭</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                To become the most reliable and innovative workplace ergonomics brand across India, known for durable craftsmanship, transparent pricing, and unmatched customer care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Our Core Values</h2>
            <p>The principles that guide our product engineering and customer relationships.</p>
          </div>

          <div className="grid-4">
            <div className="feature-box">
              <div className="feature-icon">✨</div>
              <h3>Uncompromised Quality</h3>
              <p>We source heavy-gauge steel, Korean breathable mesh, and sustainable hardwoods tested for 100,000+ duty cycles.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🔬</div>
              <h3>Ergonomic Science</h3>
              <p>Every chair angle, desk height range, and lamp lux level is designed based on human biomechanics.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🌱</div>
              <h3>Sustainability</h3>
              <p>Eco-friendly packaging and sustainably harvested wood materials that minimize our environmental footprint.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🤝</div>
              <h3>Customer First</h3>
              <p>Responsive after-sales support, free assembly consultation, and transparent warranty policies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid var(--border-color)', padding: '50px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Have questions or need a custom corporate proposal?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Our workspace consultants are available to help you plan and optimize your office layout.
          </p>
          <button className="btn btn-primary" onClick={() => navigateTo('contact')}>
            Get in Touch With Us
          </button>
        </div>
      </section>
    </div>
  );
}
