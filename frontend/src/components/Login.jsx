import React, { useState } from 'react';

const Login = ({ onLogin, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = {};
      }
      console.log('Login response:', data, 'Status:', res.status);
      if (!res.ok) {
        setError(data.message || data.error || `Login failed (status ${res.status})`);
        return;
      }
      if (data && data.user) {
        onLogin(data);
      } else {
        setError('Login succeeded but no user data returned.');
      }
    } catch (err) {
      setError(err.message || 'Network error during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #a855f7 100%)',
      fontFamily: 'Inter, Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
          borderRadius: '16px',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '0 8px 32px rgba(96,165,250,0.3)'
        }}>
          💎
        </div>
        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          FinTrack
        </h1>
        <p style={{
          margin: 0,
          color: 'rgba(255,255,255,0.85)',
          fontSize: 18,
          fontWeight: 500
        }}>
          Welcome back! Please login to continue.
        </p>
      </div>

      {/* Login Form */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 700,
          margin: '0 0 32px 0',
          textAlign: 'center'
        }}>
          Sign In
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(96,165,250,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(96,165,250,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#fca5a5',
              background: 'rgba(239,68,68,0.1)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid rgba(239,68,68,0.2)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(102,126,234,0.15)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(102,126,234,0.15)';
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px'
          }}>
            Don't have an account?{' '}
            <button
              onClick={switchToSignup}
              style={{
                background: 'none',
                border: 'none',
                color: '#60a5fa',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <p style={{
          margin: 0,
          color: 'rgba(255,255,255,0.5)',
          fontSize: '14px'
        }}>
          &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
