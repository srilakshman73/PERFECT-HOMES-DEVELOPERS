/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - PROPERTY DETAILS PAGE (DETAILED TABS & GALLERY)
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PropertyCard from '../components/PropertyCard';
import EMICalculator from '../components/EMICalculator';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';
import {
  Heart,
  Scale,
  Share2,
  FileText,
  MessageCircle,
  PhoneCall,
  MapPin,
  BedDouble,
  Maximize2,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Star,
  Send,
  User,
  Car,
  Award,
  Clock,
  Droplets,
  Zap,
  Building2,
  Download,
  ArrowLeft,
  Play,
  ExternalLink,
  Film
} from 'lucide-react';

export default function PropertyDetailsPage({
  property,
  navigate,
  initialTab,
  onOpenBrochure,
  onOpenScheduleVisit,
  onViewProperty
}) {
  const { isWishlisted, toggleWishlist, isCompared, toggleCompare, submitEnquiry, properties } = useProperties();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [fullscreenLightboxOpen, setFullscreenLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) return tabParam;
    if (typeof window !== 'undefined' && window.location.hash === '#video-gallery') return 'videos';
    return initialTab || 'overview';
  });

  // Track video elements for mutual exclusive playback (pause others when one plays)
  const videoRefs = React.useRef({});
  const handleVideoPlay = (id) => {
    Object.entries(videoRefs.current).forEach(([k, el]) => {
      if (k !== String(id) && el && !el.paused) {
        el.pause();
      }
    });
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'videos') {
      setTimeout(() => {
        const el = document.getElementById('video-gallery');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [activeTab]);

  // Review submission state
  const [newReview, setNewReview] = useState({ name: user?.name || '', rating: 5, comment: '' });
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev_1',
      name: 'R. Soundararajan',
      date: '2 weeks ago',
      rating: 5,
      comment: 'Visited the site with family last Sunday. The layout roads are truly 40 feet wide and the groundwater is crystal clear sweet water. Registration documents are 100% genuine.'
    },
    {
      id: 'rev_2',
      name: 'Dr. Kavitha Mohan',
      date: '1 month ago',
      rating: 5,
      comment: 'Superb connectivity to Avadi station and Outer Ring Road. Perfect Homes team helped us get 90% SBI loan sanctioned within 10 days without any hassle.'
    }
  ]);

  // Enquiry inline form
  const [enquiryForm, setEnquiryForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    message: `Hi, I am interested in ${property?.title || 'this property'}. Please share the best pricing and schedule a site visit.`
  });
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImgIndex(0);

    if (property) {
      if (property.slug === 'nathamedu-niranjan-nagar-upcoming-project' || property.isUpcoming) {
        document.title = `${property.title} | Upcoming Residential Project | Perfect Homes & Developers`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute(
            'content',
            'Discover Thiruninravur – Nathamedu Site at Niranjan Nagar, Thiruninravur, Tamil Nadu. Ready-to-construct residential property starting from ₹38 Lakhs by Perfect Homes & Developers.'
          );
        }
      } else {
        document.title = `${property.title} | Perfect Homes & Developers`;
      }
    }
  }, [property]);

  if (!property) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <button onClick={() => navigate('listing')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Properties
        </button>
      </div>
    );
  }

  const isLiked = isWishlisted(property.id);
  const isComp = isCompared(property.id);
  const isUpcomingProject = property.isUpcoming || property.category === 'Upcoming Projects';

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} by Perfect Homes & Developers: ${property.priceDisplay}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Property link copied to clipboard!', 'success');
    }
  };

  const handleInlineEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      addToast('Please enter your name and phone number.', 'error');
      return;
    }

    setIsSubmittingEnquiry(true);
    try {
      await submitEnquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        message: enquiryForm.message
      });
      setEnquiryForm({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        message: 'Enquiry submitted. Thank you!'
      });
    } catch (err) {
      addToast(err.message || 'Submission failed', 'error');
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      addToast('Please write a review comment and your name.', 'error');
      return;
    }
    const rev = {
      id: 'rev_' + Date.now(),
      name: newReview.name,
      date: 'Just now',
      rating: newReview.rating,
      comment: newReview.comment
    };
    setReviewsList([rev, ...reviewsList]);
    setNewReview({ name: user?.name || '', rating: 5, comment: '' });
    addToast('Thank you! Your verified review has been posted.', 'success');
  };

  const similarProperties = properties
    .filter((p) => p.id !== property.id && (p.location === property.location || p.category === property.category))
    .slice(0, 3);

  const whatsappMessage = encodeURIComponent(
    isUpcomingProject
      ? `Hello Perfect Homes & Developers, I am interested in the upcoming project "${property.title}" at Niranjan Nagar, Nathamedu (${property.priceDisplay}). Please share project details, layout plans, and launch updates.`
      : `Hello Perfect Homes & Developers, I am viewing "${property.title}" (${property.priceDisplay}) on your website. Please share the complete price sheet and legal copy.`
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* ==========================================================
          1. BREADCRUMBS & TOP TITLE HEADER
          ========================================================== */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="property-breadcrumbs" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: 0 }}>
              <button onClick={() => navigate('home')} style={{ color: 'var(--text-secondary)' }}>Home</button>
              <ChevronRight size={13} style={{ flexShrink: 0 }} />
              <button onClick={() => navigate('listing')} style={{ color: 'var(--text-secondary)' }}>Properties</button>
              <ChevronRight size={13} style={{ flexShrink: 0 }} />
              <button onClick={() => navigate('listing', { location: property.location })} style={{ color: 'var(--text-secondary)' }}>{property.location}</button>
              <ChevronRight size={13} style={{ flexShrink: 0 }} />
              <span className="breadcrumb-current-title" style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>{property.title}</span>
            </div>

            {/* Prominent Back to Properties Button */}
            <button
              onClick={() => navigate('listing')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
            >
              <ArrowLeft size={14} /> Back to Properties
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ minWidth: 0, flex: '1 1 320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal">{property.category}</span>
                {property.statusBadge ? (
                  <span
                    className="badge badge-wrap"
                    style={{
                      background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: 1.35,
                      maxWidth: '100%',
                      textAlign: 'left'
                    }}
                  >
                    {property.statusBadge}
                  </span>
                ) : (
                  <>
                    <span className="badge badge-success">{property.availability}</span>
                    <span className="badge badge-primary">{property.approval}</span>
                  </>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.3rem)', color: 'var(--text-heading)', marginBottom: '0.45rem', minWidth: 0, wordBreak: 'break-word', lineHeight: 1.25 }}>
                {property.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)', flexWrap: 'wrap', minWidth: 0, wordBreak: 'break-word' }}>
                <MapPin size={16} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ minWidth: 0 }}>{property.fullAddress}</span>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="property-header-price-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.65rem' }}>
              <div className="property-header-price-box" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 5.2vw, 2.2rem)', fontWeight: 800, color: 'var(--deep-teal)', fontFamily: 'var(--font-display)', lineHeight: 1.15 }}>
                  {property.priceDisplay}
                </div>
                {isUpcomingProject ? (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.4, marginTop: '2px' }}>
                    Final pricing &amp; availability to be confirmed with company
                  </div>
                ) : property.price > 0 ? (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    EMI starts from <strong>₹{Math.round(property.price * 0.0087).toLocaleString()}/mo</strong>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Contact for verified pricing &amp; site visit
                  </div>
                )}
              </div>

              {/* Action icons bar */}
              <div className="property-header-actions-bar" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleWishlist(property.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: isLiked ? '#EF4444' : 'var(--text-heading)' }}
                >
                  <Heart size={15} fill={isLiked ? '#EF4444' : 'none'} />
                  <span>{isLiked ? 'Saved' : 'Wishlist'}</span>
                </button>

                <button
                  onClick={() => toggleCompare(property)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: isComp ? 'var(--gold-accent)' : 'var(--text-heading)' }}
                >
                  <Scale size={15} />
                  <span>{isComp ? 'Compared' : 'Compare'}</span>
                </button>

                <button onClick={handleShare} className="btn btn-secondary btn-sm">
                  <Share2 size={15} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          2. HD IMAGE GALLERY & FULLSCREEN VIEWER
          ========================================================== */}
      <section className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '1rem' }} className="gallery-grid-layout">
          {/* Main Hero Preview */}
          <div
            className="gallery-main-hero"
            style={{
              position: 'relative',
              height: '460px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: '#EAF2F0',
              cursor: 'pointer'
            }}
            onClick={() => setFullscreenLightboxOpen(true)}
          >
            <img
              src={images[activeImgIndex]}
              alt={property.imageAlts?.[activeImgIndex] || property.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/media/part8/images/whatsapp_image_2026-10-16_at_11_24_53_am_1__1.jpeg';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Maximize2 size={14} /> View Fullscreen ({activeImgIndex + 1}/{images.length})
            </div>

            {/* Watch Site Videos Floating Pill on Hero */}
            {property.videos && property.videos.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('videos');
                }}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  backgroundColor: '#064E49',
                  backgroundImage: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
                  color: '#FFFFFF',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 3
                }}
                title="Watch on-site visit walkthrough videos"
              >
                <Play size={14} fill="#FFFFFF" />
                <span>Watch {property.videos.length} Site Videos</span>
              </button>
            )}
          </div>

          {/* Thumbnail Preview Strip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '460px', overflowY: 'auto' }} className="gallery-thumbnails-col">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className="gallery-thumb-item"
                style={{
                  height: '100px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activeImgIndex === idx ? '3px solid var(--primary-teal)' : '2px solid transparent',
                  opacity: activeImgIndex === idx ? 1 : 0.7,
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                <img
                  src={img}
                  alt={property.imageAlts?.[idx] || `${property.title} thumbnail ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/media/part8/images/whatsapp_image_2026-10-16_at_11_24_53_am_1__1.jpeg';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          3. KEY SPECIFICATIONS STRIP
          ========================================================== */}
      <section className="container" style={{ marginTop: '1.75rem' }}>
        <div
          className="card property-specs-card"
          style={{
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            backgroundColor: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: '1.25rem',
            border: '1.5px solid var(--border-color)',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {isUpcomingProject ? (
            <>
              {/* Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Building2 size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--deep-teal)' }}>
                    Upcoming Projects
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Layers size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property Type</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--deep-teal)' }}>
                    {property.propertyType || 'Residential / Ready-to-Construct'}
                  </div>
                </div>
              </div>

              {/* Construction Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Clock size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Construction Status</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--deep-teal)' }}>
                    {property.constructionStatus || 'Planned to start soon'}
                  </div>
                </div>
              </div>

              {/* Starting Budget */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Sparkles size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Starting Budget</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--deep-teal)' }}>
                    {property.priceDisplay}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <MapPin size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--deep-teal)' }}>
                    {property.location}
                  </div>
                </div>
              </div>

              {/* Direct Enquiry */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <MessageCircle size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enquiry</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--deep-teal)' }}>
                    Call / WhatsApp
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Configuration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <BedDouble size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configuration</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>
                    {property.bhk > 0 ? `${property.bhk} BHK` : property.propertyType === 'Plot' || property.category === 'Residential Plots' ? 'Plotted Land' : property.propertyType || 'Independent House'}
                  </div>
                </div>
              </div>

              {/* Built up Area */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Maximize2 size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Built-up Area</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>
                    {property.builtUpArea > 0 ? `${property.builtUpArea} sq.ft` : property.availability || 'Ready to Move'}
                  </div>
                </div>
              </div>

              {/* Plot Area */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Layers size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plot Area</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>
                    {property.plotArea > 0 ? `${property.plotArea} sq.ft` : 'Direct Road Access'}
                  </div>
                </div>
              </div>

              {/* Facing */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Compass size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Facing Direction</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>
                    {property.facing || 'East'} Face
                  </div>
                </div>
              </div>

              {/* Road */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Car size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Access Road</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>
                    {property.roadWidth || '40ft Blacktop'}
                  </div>
                </div>
              </div>

              {/* Water */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={specIconCircle}>
                  <Droplets size={20} color="var(--primary-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ground Water</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>
                    Sweet @ 20-30ft
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ==========================================================
          4. MAIN TWO-COLUMN BODY: TABS + SIDEBAR ENQUIRY FORM
          ========================================================== */}
      <section className="container" style={{ marginTop: '2.5rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="property-main-layout">
          {/* LEFT: TABS & CONTENT PANELS */}
          <div className="property-content-col">
            {/* Quick Action Buttons Bar */}
            <div
              className="property-quick-actions-bar"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.65rem',
                marginBottom: '1.5rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#F5FAF9',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-light)',
                alignItems: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              {property.videos && property.videos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className="btn btn-primary property-quick-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '0.55rem 0.9rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    whiteSpace: 'normal',
                    textAlign: 'center'
                  }}
                >
                  <Play size={15} fill="#FFFFFF" style={{ flexShrink: 0 }} /> <span>Watch Video</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const f = document.getElementById('enquiry-form-card');
                  if (f) f.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-turquoise property-quick-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'normal',
                  textAlign: 'center'
                }}
              >
                <Send size={15} style={{ flexShrink: 0 }} /> <span>Enquire Now</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenScheduleVisit(property)}
                className="btn btn-secondary property-quick-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'normal',
                  textAlign: 'center'
                }}
              >
                <Calendar size={15} style={{ flexShrink: 0 }} /> <span>Schedule a Site Visit</span>
              </button>

              <a
                href={COMPANY_CONTACT_INFO.telLink}
                className="btn btn-secondary property-quick-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'normal',
                  textAlign: 'center'
                }}
              >
                <PhoneCall size={15} style={{ flexShrink: 0 }} /> <span>Call Us</span>
              </a>

              <a
                href={`https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp property-quick-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'normal',
                  textAlign: 'center'
                }}
              >
                <MessageCircle size={15} style={{ flexShrink: 0 }} /> <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Tab Navigation Buttons */}
            <div
              className="property-tabs-nav"
              style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '2px solid var(--border-color)',
                paddingBottom: '0.5rem',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                marginBottom: '1.5rem',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              {[
                { id: 'overview', label: 'Overview' },
                ...(property.videos && property.videos.length > 0
                  ? [
                      {
                        id: 'videos',
                        label: `Site Videos (${property.videos.length})`,
                        hasPlayIcon: true
                      }
                    ]
                  : []),
                { id: 'gallery', label: `Photo Gallery (${images.length})` },
                { id: 'location', label: 'Location & Nearby' },
                { id: 'amenities', label: 'Amenities' },
                ...(property.bhk > 0 ? [{ id: 'floorplan', label: 'Floor Plan' }] : []),
                { id: 'reviews', label: `Reviews (${reviewsList.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontWeight: activeTab === tab.id ? 700 : 600,
                    fontSize: '0.95rem',
                    color: activeTab === tab.id ? 'var(--primary-teal)' : 'var(--text-secondary)',
                    borderBottom: activeTab === tab.id ? '3px solid var(--primary-teal)' : '3px solid transparent',
                    marginBottom: '-0.6rem',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {tab.hasPlayIcon && (
                    <Play size={13} fill={activeTab === tab.id ? 'var(--primary-teal)' : 'currentColor'} />
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="card property-details-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                {property.headline && (
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--deep-teal)', fontWeight: 800, marginBottom: '0.75rem' }}>
                    {property.headline}
                  </h3>
                )}
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-teal)', marginBottom: '0.75rem' }}>Project Description</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  {property.description}
                </p>

                {/* Dedicated Site Videos Highlight Banner */}
                {property.videos && property.videos.length > 0 && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(6, 78, 73, 0.08) 0%, rgba(0, 143, 131, 0.12) 100%)',
                      border: '1.5px solid var(--primary-teal)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem 1.5rem',
                      marginBottom: '1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: '1 1 280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--deep-teal)', fontSize: '1.05rem', marginBottom: '4px' }}>
                        <Film size={18} color="var(--primary-teal)" />
                        <span>{property.videos.length} On-Site Walkthrough Videos Available</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Watch comprehensive real site videos covering Niranjan Nagar layout, 40-ft access road, boundary views, and surrounding residences.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('videos')}
                      className="btn btn-primary"
                      style={{
                        padding: '0.55rem 1.15rem',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Play size={14} fill="#FFFFFF" />
                      <span>Watch All {property.videos.length} Videos</span>
                    </button>
                  </div>
                )}

                <h4 style={{ fontSize: '1.15rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Key Highlights</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
                  {(property.highlights || []).map((hl, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                      <CheckCircle2 size={16} color="var(--primary-teal)" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {isUpcomingProject ? (
                  <div style={{ backgroundColor: 'rgba(0, 143, 131, 0.08)', border: '1.5px solid var(--primary-teal)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--deep-teal)', marginBottom: '6px' }}>
                      <Clock size={18} color="var(--primary-teal)" /> Upcoming Construction Status
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-heading)', lineHeight: 1.6 }}>
                      <strong>{property.constructionStatus || 'Construction work is planned to start soon.'}</strong>
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Starting budget from <strong>{property.priceDisplay}</strong>. Plot dimensions, final pricing, and site availability must be confirmed directly with Perfect Homes &amp; Developers.
                    </p>
                  </div>
                ) : (
                  <>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Government Approval &amp; Legal Info</h4>
                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <div><strong>Approval Authority:</strong> {property.approval}</div>
                        <div><strong>Registration Number:</strong> {property.approvalNo}</div>
                        <div><strong>Bank Loan Sanction:</strong> {property.bankLoan}</div>
                        <div><strong>Legal Documentation:</strong> 100% verified 40-year parent title deed with individual Patta</div>
                      </div>
                    </div>

                    {/* Construction Specifications (if house/villa) */}
                    {property.specifications && (
                      <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Technical Specifications</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem' }}>
                          {Object.entries(property.specifications).map(([key, val]) => (
                            <div key={key} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                                {key}
                              </div>
                              <div style={{ fontSize: '0.88rem', color: 'var(--text-heading)', marginTop: '2px' }}>
                                {val}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 2: SITE VIDEOS GALLERY */}
            {activeTab === 'videos' && (
              <div id="video-gallery" className="card property-details-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                      <Film size={15} /> Verified Site Walkthrough
                    </div>
                    <h3 style={{ fontSize: '1.45rem', color: 'var(--deep-teal)', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
                      Site Visit Videos — {property.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
                      Real on-site walkthrough videos of {property.title}, access road, surrounding residential homes, boundary views, and road connectivity. Watch videos directly on the website or download individual original MP4 files below.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-teal" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      {property.videos?.length || 0} Videos Available
                    </span>
                    <span className="badge badge-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      HD MP4 Format
                    </span>
                  </div>
                </div>

                {/* Videos Responsive Grid */}
                <div
                  className="property-videos-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: '1.75rem'
                  }}
                >
                  {(property.videos || [])
                    .filter((v) => v.published !== false)
                    .map((v, index) => (
                      <div
                        key={v.id || index}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-lg)',
                          border: '1.5px solid var(--border-color)',
                          overflow: 'hidden',
                          boxShadow: '0 4px 16px rgba(6, 78, 73, 0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'box-shadow 0.2s ease'
                        }}
                      >
                        {/* Video Player Container */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '16 / 9',
                            backgroundColor: '#000000',
                            overflow: 'hidden'
                          }}
                        >
                          <video
                            ref={(el) => {
                              if (el) videoRefs.current[v.id || index] = el;
                            }}
                            controls
                            preload="metadata"
                            playsInline
                            poster={v.poster}
                            onPlay={() => handleVideoPlay(v.id || index)}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                          >
                            <source src={v.url} type="video/mp4" />
                            Your browser does not support HTML5 video playback.
                          </video>
                        </div>

                        {/* Video Details & Action Download Row */}
                        <div
                          style={{
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            justifyContent: 'space-between',
                            gap: '0.85rem'
                          }}
                        >
                          <div>
                            {/* Meta Badge */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                marginBottom: '0.45rem'
                              }}
                            >
                              <span
                                style={{
                                  backgroundColor: 'rgba(0, 143, 131, 0.12)',
                                  color: 'var(--primary-teal)',
                                  fontWeight: 700,
                                  fontSize: '0.72rem',
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  textTransform: 'uppercase'
                                }}
                              >
                                {v.shortTitle || `Video #${index + 1}`} • {v.duration || 'Walkthrough'}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                MP4
                              </span>
                            </div>

                            {/* Title */}
                            <h4
                              style={{
                                fontSize: '1.05rem',
                                fontWeight: 800,
                                color: 'var(--deep-teal)',
                                margin: '0 0 0.45rem 0',
                                lineHeight: 1.35
                              }}
                            >
                              {v.title}
                            </h4>

                            {/* Description */}
                            <p
                              style={{
                                fontSize: '0.86rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.55,
                                margin: 0
                              }}
                            >
                              {v.description}
                            </p>
                          </div>

                          {/* Action Row: Download Button + Open Tab */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '0.65rem',
                              paddingTop: '0.85rem',
                              borderTop: '1px solid var(--border-light)'
                            }}
                          >
                            {/* Download Video Button */}
                            <a
                              href={v.url}
                              download={v.downloadName || `nathamedu-site-video-${index + 1}.mp4`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '7px',
                                padding: '0.55rem 1rem',
                                backgroundColor: '#064E49',
                                backgroundImage: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
                                color: '#FFFFFF',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                boxShadow: '0 2px 6px rgba(0, 143, 131, 0.25)',
                                flex: '1 1 auto'
                              }}
                              title={`Download ${v.title} (${v.downloadName || 'MP4'})`}
                            >
                              <Download size={15} />
                              <span>Download Video</span>
                            </a>

                            {/* Open Stream in New Tab */}
                            <a
                              href={v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '0.52rem 0.85rem',
                                border: '1.5px solid var(--border-color)',
                                backgroundColor: '#FFFFFF',
                                color: 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '0.78rem',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none'
                              }}
                              title="Open original video directly in a separate browser tab"
                            >
                              <ExternalLink size={13} />
                              <span>Open in Tab</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: PHOTO GALLERY */}
            {activeTab === 'gallery' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>High-Resolution Photo Gallery</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Click any image to view in high-resolution full screen.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1rem' }}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveImgIndex(idx);
                        setFullscreenLightboxOpen(true);
                      }}
                      style={{
                        height: '210px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                      }}
                    >
                      <img
                        src={img}
                        alt={property.imageAlts?.[idx] || `${property.title} - View ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/media/part8/images/whatsapp_image_2026-10-16_at_11_24_53_am_1__1.jpeg';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(6, 78, 73, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                      >
                        <div style={{ backgroundColor: '#FFFFFF', color: 'var(--deep-teal)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Maximize2 size={16} /> Enlarge Photo
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: LOCATION & NEARBY */}
            {activeTab === 'location' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Connectivity &amp; Key Landmarks</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                  Strategic location in {property.location} with immediate access to suburban rail, upcoming metro, arterial bypass, and prime schools.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {(property.nearby || []).map((nb, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-heading)' }}>{nb.name}</span>
                      <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>{nb.distance}</span>
                    </div>
                  ))}
                </div>

                {/* Map placeholder simulation */}
                <div
                  style={{
                    height: '280px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    padding: '1.5rem'
                  }}
                >
                  <MapPin size={40} color="#31D6C5" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '4px' }}>{property.location} Prime Zone</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', maxWidth: '400px' }}>
                    {property.fullAddress}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(property.fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-turquoise btn-sm"
                    style={{ marginTop: '0.75rem' }}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* TAB 4: AMENITIES */}
            {activeTab === 'amenities' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1.25rem' }}>Community Amenities &amp; Infrastructure</h3>
                {isUpcomingProject && (!property.amenities || property.amenities.length === 0) ? (
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                      Community amenities, internal road paving, and utilities for <strong>{property.title}</strong> will be specified as site planning progresses. Perfect Homes &amp; Developers ensures high construction quality and dedicated client assistance across all developments.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                    {(property.amenities || []).map((amen, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1rem',
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <CheckCircle2 size={18} color="var(--primary-teal)" />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-heading)' }}>{amen}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: FLOOR PLAN */}
            {activeTab === 'floorplan' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Architectural Floor &amp; Layout Plan</h3>
                {isUpcomingProject ? (
                  <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-main)', padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--primary-teal)' }}>
                    <Layers size={40} color="var(--primary-teal)" style={{ marginBottom: '0.75rem' }} />
                    <h4 style={{ color: 'var(--deep-teal)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Layout Draft Under Preparation</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
                      Preliminary site layout and customized residential plot allocations for <strong>{property.title}</strong> are being finalized. Connect with our engineering desk to get direct updates.
                    </p>
                    <a
                      href={`https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      <MessageCircle size={16} /> Request Layout Updates on WhatsApp
                    </a>
                  </div>
                ) : (
                  <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                      100% Vastu-compliant architectural blueprint with optimized carpet area and cross ventilation.
                    </p>
                    <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                      <img
                        src={property.floorPlanImg || 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80'}
                        alt="Floor Plan"
                        style={{ maxWidth: '100%', maxHeight: '450px', margin: '0 auto', borderRadius: 'var(--radius-md)' }}
                      />
                      <div style={{ marginTop: '1rem' }}>
                        <button onClick={() => onOpenBrochure(property)} className="btn btn-primary">
                          <Download size={16} /> Download Full Blueprint PDF
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 6: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="card property-details-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1.25rem' }}>Verified Buyer Reviews &amp; Feedback</h3>

                {/* Review Form */}
                <form onSubmit={handleAddReview} style={{ backgroundColor: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--deep-teal)', marginBottom: '1rem' }}>Leave a Review for this Property</h4>
                  <div className="review-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your Full Name"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                    <select
                      className="form-select"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    >
                      <option value="5">★★★★★ (5 Stars)</option>
                      <option value="4">★★★★☆ (4 Stars)</option>
                      <option value="3">★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Share your site visit experience or thoughts on this property..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    style={{ marginBottom: '1rem' }}
                  />
                  <button type="submit" className="btn btn-primary">
                    <Send size={15} /> Submit Review
                  </button>
                </form>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviewsList.map((rev) => (
                    <div key={rev.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--deep-teal)' }}>{rev.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', marginBottom: '6px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#F59E0B" />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reducing Balance EMI Calculator Box */}
            <div style={{ marginTop: '2.5rem' }}>
              <EMICalculator defaultAmount={property.price * 0.8} propertyTitle={property.title} />
            </div>
          </div>

          {/* RIGHT: STICKY ENQUIRY & CONTACT CARD */}
          <div className="property-sidebar-col" style={{ minWidth: 0, width: '100%', maxWidth: '100%' }}>
            <div
              id="enquiry-form-card"
              className="card enquiry-form-card"
              style={{
                padding: 'clamp(1.2rem, 3.5vw, 1.75rem)',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                position: 'sticky',
                top: '90px',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--turquoise-light)',
                    color: 'var(--primary-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MessageCircle size={20} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ fontSize: 'clamp(1.05rem, 3vw, 1.15rem)', color: 'var(--deep-teal)', margin: 0, wordBreak: 'break-word', lineHeight: 1.3 }}>
                    Direct Builder Enquiry
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0', wordBreak: 'break-word' }}>
                    Instant callback within 15 minutes
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleInlineEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Your Full Name *"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="Mobile Number *"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Email Address"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Your message or preferred visit date..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEnquiry}
                  className="btn btn-primary enquiry-submit-btn"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    padding: '0.85rem 1rem',
                    boxSizing: 'border-box',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    textAlign: 'center'
                  }}
                >
                  {isSubmittingEnquiry ? 'Submitting...' : 'Send Property Enquiry'}
                </button>
              </form>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-light)',
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}
              >
                <button
                  onClick={() => onOpenScheduleVisit(property)}
                  className="btn btn-turquoise"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    textAlign: 'center'
                  }}
                >
                  <Calendar size={16} style={{ flexShrink: 0 }} /> <span>Schedule Free Cab Site Visit</span>
                </button>

                <button
                  onClick={() => onOpenBrochure(property)}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    textAlign: 'center'
                  }}
                >
                  <FileText size={16} style={{ flexShrink: 0 }} /> <span>Get Verified Brochure</span>
                </button>

                <a
                  href={`https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    textAlign: 'center'
                  }}
                >
                  <MessageCircle size={16} style={{ flexShrink: 0 }} /> <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={COMPANY_CONTACT_INFO.telLink}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    textAlign: 'center'
                  }}
                  title="Call Sales Advisor"
                >
                  <PhoneCall size={16} style={{ flexShrink: 0 }} /> <span>Call {COMPANY_CONTACT_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          5. SIMILAR / RELATED PROPERTIES
          ========================================================== */}
      {similarProperties.length > 0 && (
        <section className="container" style={{ marginTop: '5rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <div className="section-header">
            <span className="section-tag">More In {property.location}</span>
            <h2 className="section-title">Similar Verified Properties You May Like</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.75rem',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            {similarProperties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onViewDetails={onViewProperty}
                onOpenBrochure={onOpenBrochure}
              />
            ))}
          </div>
        </section>
      )}

      {/* ==========================================================
          FULLSCREEN LIGHTBOX MODAL
          ========================================================== */}
      {fullscreenLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setFullscreenLightboxOpen(false)}
        >
          <button
            onClick={() => setFullscreenLightboxOpen(false)}
            style={{ position: 'absolute', top: '20px', right: '20px', color: '#FFFFFF', padding: '8px' }}
            aria-label="Close fullscreen"
          >
            <X size={30} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
            }}
            style={{ position: 'absolute', left: '20px', color: '#FFFFFF', padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}
          >
            <ChevronLeft size={30} />
          </button>

          <img
            src={images[activeImgIndex]}
            alt={property.imageAlts?.[activeImgIndex] || `${property.title} - Fullscreen View ${activeImgIndex + 1}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/media/part8/images/whatsapp_image_2026-10-16_at_11_24_53_am_1__1.jpeg';
            }}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImgIndex((prev) => (prev + 1) % images.length);
            }}
            style={{ position: 'absolute', right: '20px', color: '#FFFFFF', padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      <style>{`
        .property-main-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 2rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .property-content-col,
        .property-sidebar-col {
          min-width: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .enquiry-form-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .property-quick-actions-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .property-quick-btn {
          flex: 1 1 auto;
          min-width: 120px;
        }
        @media (max-width: 1050px) {
          .property-main-layout {
            grid-template-columns: minmax(0, 1fr) 320px;
            gap: 1.5rem;
          }
        }
        @media (max-width: 900px) {
          .property-main-layout {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 2rem !important;
          }
          .gallery-grid-layout { grid-template-columns: 1fr !important; }
          .gallery-thumbnails-col {
            display: flex !important;
            flex-direction: row !important;
            height: auto !important;
            overflow-x: auto !important;
            gap: 0.5rem !important;
            padding-bottom: 0.5rem !important;
            -webkit-overflow-scrolling: touch;
          }
          .gallery-thumbnails-col > div {
            width: 85px !important;
            height: 60px !important;
            flex-shrink: 0 !important;
          }
          #enquiry-form-card {
            position: static !important;
          }
        }
        @media (max-width: 768px) {
          .property-header-price-actions {
            align-items: flex-start !important;
            width: 100% !important;
            margin-top: 0.4rem !important;
          }
          .property-header-price-box {
            text-align: left !important;
            width: 100% !important;
          }
          .property-header-actions-bar {
            width: 100% !important;
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.4rem !important;
          }
          .property-header-actions-bar .btn {
            width: 100% !important;
            padding: 0.45rem 0.35rem !important;
            font-size: 0.78rem !important;
            justify-content: center !important;
          }
          .gallery-main-hero {
            height: clamp(220px, 50vw, 320px) !important;
          }
          .property-details-card,
          .property-specs-card,
          .enquiry-form-card {
            padding: 1.25rem 1rem !important;
          }
        }
        @media (max-width: 600px) {
          .breadcrumb-current-title {
            max-width: 180px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            vertical-align: bottom;
          }
          .review-form-row {
            grid-template-columns: 1fr !important;
          }
          .property-quick-btn {
            flex: 1 1 calc(50% - 0.5rem);
            font-size: 0.8rem !important;
            padding: 0.5rem 0.6rem !important;
          }
        }
        @media (max-width: 420px) {
          .property-quick-btn {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
}

const specIconCircle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  backgroundColor: 'var(--turquoise-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};
