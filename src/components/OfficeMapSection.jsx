/* ==========================================================================
   PERFECT HOMES & DEVELOPERS — PART 5: OFFICE MAP SECTION
   Strictly office location only. Does not apply to property locations.
   ========================================================================== */

import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { PART5_OFFICE_MAP, PART4_MEDIA } from '../data/projectMediaHelpers.js';

export default function OfficeMapSection() {
  const officeMapUrl = PART5_OFFICE_MAP.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=13.124850%2C80.043786";
  const officeDirectionsUrl = PART5_OFFICE_MAP.googleMapsDirectionsUrl || "https://www.google.com/maps/dir/?api=1&destination=13.124850%2C80.043786";

  return (
    <section
      id="office-map-section"
      style={{
        padding: '3.5rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 143, 131, 0.08)',
              color: '#008F83',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.75rem'
            }}
          >
            <Building2 size={15} />
            <span>Part 5 — Corporate Headquarters & Office Map</span>
          </div>

          <h2
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              color: 'var(--deep-teal)',
              lineHeight: 1.25,
              margin: '0 0 0.75rem'
            }}
          >
            Visit Our Thiruninravur Office
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: 0 }}>
            Meet our property consultants, review verified DTCP/CMDA master layouts, and discuss bank loans in person at our registered office.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch'
          }}
        >
          {/* Office Details Card */}
          <div
            className="card"
            style={{
              padding: '2.2rem',
              backgroundColor: '#F9FBFB',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <a
                  href={officeMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open office location in Google Maps"
                  aria-label="View Office on Google Maps"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0, 143, 131, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#008F83',
                    flexShrink: 0,
                    textDecoration: 'none',
                    transition: 'transform 0.2s, background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 143, 131, 0.22)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 143, 131, 0.12)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <MapPin size={26} />
                </a>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-teal)', margin: 0 }}>
                    {PART4_MEDIA.companyName}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#687985', margin: '2px 0 0' }}>
                    Registered Corporate Office
                  </p>
                </div>
              </div>

              {/* Clickable Address Box */}
              <a
                href={officeMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to view office address on Google Maps"
                style={{
                  display: 'block',
                  backgroundColor: '#FFFFFF',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-light)',
                  marginBottom: '1.5rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#008F83';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 143, 131, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008F83', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={13} />
                    <span>Office Address (Click to Open in Maps)</span>
                  </div>
                  <ExternalLink size={14} color="#008F83" />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.5 }}>
                  {PART4_MEDIA.address}
                </div>
              </a>

              {/* Office Contact Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <a
                  href={`tel:${PART4_MEDIA.phonePrimary.replace(/\s+/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-heading)',
                    fontSize: '0.92rem',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={17} color="#008F83" />
                  <span><strong>Primary:</strong> {PART4_MEDIA.phonePrimary}</span>
                </a>
                <a
                  href={`tel:${PART4_MEDIA.phoneAlternate.replace(/\s+/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-heading)',
                    fontSize: '0.92rem',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={17} color="#008F83" />
                  <span><strong>Alternate:</strong> {PART4_MEDIA.phoneAlternate}</span>
                </a>
                <a
                  href={`mailto:${PART4_MEDIA.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-heading)',
                    fontSize: '0.92rem',
                    textDecoration: 'none'
                  }}
                >
                  <Mail size={17} color="#008F83" />
                  <span><strong>Email:</strong> {PART4_MEDIA.email}</span>
                </a>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem'
                  }}
                >
                  <Clock size={17} color="#008F83" />
                  <span><strong>Working Hours:</strong> Mon – Sun: 9:00 AM – 7:30 PM</span>
                </div>
              </div>
            </div>

            {/* Clickable Action Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-light)',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <a
                href={officeMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                id="view-on-google-maps-btn"
                aria-label="View Office on Google Maps"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap'
                }}
              >
                <MapPin size={18} style={{ flexShrink: 0 }} />
                <span>View on Google Maps</span>
                <ExternalLink size={14} style={{ flexShrink: 0 }} />
              </a>

              <a
                href={officeDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                id="get-directions-btn"
                aria-label="Get Directions to Office"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap'
                }}
              >
                <Navigation size={18} style={{ flexShrink: 0 }} />
                <span>Get Directions</span>
                <ExternalLink size={14} style={{ flexShrink: 0 }} />
              </a>
            </div>

            <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#8A99A4', textAlign: 'center' }}>
              Note: This map location belongs exclusively to the corporate office. Property sites have their own respective coordinates.
            </div>
          </div>

          {/* Interactive Visual Map Preview Card */}
          <div
            className="card"
            style={{
              padding: '0',
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-light)',
              minHeight: '380px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Embedded Google Maps view */}
            <div style={{ flex: 1, minHeight: '320px', width: '100%', position: 'relative' }}>
              <iframe
                title="Perfect Homes & Developers Office Map"
                src="https://maps.google.com/maps?q=13.124850,80.043786&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '340px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Bottom Bar with direct link */}
            <div
              style={{
                padding: '0.9rem 1.25rem',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--deep-teal)' }}>
                  Office Open for In-Person Consultation
                </span>
              </div>
              <a
                href={officeMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#008F83',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Open in Google Maps App <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
