/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - CONTACT US & SITE VISIT PAGE
   ========================================================================== */

import React, { useState } from 'react';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  Car
} from 'lucide-react';

export default function ContactPage({ onOpenScheduleVisit }) {
  const { submitEnquiry } = useProperties();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    interest: 'Plots',
    location: 'Avadi',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      addToast('Please enter your name and phone number.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        propertyTitle: `Inquiry: ${formData.interest} in ${formData.location}`,
        message: formData.message || `Customer interested in ${formData.interest} in ${formData.location}.`
      });
      setIsSuccess(true);
    } catch (err) {
      addToast(err.message || 'Failed to submit enquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
    'Hello Perfect Homes & Developers, I want to inquire about properties in Chennai West.'
  )}`;

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
          color: '#FFFFFF',
          padding: '4rem 0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
            Contact Perfect Homes &amp; Developers
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Our senior property advisors are available 7 days a week. Visit our sales office or request a complimentary doorstep AC cab pickup.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* LEFT: CONTACT DETAILS & OFFICES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Main Office Card */}
            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--deep-teal)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={20} color="var(--primary-teal)" />
                <span>Head Office &amp; Sales Lounge</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={20} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Address:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {COMPANY_CONTACT_INFO.officeAddress}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <PhoneCall size={18} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Direct Line / Call:</strong>
                    <div style={{ marginTop: '2px' }}>
                      <a href={COMPANY_CONTACT_INFO.telLink} style={{ color: 'var(--primary-teal)', fontWeight: 700, fontSize: '1.05rem' }}>
                        {COMPANY_CONTACT_INFO.phoneDisplay}
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Mail size={18} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Email Inquiries:</strong>
                    <div style={{ marginTop: '2px' }}>
                      <a href={`mailto:${COMPANY_CONTACT_INFO.email}`} style={{ color: 'var(--text-heading)' }}>
                        {COMPANY_CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Clock size={18} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Operating Hours:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {COMPANY_CONTACT_INFO.workingHours}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <button
                  onClick={() => onOpenScheduleVisit(null)}
                  className="btn btn-turquoise btn-sm"
                >
                  <Car size={16} /> Free Cab Visit
                </button>
              </div>
            </div>

            {/* Branch Office */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--deep-teal)', marginBottom: '0.75rem' }}>
                Thiruninravur Site Office
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {COMPANY_CONTACT_INFO.branchOffice}
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
                • Free Site Visits &amp; Layout Walkthroughs Available 7 Days a Week
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE CONTACT FORM */}
          <div>
            <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>
                Send Us a Message
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Leave your requirement and our senior property specialist will get back to you within 15 minutes.
              </p>

              {isSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
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
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>Enquiry Submitted!</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Thank you, <strong>{formData.name}</strong>. Our property manager will call you at <strong>{formData.phone}</strong> shortly.
                  </p>
                  <button onClick={() => setIsSuccess(false)} className="btn btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Your Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="+91 98400..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Property Interest</label>
                      <select
                        className="form-select"
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      >
                        <option value="Plots">Residential Plots</option>
                        <option value="2 BHK Homes">2 BHK Independent</option>
                        <option value="3 BHK Homes">3 BHK Villa</option>
                        <option value="Villas">Luxury Villas</option>
                        <option value="Land + Construction">Land + Construction</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Preferred Location</label>
                      <select
                        className="form-select"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      >
                        <option value="Avadi">Avadi</option>
                        <option value="Thiruninravur">Thiruninravur</option>
                        <option value="Veppampattu">Veppampattu</option>
                        <option value="Poonamallee">Poonamallee</option>
                        <option value="Pattabiram">Pattabiram</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Requirement / Questions</label>
                    <textarea
                      rows={3}
                      className="form-textarea"
                      placeholder="e.g. Looking for an East facing plot under 30 Lakhs with bank loan..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    <Send size={18} />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Property Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
