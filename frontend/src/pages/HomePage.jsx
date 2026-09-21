import React from 'react';
import ProductCard from '../components/ProductCard';

export default function HomePage({ products, navigateTo, onSelectProduct }) {
  const featuredProducts = products.filter(p => p.featured === 1).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Modern Ergonomics & Workspace Gear
              </span>
              <h1 style={{ marginTop: '8px' }}>Build a Smarter, Healthier Workplace</h1>
              <p>
                Discover high-performance motorized desks, ergonomic mesh seating, glare-free task lighting, and workflow accessories designed to boost productivity.
              </p>
              <div className="hero-btns">
                <button className="btn btn-primary" onClick={() => navigateTo('products')}>
                  Explore Products →
                </button>
                <button className="btn btn-outline" onClick={() => navigateTo('contact')}>
                  Request B2B Quote
                </button>
              </div>
            </div>

            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1000&q=80"
                alt="Modern ergonomic workspace"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Intro & Value Props */}
      <section className="section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Why Businesses Trust Apex Workspace</h2>
            <p>We craft ergonomic furniture and productivity tools built for long-term health, durability, and modern aesthetics.</p>
          </div>

          <div className="grid-3">
            <div className="feature-box">
              <div className="feature-icon">🛡️</div>
              <h3>Certified Ergonomic Design</h3>
              <p>Scientifically tested lumbar support and height adjustment to reduce strain and boost daily focus.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <h3>Direct Enterprise Pricing</h3>
              <p>Get transparent pricing, tiered bulk volume discounts, and prompt product dispatch across India.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🤝</div>
              <h3>Dedicated Support & Warranty</h3>
              <p>Up to 3-year warranty with dedicated account managers and hassle-free post-purchase service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '13px' }}>TOP RECOMMENDATIONS</span>
              <h2 style={{ fontSize: '26px', marginTop: '4px' }}>Featured Products</h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigateTo('products')}>
              View Full Catalogue →
            </button>
          </div>

          <div className="grid-4">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick About Overview */}
      <section className="section-padding">
        <div className="container">
          <div className="hero-grid" style={{ alignItems: 'center' }}>
            <div>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Corporate Office"
                style={{ borderRadius: 'var(--radius)', width: '100%', height: '320px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '13px' }}>OUR STORY</span>
              <h2 style={{ fontSize: '28px', marginTop: '6px', marginBottom: '14px' }}>Engineering Spaces That Empower People</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Founded with a mission to transform mundane offices into ergonomic hubs of productivity, Apex Workspace provides end-to-end furniture and tech hardware solutions for enterprises, startups, and remote teams.
              </p>
              <button className="btn btn-primary" onClick={() => navigateTo('about')}>
                Read Our Story & Values
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '50px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '12px' }}>
            Ready to upgrade your workspace?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 24px', opacity: '0.9' }}>
            Submit an enquiry or add items to your cart for an instant quotation. Our technical team is ready to assist.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)' }}
              onClick={() => navigateTo('products')}
            >
              Browse Catalogue
            </button>
            <button
              className="btn"
              style={{ backgroundColor: 'transparent', border: '1px solid #ffffff', color: '#ffffff' }}
              onClick={() => navigateTo('contact')}
            >
              Contact Our Sales Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
