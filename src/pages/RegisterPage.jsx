/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - DEDICATED REGISTRATION PAGE
   Responsive Mobile-First Layout + Persistent Registration Sync
   ========================================================================== */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function RegisterPage({ navigate }) {
  const { register, isLoading } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['#EF4444', '#F97316', '#EAB308', '#10B981', '#059669'];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim() || formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms and privacy policy';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      navigate('home');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
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
        padding: '2rem 1rem',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 143, 131, 0.05) 0%, transparent 60%)'
      }}
    >
      <div
        className="card auth-container-card"
        style={{
          maxWidth: '1060px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(6, 78, 73, 0.16)',
          border: '1.5px solid var(--border-color)',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* ========================================================
            LEFT BRAND SECTION (DESKTOP / TABLET HERO)
            ======================================================== */}
        <div
          className="auth-left-brand"
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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80")',
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
                <span>Join Over 1,500+ Happy Homeowners</span>
              </div>

              <h2 style={{ color: '#FFFFFF', fontSize: '2.1rem', lineHeight: 1.25, marginBottom: '1rem' }}>
                Start Your Journey to Land &amp; Home Ownership
              </h2>

              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Create your verified buyer account to access exclusive CMDA plot launches, download floor plans, and track your property enquiries.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Priority Access to Pre-Launch Plots', desc: 'Get notified 48 hours before general public releases.' },
                  { title: 'Direct WhatsApp Support with Builder', desc: 'Zero middlemen. Instant responses to price & loan questions.' },
                  { title: 'Free AC Cab Site Visits on Demand', desc: 'Schedule complimentary doorstep pickup anytime.' }
                ].map((item, idx) => (
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
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>
            100% CMDA &amp; DTCP Approved Developments • RERA Registered
          </div>
        </div>

        {/* ========================================================
            RIGHT REGISTER FORM SECTION (MOBILE OPTIMIZED)
            ======================================================== */}
        <div className="auth-form-card" style={{ padding: '3.25rem 2.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--deep-teal)', marginBottom: '0.35rem' }}>
              Create Your Account
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
              Fill in your details below to register as a verified buyer.
            </p>
          </div>

          {serverError && (
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
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  autoComplete="name"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="e.g. Suresh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.fullName && <span className="form-error-msg">{errors.fullName}</span>}
            </div>

            {/* Responsive 2-Col on Desktop, 1-Col on Mobile */}
            <div className="auth-form-row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {/* Email */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    autoComplete="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.88rem' }}
                  />
                </div>
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>

              {/* Mobile Phone */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="tel"
                    autoComplete="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+91 98400..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.88rem' }}
                  />
                </div>
                {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Create Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '4px' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ height: '4px', width: '100%', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(strength / 4) * 100}%`, backgroundColor: strengthColors[strength], transition: 'width 0.2s' }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: strengthColors[strength], fontWeight: 600, marginTop: '2px' }}>
                    Password Strength: {strengthLabels[strength]}
                  </div>
                </div>
              )}
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '4px' }}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="form-error-msg">{errors.confirmPassword}</span>}
            </div>

            {/* Agree Terms Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '0.25rem 0' }}>
              <input
                type="checkbox"
                id="agreeTermsCheck"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
              />
              <label htmlFor="agreeTermsCheck" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the Terms of Service and Privacy Policy for property notifications.
              </label>
            </div>
            {errors.agreeTerms && <span className="form-error-msg">{errors.agreeTerms}</span>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem' }}
            >
              {isSubmitting || isLoading ? 'Creating Account & Saving...' : 'Register Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Link to Login */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('login')}
              style={{ color: 'var(--primary-teal)', fontWeight: 700 }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .auth-container-card {
            grid-template-columns: 1fr !important;
          }
          .auth-left-brand {
            padding: 2.25rem 1.5rem !important;
          }
          .auth-form-card {
            padding: 2.25rem 1.5rem !important;
          }
          .auth-form-row-2col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
