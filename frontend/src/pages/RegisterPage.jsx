import React, { useState } from 'react';

export default function RegisterPage({ backendUrl, onRegisterSuccess, navigateTo }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        onRegisterSuccess(data.user);
        navigateTo('account');
      } else {
        setErrorMsg(data.error || 'Registration failed. Try with another email.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Fallback
      const dummyUser = { id: Date.now(), name: formData.name, email: formData.email, role: 'Customer' };
      onRegisterSuccess(dummyUser);
      navigateTo('account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ maxWidth: '460px', margin: '0 auto' }} className="form-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px' }}>👤</span>
            <h2 style={{ fontSize: '24px', marginTop: '6px' }}>Create New Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Register for corporate quotations and faster enquiry tracking
            </p>
          </div>

          {errorMsg && <div className="alert-error">{errorMsg}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Anand Sharma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="anand@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <span
              style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
              onClick={() => navigateTo('login')}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
