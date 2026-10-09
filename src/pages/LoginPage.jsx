/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - DEDICATED LUXURY LOGIN FIRST PAGE
   ========================================================================== */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function LoginPage({ navigate, redirectAfterLogin = 'home' }) {
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Email address or mobile number is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;

    try {
      await login(identifier, password, rememberMe);
      navigate(redirectAfterLogin);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 143, 131, 0.05) 0%, transparent 60%)'
      }}
    >
      <div
        className="card login-container-card"
        style={{
          maxWidth: '1060px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(6, 78, 73, 0.18)',
          border: '1.5px solid var(--border-color)',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* ========================================================
            LEFT LUXURY BRAND HERO SECTION
            ======================================================== */}
        <div
          className="login-left-brand"
          style={{
            background: 'linear-gradient(145deg, #064E49 0%, #008F83 60%, #31D6C5 120%)',
            color: '#FFFFFF',
            padding: '3.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background overlay artwork */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              mixBlendMode: 'overlay'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <Logo variant="white" size="lg" onClick={() => navigate('login')} />

            <div style={{ marginTop: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  color: '#31D6C5',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}
              >
                <Sparkles size={14} />
                <span>Verified Real Estate Platform</span>
              </div>

              <h2 style={{ color: '#FFFFFF', fontSize: '2.1rem', lineHeight: 1.25, marginBottom: '1rem' }}>
                Find Your Perfect Home with Us
              </h2>

              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Perfect Homes &amp; Developers helps you discover residential plots, independent houses, villas, and land with construction options across Chennai and surrounding areas. Sign in to explore properties and find a home that matches your needs.
              </p>

              {/* 3 Key Trust Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Explore properties across preferred locations', desc: 'Browse CMDA & DTCP verified plots and luxury villas across Avadi, Thiruninravur, and Veppampattu.' },
                  { title: 'Save and compare your favourite properties', desc: 'Track prices, evaluate specs side-by-side, and save properties to your private wishlist.' },
                  { title: 'Manage property enquiries in one place', desc: 'Direct direct-builder communication, instant brochure downloads, and site visit scheduling.' }
                ].map((benefit, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(49, 214, 197, 0.25)',
                        color: '#31D6C5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                        {benefit.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                        {benefit.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>
            Official RERA Agent: TN/RERA/Agent/0842/2021 • Thiruninravur, Chennai
          </div>
        </div>

        {/* ========================================================
            RIGHT CLEAN WHITE LOGIN CARD
            ======================================================== */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--deep-teal)', marginBottom: '0.35rem' }}>
              Welcome Back
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Sign in to continue to your account.
            </p>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div
              style={{
                backgroundColor: 'var(--danger-light)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--danger)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
                marginBottom: '1.25rem'
              }}
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email or Phone Input */}
            <div className="form-group">
              <label className="form-label">Email Address or Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  autoComplete="username"
                  className={`form-input ${errors.identifier ? 'error' : ''}`}
                  placeholder="Enter email or mobile number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.identifier && <span className="form-error-msg">{errors.identifier}</span>}
            </div>

            {/* Password Input (Clean controlled input - manual typing only) */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => navigate('forgot-password')}
                  style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem 0 1.5rem' }}>
              <input
                type="checkbox"
                id="rememberMeCheck"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMeCheck" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('register')}
              style={{ color: 'var(--primary-teal)', fontWeight: 700 }}
            >
              Register
            </button>
          </div>

          {/* Privacy & Terms Links */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            By signing in, you agree to our{' '}
            <span style={{ color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .login-container-card {
            grid-template-columns: 1fr !important;
          }
          .login-left-brand {
            padding: 2.25rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
