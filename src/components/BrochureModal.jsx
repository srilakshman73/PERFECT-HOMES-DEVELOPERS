/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - BROCHURE DOWNLOAD & OTP WORKFLOW MODAL
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  X,
  CheckCircle2,
  Download,
  Lock,
  Phone,
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function BrochureModal({ property, isOpen, onClose }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState('lead'); // 'lead' | 'otp' | 'download'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen || !property) return null;

  const validateLead = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!validateLead()) return;

    setIsSubmitting(true);
    // Simulate SMS gateway OTP generation
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setStep('otp');
      setTimer(30);
      setIsSubmitting(false);
      addToast(`OTP sent to ${formData.phone}. Use verification code: ${code}`, 'info', 7000);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 4) {
      setErrors({ otp: 'Please enter 4-digit OTP' });
      return;
    }

    if (otpValue !== generatedOtp && otpValue !== '1234') {
      setErrors({ otp: 'Invalid OTP code. Please enter the generated code or 1234.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('download');
      addToast('Mobile number verified! Your brochure is ready for download.', 'success');
    }, 500);
  };

  const handleDownloadFile = () => {
    addToast(`Downloading official brochure for ${property.title}...`, 'success');
    // Simulate PDF generation / download
    const element = document.createElement('a');
    const file = new Blob([
      `PERFECT HOMES & DEVELOPERS\nOfficial Property Brochure\n\nProject: ${property.title}\nLocation: ${property.location}\nPrice: ${property.priceDisplay}\nApproval: ${property.approval}\n\nKey Highlights:\n- ${property.tagline}\n- 100% Clear Titles with 40-Year Parent Documents\n- Bank Loan Sanctioned from SBI, HDFC & Canara Bank\n\nContact: +91 98401 23456\nWebsite: www.perfecthomesdevelopers.com`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${property.slug || 'perfect-homes-property'}-brochure.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '0', overflow: 'hidden' }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
            color: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={20} color="#31D6C5" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0 }}>Get Official Brochure</h3>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                {property.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#FFFFFF', padding: '4px', borderRadius: '4px' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem 1.5rem' }}>
          {/* STEP 1: LEAD FORM */}
          {step === 'lead' && (
            <form onSubmit={handleRequestOtp}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Please provide your contact details to receive the high-resolution floor plans, price breakdown, and approval certificates.
              </p>

              {/* Name */}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label className="form-label">Mobile Number (for OTP) *</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+91 98400 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                <ShieldCheck size={16} color="var(--primary-teal)" />
                <span>Zero spam guarantee. Your details remain 100% confidential.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {isSubmitting ? 'Sending OTP...' : 'Get Instant Access Code'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--turquoise-light)',
                    color: 'var(--primary-teal)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem'
                  }}
                >
                  <Lock size={24} />
                </div>
                <h4 style={{ color: 'var(--deep-teal)' }}>Verify Mobile Number</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  We sent a 4-digit code to <strong>{formData.phone}</strong>
                </p>
              </div>

              {/* Demo Hint Banner */}
              <div
                style={{
                  backgroundColor: 'var(--gold-light)',
                  border: '1px solid rgba(229, 168, 35, 0.4)',
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
                <span>Demo Code: <strong>{generatedOtp || '1234'}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpValue(generatedOtp || '1234')}
                  style={{
                    color: '#92400E',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    fontSize: '0.78rem'
                  }}
                >
                  Auto Fill
                </button>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  maxLength={4}
                  className={`form-input ${errors.otp ? 'error' : ''}`}
                  placeholder="• • • •"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    letterSpacing: '0.5rem',
                    fontWeight: 800,
                    color: 'var(--deep-teal)'
                  }}
                  autoFocus
                />
                {errors.otp && <span className="form-error-msg" style={{ textAlign: 'center' }}>{errors.otp}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('lead')}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Change Number
                </button>
                {timer > 0 ? (
                  <span style={{ color: 'var(--text-muted)' }}>Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const code = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(code);
                      setTimer(30);
                      addToast(`New OTP sent: ${code}`, 'info');
                    }}
                    style={{ color: 'var(--primary-teal)', fontWeight: 600 }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Download Brochure'}
              </button>
            </form>
          )}

          {/* STEP 3: VERIFIED & DOWNLOAD */}
          {step === 'download' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>Verification Successful!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Your official e-brochure containing detailed master plans, pricing, and government approvals for <strong>{property.title}</strong> is ready.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleDownloadFile}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Download size={18} />
                  <span>Download PDF Brochure Now</span>
                </button>

                <button
                  onClick={onClose}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
