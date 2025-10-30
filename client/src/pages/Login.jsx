import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { loginCtx } = useAuth();

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setErr('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      loginCtx(data.token, data.user, remember);
      nav(data.user.role === 'admin' ? '/admin' : '/');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Login failed';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container hero-gradient">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card p-4 p-md-5">
          <h2 className="mb-1">Welcome back</h2>
          <p className="text-secondary mb-4">Sign in to continue</p>

          {err && <div className="alert alert-danger py-2">{err}</div>}

          <form onSubmit={onSubmit} noValidate>
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
                  aria-pressed={showPw}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  id="remember"
                  className="form-check-input"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>
              <span className="link-muted" role="button" tabIndex={0} title="Coming soon">
                Forgot password?
              </span>
            </div>

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-3 text-center">
            <span className="link-muted">Don’t have an account? </span>
            <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
