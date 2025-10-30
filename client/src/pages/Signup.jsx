import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { loginCtx } = useAuth();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password || password.length < 6) e.password = 'Min 6 characters';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setErr('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await signup({ name, email, password });
      loginCtx(data.token, data.user, true);
      nav('/');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Signup failed';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container hero-gradient">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="card p-4 p-md-5">
          <h2 className="mb-1">Create your account</h2>
          <p className="text-secondary mb-4">Join us in seconds</p>

          {err && <div className="alert alert-danger py-2">{err}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
              {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label d-flex justify-content-between">
                <span>Password</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                minLength={6}
              />
              {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Creating…' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-3 text-center">
            <span className="link-muted">Already have an account? </span>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
