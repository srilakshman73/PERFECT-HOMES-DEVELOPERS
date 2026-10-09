/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - MY ENQUIRIES HISTORY PAGE (PROTECTED)
   ========================================================================== */

import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Calendar,
  Clock,
  Phone,
  Mail,
  Eye,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';

export default function EnquiriesPage({ navigate, onViewProperty }) {
  const { getUserEnquiries, properties } = useProperties();
  const { user } = useAuth();

  const enquiries = getUserEnquiries();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return <span className="badge badge-teal">New Enquiry</span>;
      case 'In Progress':
        return <span className="badge badge-gold">In Progress</span>;
      case 'Contacted':
        return <span className="badge badge-success">Contacted</span>;
      case 'Closed':
        return <span className="badge" style={{ backgroundColor: '#E5E7EB', color: '#4B5563' }}>Closed</span>;
      default:
        return <span className="badge badge-teal">{status}</span>;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div>
            <span className="section-tag" style={{ margin: 0 }}>
              Lead &amp; Site Visit Log
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-heading)', marginTop: '4px' }}>
              My Property Enquiries ({enquiries.length})
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              Real-time tracking of your site visits, quotation requests, and bank loan consultations.
            </p>
          </div>

          <button onClick={() => navigate('listing')} className="btn btn-primary">
            <span>Explore More Properties</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Enquiries List or Empty State */}
        {enquiries.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '4.5rem 2rem',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--turquoise-light)',
                color: 'var(--primary-teal)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <FileText size={34} />
            </div>
            <h2 style={{ color: 'var(--deep-teal)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              No Enquiries Submitted Yet
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              When you submit a site visit request or brochure download for any project, your enquiry status and sales manager updates will appear here.
            </p>
            <button onClick={() => navigate('listing')} className="btn btn-primary btn-lg">
              <span>View Available Properties</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {enquiries.map((enq) => {
              const matchedProp = properties.find((p) => p.id === enq.propertyId);
              const whatsappUrl = `https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
                `Hello, I am following up on enquiry ref #${enq.id} regarding "${enq.propertyTitle}".`
              )}`;

              return (
                <div
                  key={enq.id}
                  className="card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '1.75rem',
                    alignItems: 'center'
                  }}
                  className="enquiry-card-grid"
                >
                  {/* Property Image */}
                  <img
                    src={enq.propertyImg || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                    alt={enq.propertyTitle}
                    style={{
                      width: '120px',
                      height: '100px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Enquiry Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                      {getStatusBadge(enq.status)}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Ref: #{enq.id} • Submitted on {enq.date}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', marginBottom: '0.25rem' }}>
                      {enq.propertyTitle}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{enq.propertyPrice}</span>
                      {enq.propertyLocation && <span> • {enq.propertyLocation}</span>}
                    </div>

                    {/* Customer message */}
                    <div
                      style={{
                        backgroundColor: 'var(--bg-main)',
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.84rem',
                        color: 'var(--text-heading)',
                        marginBottom: '0.65rem'
                      }}
                    >
                      <strong>Your Request:</strong> &ldquo;{enq.message}&rdquo;
                      {enq.visitDate && (
                        <div style={{ color: 'var(--primary-teal)', fontWeight: 600, marginTop: '2px' }}>
                          📅 Scheduled Date: {enq.visitDate}
                        </div>
                      )}
                    </div>

                    {/* Sales Representative Response */}
                    {enq.salesNotes && (
                      <div
                        style={{
                          backgroundColor: 'var(--turquoise-light)',
                          borderLeft: '3px solid var(--primary-teal)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0 6px 6px 0',
                          fontSize: '0.82rem',
                          color: 'var(--deep-teal)'
                        }}
                      >
                        <strong>Sales Team Note:</strong> {enq.salesNotes}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '150px' }}>
                    {matchedProp && (
                      <button
                        onClick={() => onViewProperty(matchedProp)}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%' }}
                      >
                        <Eye size={14} /> View Property
                      </button>
                    )}

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                      style={{ width: '100%' }}
                    >
                      <MessageCircle size={14} /> WhatsApp Support
                    </a>

                    <a
                      href={`tel:${COMPANY_CONTACT_INFO.phone}`}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                    >
                      <PhoneCall size={14} /> Call Support
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .enquiry-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
