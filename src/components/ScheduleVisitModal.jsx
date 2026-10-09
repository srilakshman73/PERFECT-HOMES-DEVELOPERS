/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - FREE SITE VISIT BOOKING MODAL
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  Clock,
  Car,
  X,
  CheckCircle2,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';

export default function ScheduleVisitModal({ property, isOpen, onClose }) {
  const { user } = useAuth();
  const { submitEnquiry } = useProperties();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    visitDate: '',
    timeSlot: '10:30 AM - 12:00 PM',
    cabPickup: true,
    pickupLocation: 'Avadi Railway Station',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.visitDate) {
      addToast('Please fill in your name, mobile number, and preferred date.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        propertyId: property ? property.id : '',
        propertyTitle: property ? property.title : 'General Site Visit',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        visitDate: formData.visitDate,
        message: `Booked Free Site Visit for ${formData.visitDate} (${formData.timeSlot}). ${formData.cabPickup ? `Cab pickup requested from: ${formData.pickupLocation}` : 'Own transport'}. Notes: ${formData.notes}`
      });
      setIsSuccess(true);
    } catch (err) {
      addToast(err.message || 'Failed to schedule visit', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
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
              <Calendar size={20} color="#31D6C5" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: 0 }}>Schedule Free Site Visit</h3>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                {property ? property.title : 'Explore our residential projects in person'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#FFFFFF', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem 1.5rem' }}>
          {isSuccess ? (
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
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>Site Visit Confirmed!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Thank you, <strong>{formData.name}</strong>. Our site coordinator will call you to confirm your complimentary cab pickup for <strong>{formData.visitDate}</strong>.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Your Name"
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

              {/* Date & Time Slot */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Time Slot</label>
                  <select
                    className="form-select"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  >
                    <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM (Morning)</option>
                    <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM (Afternoon)</option>
                    <option value="04:30 PM - 06:00 PM">04:30 PM - 06:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              {/* Free Cab Pickup Toggle */}
              <div
                style={{
                  backgroundColor: 'var(--turquoise-light)',
                  border: '1px solid rgba(0, 143, 131, 0.2)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--deep-teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Car size={16} color="var(--primary-teal)" /> Request Free AC Cab Pickup
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.cabPickup}
                    onChange={(e) => setFormData({ ...formData, cabPickup: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)' }}
                  />
                </div>
                {formData.cabPickup && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Pickup location (e.g. Avadi Railway Station, Koyambedu, Porur...)"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              >
                {isSubmitting ? 'Booking Visit...' : 'Confirm Free Site Visit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
