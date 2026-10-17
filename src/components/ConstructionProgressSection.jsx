/* ==========================================================================
   PERFECT HOMES & DEVELOPERS — PART 3: CONSTRUCTION WORK & PROGRESS SECTION
   Showcases construction photographs and on-site progress video walkthroughs.
   Includes video playback controls and download options.
   ========================================================================== */

import React, { useState } from 'react';
import { Hammer, Play, Download, CheckCircle2, ShieldCheck, HardHat, Eye, X, ZoomIn } from 'lucide-react';
import { PART3_MEDIA } from '../data/projectMediaHelpers.js';

export default function ConstructionProgressSection() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const images = PART3_MEDIA.images || [];
  const videos = PART3_MEDIA.videos || [];

  return (
    <section
      id="construction-progress-section"
      style={{
        padding: '4rem 0',
        backgroundColor: '#F5FAF9',
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
            <HardHat size={15} />
            <span>Part 3 — Construction Quality & On-Site Progress</span>
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
            Live Site Construction & Engineering Standards
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: 0 }}>
            Real on-site construction footage and progress records capturing structural pillar reinforcement, foundation masonry, and build execution by Perfect Homes & Developers.
          </p>
        </div>

        {/* Video Walkthroughs Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--deep-teal)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={20} color="#008F83" />
              <span>On-Site Construction Video Walkthroughs ({videos.length} Videos)</span>
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Recorded directly on project grounds
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {videos.map((vid, idx) => (
              <div
                key={vid.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Video Player */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    aspectRatio: '16/9'
                  }}
                >
                  <video
                    controls
                    preload="metadata"
                    poster={vid.poster}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  >
                    <source src={vid.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Video Info & Download */}
                <div style={{ marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008F83', textTransform: 'uppercase' }}>
                        Progress Video #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        Site Footage
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--deep-teal)', margin: '0 0 6px' }}>
                      {vid.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
                      {vid.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                    <a
                      href={vid.url}
                      download={vid.downloadName || `construction-progress-${idx + 1}.mp4`}
                      className="btn btn-secondary"
                      style={{
                        width: '100%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      <Download size={15} /> Download Video ({idx + 1})
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Construction Photos & Engineering Standards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          {/* Construction Photo Gallery */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-teal)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} color="#008F83" />
              <span>Site Photography</span>
            </h3>

            {images.map((imgSrc, i) => (
              <div
                key={i}
                className="card"
                onClick={() => setSelectedPhoto(imgSrc)}
                style={{
                  padding: '0',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  aspectRatio: '16/10',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={imgSrc}
                  alt="Construction Work Site Progress"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1.25rem',
                    color: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>Active Foundation & Framing</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>Click to view full resolution</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '6px', borderRadius: '50%' }}>
                      <ZoomIn size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Construction Quality Standards */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-light)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-teal)', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} color="#008F83" />
              <span>Our 4-Stage Construction Quality Protocol</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,143,131,0.1)', color: '#008F83', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                  1
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.92rem' }}>Soil Bearing Capacity & Deep Column Footing</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Tested soil strata with certified Fe-550 TMT steel bar framing and M20/M25 concrete mix design.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,143,131,0.1)', color: '#008F83', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                  2
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.92rem' }}>Anti-Termite Treatment & Plinth Beam Damp-Proofing</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Chemical soil treatment barrier across the entire perimeter with bituminous damp-proof coursing.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,143,131,0.1)', color: '#008F83', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                  3
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.92rem' }}>Chamber Brick Masonry & Concealed Conduit Systems</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>High-density red chamber burnt bricks with concealed ISI PVC conduit for electrical and CPVC plumbing.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,143,131,0.1)', color: '#008F83', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                  4
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.92rem' }}>Double-Coat Cement Plastering & Waterproof Terrace</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Smooth interior putty finish, exterior weather-shield paint, and multi-layer elastomeric terrace coating.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for Construction Photo */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
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
            onClick={() => setSelectedPhoto(null)}
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
            aria-label="Close photo preview"
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
              src={selectedPhoto}
              alt="Construction work detail"
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
                <div style={{ fontWeight: 700 }}>Part 3 Construction Site Photograph</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Live foundation and framing work</div>
              </div>

              <a
                href={selectedPhoto}
                download={selectedPhoto.split('/').pop()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
              >
                <Download size={15} /> Download Photo
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
