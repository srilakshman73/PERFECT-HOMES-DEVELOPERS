/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - FORGOT PASSWORD & RECOVERY PAGE
   ========================================================================== */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export default function ForgotPasswordPage({ navigate }) {
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState('request'); // 'request' | 'otp' | 'newpass' | 'success'
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrors({ identifier: 'Please enter your registered email or mobile number' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setStep('otp');
      setIsLoading(false);
      addToast(`Password recovery OTP sent: ${code}`, 'info', 7000);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode !== '1234') {
      setErrors({ otp: 'Invalid code. Use the sent code or 1234.' });
      return;
    }
    setStep('newpass');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(identifier, newPassword);
      setStep('success');
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 140px)',
        backgroundColor: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Logo size="md" onClick={() => navigate('home')} className="mb-3" />
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--turquoise-light)',
              color: 'var(--primary-teal)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '1rem',
              marginBottom: '0.75rem'
            }}
          >
            <KeyRound size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-teal)' }}>Password Recovery</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Reset your account password securely.
          </p>
        </div>

        {/* STEP 1: REQUEST */}
        {step === 'request' && (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label className="form-label">Registered Email or Mobile</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  className={`form-input ${errors.identifier ? 'error' : ''}`}
                  placeholder="e.g. prakash@example.com or 9841054321"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.identifier && <span className="form-error-msg">{errors.identifier}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {isLoading ? 'Sending...' : 'Send Recovery OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <div
              style={{
                backgroundColor: 'var(--gold-light)',
                padding: '0.6rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: '#92400E',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Demo OTP: <strong>{generatedOtp || '1234'}</strong></span>
              <button
                type="button"
                onClick={() => setOtpCode(generatedOtp || '1234')}
                style={{ color: '#92400E', fontWeight: 700, textDecoration: 'underline' }}
              >
                Auto Fill
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Enter 4-Digit Code</label>
              <input
                type="text"
                maxLength={4}
                className={`form-input ${errors.otp ? 'error' : ''}`}
                placeholder="• • • •"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 800 }}
                autoFocus
              />
              {errors.otp && <span className="form-error-msg">{errors.otp}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Verify &amp; Continue
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 'newpass' && (
          <form onSubmit={handleResetPassword}>
            {errors.general && <div className="form-error-msg" style={{ marginBottom: '1rem' }}>{errors.general}</div>}

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && <span className="form-error-msg">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <span className="form-error-msg">{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {isLoading ? 'Resetting...' : 'Update Password & Sign In'}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <CheckCircle2 size={34} />
            </div>
            <h3 style={{ color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>Password Reset Complete!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Your password has been securely updated. You can now log into your account.
            </p>
            <button onClick={() => navigate('login')} className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Login
            </button>
          </div>
        )}

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate('login')}
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={15} /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
