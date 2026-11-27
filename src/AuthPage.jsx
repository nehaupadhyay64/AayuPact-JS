import React, { useState } from 'react';
import {
  HeartPulse,
  Lock,
  Mail,
  User,
  Shield,
  ShieldCheck,
  BellRing,
  Pill,
} from 'lucide-react';
import './auth.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://aayupact-js.onrender.com/api';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('senior');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemoCredentials = (demoRole) => {
    setError('');
    if (demoRole === 'caregiver') {
      setName('Priya');
      setEmail('priya@aayupact.in');
      setPassword('123456');
      setRole('caregiver');
    } else {
      setName('Ramesh');
      setEmail('ramesh@aayupact.in');
      setPassword('123456');
      setRole('senior');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        mode === 'login'
          ? { email: email.trim().toLowerCase(), password }
          : {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
              role,
            };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Authentication failed.');
        setLoading(false);
        return;
      }

      onAuthSuccess(data.token, data.user);
    } catch {
      setError('Backend (http://localhost:5000) reach nahi ho pa raha. Server chalao.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-ambient-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-ambient-orb auth-orb-two" aria-hidden="true" />

      <div className="auth-shell">
        {/* Left Visual Showcase Panel */}
        <div className="auth-showcase">
          <div className="auth-brand-row">
            <div className="auth-logo-box">
              <HeartPulse size={28} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="auth-brand-name">AayuPact</h1>
              <p className="auth-brand-tag">Consent-First Smart Pill &amp; Senior Care</p>
            </div>
          </div>

          <div className="auth-showcase-body">
            <h2 className="auth-showcase-title">Care that feels calm, clear &amp; connected.</h2>
            <p className="auth-showcase-desc">
              Track daily medications, share consent-based health logs with caregivers, and keep
              emergency support one tap away.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature-pill">
                <Pill size={18} />
                <span>Voice-assisted pill reminders &amp; adherence tracking</span>
              </div>
              <div className="auth-feature-pill">
                <ShieldCheck size={18} />
                <span>Granular privacy consent vault for seniors</span>
              </div>
              <div className="auth-feature-pill">
                <BellRing size={18} />
                <span>Instant caregiver alerts &amp; emergency SOS</span>
              </div>
            </div>
          </div>

          <div className="auth-showcase-footer">
            Role-based access for Seniors &amp; Caregivers • JWT Protected
          </div>
        </div>

        {/* Right Login / Register Form Panel */}
        <div className="auth-form-panel">
          <h2 className="auth-form-heading">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Apni email aur password se login karke dashboard kholo'
              : 'Apna role chuno aur naya AayuPact account banao'}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            >
              Login with Email
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            >
              Register
            </button>
          </div>

          <div className="auth-quick-row">
            <button
              type="button"
              onClick={() => fillDemoCredentials('senior')}
              className="auth-quick-btn"
            >
              Fill Senior Email
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('caregiver')}
              className="auth-quick-btn"
            >
              Fill Caregiver Email
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Kumar"
                    className="auth-input"
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="auth-input"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-label">Role</label>
                <div className="auth-input-wrap">
                  <Shield size={16} className="auth-input-icon" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="auth-select"
                  >
                    <option value="senior">Senior Citizen</option>
                    <option value="caregiver">Caregiver</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Login with Email'
                : 'Register & Open Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}