/* ==========================================================================
   PERFECT HOMES & DEVELOPERS — PART 4: COMPANY OFFICE GALLERY
   Contains 19 photos of the Thiruninravur office.
   Kept strictly separate from property photos.
   ========================================================================== */

import React, { useState } from 'react';
import { Building2, Download, Eye, X, ChevronLeft, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import { PART4_MEDIA } from '../data/projectMediaHelpers.js';

export default function OfficeGallerySection() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const photos = PART4_MEDIA.images;

  const handleOpenLightbox = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      id="office-gallery-section"
      style={{
        padding: '3.5rem 0',
        backgroundColor: '#F5FAF9',
        borderTop: '1px solid var(--border-light)'
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
            <Building2 size={15} />
            <span>Part 4 — Corporate Headquarters Gallery</span>
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
            Our Thiruninravur Office & Workspace
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: '0 auto 1.25rem' }}>
            A glimpse inside our modern client consulting suites, conference facilities, and customer reception desk at No: 3, Krishna Nagar, CTH Road, Thiruninravur.
          </p>

          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: '0.86rem'
            }}
          >
            <span style={{ color: 'var(--deep-teal)', fontWeight: 600 }}>
              <strong>19</strong> Office Photographs
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Dedicated Consultation Desks
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>
              Air-Conditioned Discussion Lounge
            </span>
          </div>
        </div>

        {/* 19 Photos Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {photos.map((src, index) => {
            const fileName = src.split('/').pop();
            return (
              <div
                key={index}
                className="card"
                onClick={() => handleOpenLightbox(index)}
                style={{
                  padding: '0',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  aspectRatio: '4/3',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <img
                  src={src}
                  alt={`Perfect Homes & Developers Office Photo #${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Hover overlay with actions */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(6, 78, 73, 0.85) 0%, rgba(6, 78, 73, 0.2) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '0.85rem',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <a
                      href={src}
                      download={fileName}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--deep-teal)',
                        padding: '6px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none'
                      }}
                      title="Download photograph"
                    >
                      <Download size={15} />
                    </a>
                  </div>

                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.88rem' }}>
                      Office View #{index + 1}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.72rem' }}>
                      Click to expand fullscreen
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(6, 78, 73, 0.75)',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  Photo {index + 1} of {photos.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={handleCloseLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Close button */}
          <button
            onClick={handleCloseLightbox}
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
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Main Photo Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Perfect Homes & Developers Office Photo #${selectedPhotoIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            />

            {/* Bottom Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '650px',
                marginTop: '1rem',
                color: '#FFFFFF'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                  Corporate Office Photograph #{selectedPhotoIndex + 1}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  No: 3, Krishna Nagar, CTH Road, Thiruninravur – 602024
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {selectedPhotoIndex + 1} / {photos.length}
                </span>

                <a
                  href={photos[selectedPhotoIndex]}
                  download={photos[selectedPhotoIndex].split('/').pop()}
                  className="btn btn-primary"
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={15} /> Download
                </a>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
