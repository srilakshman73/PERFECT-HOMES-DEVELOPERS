/* ==========================================================================
   PERFECT HOMES & DEVELOPERS — PART 8: MODEL HOUSES SHOWCASE
   Dedicated Model Houses section with separate project cards,
   verified photo counts (74 photos + 3 videos = 77 total assets),
   walkthrough video players, and unassigned media review gallery.
   ========================================================================== */

import React, { useState } from 'react';
import { Sparkles, Home, Play, Download, Eye, X, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { PART8_MEDIA } from '../data/projectMediaHelpers.js';
import { useProperties } from '../context/PropertyContext';

export default function ModelHousesSection({ navigate, onViewProperty, onOpenScheduleVisit }) {
  const { properties } = useProperties();

  // Model House properties
  const modelHouseProperties = properties.filter((p) => p.category === 'Model Houses' && p.id !== 'ph-112');
  const masterArchiveProperty = properties.find((p) => p.id === 'ph-112');

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'aster', 'bloom', 'celeste', 'unassigned'
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [currentGalleryPhotos, setCurrentGalleryPhotos] = useState([]);

  const allPhotos = PART8_MEDIA.images || [];
  const videos = PART8_MEDIA.videos || [];

  // Categorized subsets
  const asterPhotos = allPhotos.slice(0, 16);
  const bloomPhotos = allPhotos.slice(16, 32);
  const celestePhotos = allPhotos.slice(32, 48);
  const unassignedPhotos = allPhotos.slice(48);

  const getActivePhotos = () => {
    switch (activeTab) {
      case 'aster': return asterPhotos;
      case 'bloom': return bloomPhotos;
      case 'celeste': return celestePhotos;
      case 'unassigned': return unassignedPhotos;
      default: return allPhotos;
    }
  };

  const activePhotos = getActivePhotos();

  const handleOpenPhoto = (index, list) => {
    setCurrentGalleryPhotos(list);
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : currentGalleryPhotos.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev < currentGalleryPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      id="model-houses-section"
      style={{
        padding: '4.5rem 0 5rem',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 143, 131, 0.08)',
              color: '#008F83',
              padding: '0.35rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.75rem'
            }}
          >
            <Sparkles size={15} />
            <span>Part 8 — Architectural Living Showcases</span>
          </div>

          <h2
            style={{
              fontSize: '2.3rem',
              fontWeight: 800,
              color: 'var(--deep-teal)',
              lineHeight: 1.2,
              margin: '0 0 0.85rem'
            }}
          >
            Model Houses & Finished Villa Elevations
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 auto 1.25rem' }}>
            Experience actual finished craftsmanship before construction begins. Explore 74 high-resolution photographs and 3 on-site video walkthroughs of our contemporary villas.
          </p>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              backgroundColor: '#F5FAF9',
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-light)',
              fontSize: '0.88rem'
            }}
          >
            <span style={{ color: 'var(--deep-teal)', fontWeight: 700 }}>
              74 Verified Photographs
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--primary-teal)', fontWeight: 700 }}>
              3 Video Walkthroughs
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: '#B27B08', fontWeight: 700 }}>
              3 Designer Villa Models
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              1 Admin Review Gallery
            </span>
          </div>
        </div>

        {/* 3 Model House Project Cards */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--deep-teal)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={22} color="#008F83" />
              <span>Designer Model House Collections</span>
            </h3>
            <button
              onClick={() => navigate('listing', { category: 'Model Houses' })}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            >
              View in Property Catalog <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {modelHouseProperties.map((prop) => (
              <div
                key={prop.id}
                className="card"
                style={{
                  padding: '0',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border-light)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Image Banner */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16/10',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onClick={() => onViewProperty ? onViewProperty(prop) : navigate('property', { id: prop.id })}
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'var(--deep-teal)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {prop.category}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      color: '#FFFFFF',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {prop.images.length} Photos
                  </div>
                </div>

                {/* Content Details */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-teal)' }}>
                        {prop.priceDisplay}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {prop.availability}
                      </span>
                    </div>

                    <h4
                      onClick={() => onViewProperty ? onViewProperty(prop) : navigate('property', { id: prop.id })}
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--deep-teal)',
                        margin: '0 0 6px',
                        cursor: 'pointer'
                      }}
                    >
                      {prop.title}
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.45 }}>
                      {prop.tagline}
                    </p>

                    {/* Quick Specs */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        backgroundColor: '#F5FAF9',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <div><strong>Type:</strong> {prop.propertyType}</div>
                      <div><strong>BHK:</strong> {prop.bhk} BHK</div>
                      <div><strong>Area:</strong> {prop.builtUpArea} sq.ft</div>
                      <div><strong>Facing:</strong> {prop.facing}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <button
                      onClick={() => onViewProperty ? onViewProperty(prop) : navigate('property', { id: prop.id })}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '0.55rem' }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onOpenScheduleVisit ? onOpenScheduleVisit(prop) : navigate('contact')}
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem', padding: '0.55rem' }}
                    >
                      Schedule Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Model House Walkthrough Videos */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--deep-teal)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={20} color="#008F83" />
              <span>Model House Architectural Video Walkthroughs ({videos.length} Videos)</span>
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real interior finishes, living room ceilings, and kitchen layouts
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
                  backgroundColor: '#F9FBFB',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
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

                <div style={{ marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008F83', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Model House Video #{idx + 1}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--deep-teal)', margin: '0 0 6px' }}>
                      {vid.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
                      Comprehensive room-by-room walkthrough exploring flooring, light fixtures, and exterior design.
                    </p>
                  </div>

                  <a
                    href={vid.url}
                    download={vid.downloadName || `model-house-walkthrough-${idx + 1}.mp4`}
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Download size={15} /> Download Video Walkthrough #{idx + 1}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbed Photo Showcase with Unassigned Gallery Review */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--deep-teal)', margin: 0 }}>
                Model Houses Photo Catalog ({activePhotos.length} Photos)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Filtered views across specific villa models and the administrator review gallery
              </p>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                backgroundColor: '#F0F4F4',
                padding: '4px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {[
                { id: 'all', label: `All Photos (${allPhotos.length})` },
                { id: 'aster', label: `Villa Aster (${asterPhotos.length})` },
                { id: 'bloom', label: `Villa Bloom (${bloomPhotos.length})` },
                { id: 'celeste', label: `Villa Celeste (${celestePhotos.length})` },
                { id: 'unassigned', label: `Review Gallery (${unassignedPhotos.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === tab.id ? 'var(--deep-teal)' : 'transparent',
                    color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unassigned Gallery Info Banner (When activeTab === 'unassigned') */}
          {activeTab === 'unassigned' && (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HelpCircle size={20} color="#D97706" />
                <div>
                  <strong style={{ color: '#92400E', fontSize: '0.92rem' }}>
                    Part 8 Unassigned Media Gallery ({unassignedPhotos.length} Photographs)
                  </strong>
                  <div style={{ fontSize: '0.82rem', color: '#B45309' }}>
                    These photographs are safely cataloged for administrator review rather than guessed. Admins can allocate them to specific projects via the Admin Dashboard.
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('admin', { tab: 'media' })}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
              >
                Go to Admin Media Manager
              </button>
            </div>
          )}

          {/* Photos Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem'
            }}
          >
            {activePhotos.map((src, index) => {
              const fileName = src.split('/').pop();
              return (
                <div
                  key={index}
                  className="card"
                  onClick={() => handleOpenPhoto(index, activePhotos)}
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
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <img
                    src={src}
                    alt={`Model House Architectural Photo #${index + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />

                  {/* Hover overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(6, 78, 73, 0.85) 0%, transparent 70%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
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
                          padding: '5px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none'
                        }}
                        title="Download photograph"
                      >
                        <Download size={14} />
                      </a>
                    </div>

                    <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem' }}>
                      Click to expand ({index + 1}/{activePhotos.length})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && currentGalleryPhotos.length > 0 && (
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
            aria-label="Close photo preview"
          >
            <X size={24} />
          </button>

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
              src={currentGalleryPhotos[selectedPhotoIndex]}
              alt={`Model House Photograph #${selectedPhotoIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            />

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
                  Part 8 Model House Architecture Photo #{selectedPhotoIndex + 1}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Perfect Homes & Developers Architectural Elevation
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {selectedPhotoIndex + 1} / {currentGalleryPhotos.length}
                </span>

                <a
                  href={currentGalleryPhotos[selectedPhotoIndex]}
                  download={currentGalleryPhotos[selectedPhotoIndex].split('/').pop()}
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
