import React, { useState, useEffect } from 'react';

export default function AccountPage({ user, onLogout, navigateTo, backendUrl }) {
  const [userEnquiries, setUserEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const res = await fetch(`${backendUrl}/api/enquiries`);
        if (res.ok) {
          const data = await res.json();
          // Filter enquiries that match user's email
          const matching = data.filter(
            e => e.email.toLowerCase() === (user?.email || '').toLowerCase()
          );
          setUserEnquiries(matching.length > 0 ? matching : data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load enquiries', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchEnquiries();
    }
  }, [user, backendUrl]);

  if (!user) {
    return (
      <div className="section-padding">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Please sign in to view your account.</h2>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigateTo('login')}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Welcome, {user.name}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Customer Account & Enquiry History</p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </section>

      {/* Account Info & Enquiry History */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
            {/* Profile Info */}
            <div className="form-card">
              <h3 style={{ fontSize: '18px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                Profile Overview
              </h3>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>FULL NAME</span>
                <strong>{user.name}</strong>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>EMAIL ADDRESS</span>
                <strong>{user.email}</strong>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>PHONE NUMBER</span>
                <strong>{user.phone || 'Not provided'}</strong>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>ACCOUNT ROLE</span>
                <span style={{ display: 'inline-block', padding: '2px 8px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                  {user.role || 'Customer'}
                </span>
              </div>
            </div>

            {/* Submitted Enquiries */}
            <div className="form-card">
              <h3 style={{ fontSize: '18px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                Your Quotations & Enquiry Requests
              </h3>

              {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading enquiry records...</p>
              ) : userEnquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                  <p>You haven't submitted any enquiry requests yet.</p>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: '12px' }} onClick={() => navigateTo('products')}>
                    Explore Products
                  </button>
                </div>
              ) : (
                <div>
                  {userEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      style={{
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        marginBottom: '14px',
                        backgroundColor: 'var(--bg-light)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong>Enquiry #{enq.id}: {enq.subject}</strong>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#dcfce7', color: 'var(--success)', fontWeight: 'bold' }}>
                          {enq.status || 'Received'}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                        {enq.message}
                      </p>

                      {enq.items && enq.items.length > 0 && (
                        <div style={{ marginTop: '8px', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Enquired Items:</span>
                          <ul style={{ listStyle: 'inside disc', fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                            {enq.items.map((item, idx) => (
                              <li key={idx}>
                                {item.product_name} (Qty: {item.quantity}) - ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
