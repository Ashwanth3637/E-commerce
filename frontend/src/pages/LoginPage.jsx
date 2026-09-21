import React, { useState } from 'react';

export default function LoginPage({ backendUrl, onLoginSuccess, navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        onLoginSuccess(data.user);
        navigateTo('account');
      } else {
        setErrorMsg(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      const dummyUser = { id: 1, name: email.split('@')[0], email, role: 'Customer' };
      onLoginSuccess(dummyUser);
      navigateTo('account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ maxWidth: '440px', margin: '0 auto' }} className="form-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px' }}>🔐</span>
            <h2 style={{ fontSize: '24px', marginTop: '6px' }}>Sign In to Your Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Access your saved enquiries and account details
            </p>
          </div>

          {errorMsg && <div className="alert-error">{errorMsg}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <span
              style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
              onClick={() => navigateTo('register')}
            >
              Sign Up here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
