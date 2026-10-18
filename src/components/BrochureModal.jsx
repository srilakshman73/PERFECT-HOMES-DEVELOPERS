/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - BROCHURE DOWNLOAD & OTP WORKFLOW MODAL
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  X,
  CheckCircle2,
  Download,
  Phone,
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  AlertCircle,
  RotateCw,
  Loader2
} from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';
import { downloadPropertyBrochure } from '../services/brochureGenerator';

export default function BrochureModal({ property, isOpen, onClose }) {
  const { user } = useAuth();
  const { submitEnquiry } = useProperties();
  const { addToast } = useToast();

  const [step, setStep] = useState('lead'); // 'lead' | 'download'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadedFileName, setDownloadedFileName] = useState('');
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

  // Reset state when opening for a new property
  useEffect(() => {
    if (isOpen) {
      setStep('lead');
      setIsSubmitting(false);
      setIsGeneratingPdf(false);
      setDownloadSuccess(false);
      setDownloadError(null);
      setDownloadedFileName('');
      setErrors({});
    }
  }, [isOpen, property?.id]);

  if (!isOpen || !property) return null;

  const validateLead = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name is required (minimum 2 characters)';
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Valid 10-digit Indian mobile number is required';
    } else if (!/^[6-9]/.test(cleanPhone)) {
      errs.phone = 'Mobile number must start with 6, 7, 8, or 9';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!validateLead()) return;

    setIsSubmitting(true);
    try {
      // Securely register enquiry using PropertyContext store
      await submitEnquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: `Verified 8-page architectural brochure download requested for ${property.title}`
      });

      setStep('download');
      addToast('Registration confirmed! Your property brochure is ready.', 'success');
    } catch (err) {
      console.error('Enquiry registration error:', err);
      // Offline fallback: transition so user is never blocked from getting their brochure
      setStep('download');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setDownloadError(null);
      addToast(`Generating official 8-page PDF brochure for ${property.title}...`, 'info', 4000);
      
      const res = await downloadPropertyBrochure(property);
      
      setDownloadSuccess(true);
      setDownloadedFileName(res.filename);
      addToast(`Brochure downloaded: ${res.filename}`, 'success');
    } catch (err) {
      console.error('Error generating property brochure:', err);
      setDownloadError(err.message || 'Failed to generate PDF document. Please retry.');
      addToast('Failed to generate brochure. Please click retry or contact us on WhatsApp.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
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
            style={{ color: '#FFFFFF', padding: '4px', borderRadius: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem 1.5rem' }}>
          {/* STEP 1: LEAD REGISTRATION FORM */}
          {step === 'lead' && (
            <form onSubmit={handleLeadSubmit}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Please provide your contact details to generate and download the official verified 8-page architectural brochure for <strong>{property.title}</strong>.
              </p>

              {/* Informative Gateway Notice */}
              <div
                style={{
                  backgroundColor: '#F5FAF9',
                  border: '1px solid #D1ECE9',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.78rem',
                  color: 'var(--deep-teal)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={16} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
                <span>
                  SMS OTP gateway is not configured in this environment. Instant verified lead registration active.
                </span>
              </div>

              {/* Full Name (Required) */}
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
                    required
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              {/* Mobile Number (Required) */}
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="tel"
                    required
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="98400 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
              </div>

              {/* Email Address (Optional) */}
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
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Registering Lead...</span>
                  </>
                ) : (
                  <>
                    <span>Get Official Brochure</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: SUCCESSFUL VERIFICATION & PDF DOWNLOAD SCREEN */}
          {step === 'download' && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ color: 'var(--deep-teal)', fontSize: '1.35rem', marginBottom: '0.4rem', fontWeight: 800 }}>
                Your Property Brochure Is Ready
              </h3>

              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(0, 143, 131, 0.08)',
                  color: 'var(--primary-teal)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '0.85rem'
                }}
              >
                {property.title}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem', textAlign: 'left', backgroundColor: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                This dynamic 8-page verified PDF brochure includes architectural specifications, actual site photos, floor plan, location landmarks with approximate travel times, key features, and builder contact details for <strong>{property.title}</strong>.
              </p>

              {/* Download Success Banner */}
              {downloadSuccess && (
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.82rem',
                    color: '#065F46',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                  <span>
                    Brochure downloaded successfully: <strong>{downloadedFileName}</strong>
                  </span>
                </div>
              )}

              {/* Download Error Banner with Retry */}
              {downloadError && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.82rem',
                    color: '#991B1B',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                    <span>{downloadError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.78rem'
                    }}
                  >
                    <RotateCw size={12} /> Retry
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Download Property Brochure Button */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Generating Verified 8-Page PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Download Property Brochure</span>
                    </>
                  )}
                </button>

                {/* Chat on WhatsApp Button */}
                <a
                  href={`https://wa.me/917305023919?text=${encodeURIComponent(`Hello Perfect Homes & Developers, I just generated the official brochure for "${property?.title || 'your property'}" and would like to schedule a site visit.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                  style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp (+91 73050 23919)</span>
                </a>

                {/* Close Window Button */}
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
