/* ==========================================================================
   PERFECT HOMES & DEVELOPERS — PART 2: PROMOTIONAL POSTERS SECTION
   Preserves original promotional artwork, text, logos, contact details & QR codes.
   Provides preview and download options.
   ========================================================================== */

import React, { useState } from 'react';
import { Award, Download, Eye, X, ZoomIn, CheckCircle2, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { PART2_MEDIA } from '../data/projectMediaHelpers.js';
import { COMPANY_CONTACT_INFO } from '../data/locationsData.js';

export default function PromotionalPostersSection({ onOpenBrochure }) {
  const [lightboxPoster, setLightboxPoster] = useState(null);

  const posters = PART2_MEDIA.posters || [];

  return (
    <section
      id="promotional-posters-section"
      style={{
        padding: '4rem 0',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(229, 168, 35, 0.12)',
              color: '#B27B08',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.75rem'
            }}
          >
            <Sparkles size={15} />
            <span>Part 2 — Official Promotional Releases & Posters</span>
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
            Verified Project Posters & Launch Artwork
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: 0 }}>
            Official high-resolution promotional materials showcasing government approvals, layout schematics, bank tie-ups, and developer contact credentials.
          </p>
        </div>

        {/* Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left: Poster Showcase */}
          {posters.map((poster) => (
            <div
              key={poster.id}
              className="card"
              style={{
                padding: '1.25rem',
                backgroundColor: '#F9FBFB',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-light)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: '#000000',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}
                onClick={() => setLightboxPoster(poster)}
              >
                <img
                  src={poster.url}
                  alt={poster.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '520px',
                    objectFit: 'contain',
                    display: 'block',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(6, 78, 73, 0.85)',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ZoomIn size={14} /> Click to Enlarge
                </div>
              </div>

              {/* Poster Meta & Actions */}
              <div style={{ width: '100%', marginTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--deep-teal)', margin: '0 0 0.4rem' }}>
                  {poster.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
                  {poster.caption}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setLightboxPoster(poster)}
                    className="btn btn-secondary"
                    style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Eye size={16} /> Preview Poster
                  </button>

                  <a
                    href={poster.url}
                    download={poster.downloadName || "perfect-homes-poster.jpg"}
                    className="btn btn-primary"
                    style={{ flex: '1 1 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Download size={16} /> Download Original Poster
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Right: Verified Highlights & Information Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                backgroundColor: '#F5FAF9',
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-light)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-teal)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22} color="#008F83" />
                <span>Promotional Specifications & Guarantees</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#008F83" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-heading)' }}>CMDA & DTCP Approved Layouts:</strong>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>All highlighted sites hold verifiable government planning approvals with registered sanction numbers.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#008F83" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-heading)' }}>Up to 90% Bank Loan Availability:</strong>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Instant loan sanctions with SBI, HDFC Bank, ICICI Bank, and Canara Bank at attractive interest rates.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#008F83" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-heading)' }}>100% Clear Title & Immediate Patta:</strong>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Legally vetted documents with single-ownership history and immediate individual Patta transfer.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#008F83" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-heading)' }}>Sweet Ground Water & Rapid Transport:</strong>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Potable sweet ground water at 25–30 ft; minutes from local railway stations, bus terminuses, and colleges.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Consultation Banner */}
            <div
              style={{
                backgroundColor: 'var(--deep-teal)',
                color: '#FFFFFF',
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>
                  Request High-Resolution Project Brochure
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Speak directly to our sales office for complete pricing charts and site layouts.
                </p>
              </div>

              <a
                href={COMPANY_CONTACT_INFO.telLink}
                className="btn btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                <PhoneCall size={16} /> Call +91 73050 23919
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxPoster && (
        <div
          onClick={() => setLightboxPoster(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <button
            onClick={() => setLightboxPoster(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Close poster preview"
          >
            <X size={24} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={lightboxPoster.url}
              alt={lightboxPoster.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
              }}
            />

            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '600px',
                color: '#FFFFFF'
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{lightboxPoster.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Preserved original promotional poster</div>
              </div>

              <a
                href={lightboxPoster.url}
                download={lightboxPoster.downloadName || "perfect-homes-poster.jpg"}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
              >
                <Download size={15} /> Download Poster
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
