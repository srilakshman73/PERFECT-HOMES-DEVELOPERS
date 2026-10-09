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
  Download
} from 'lucide-react';

export default function PropertyDetailsPage({
  property,
  navigate,
  onOpenBrochure,
  onOpenScheduleVisit,
  onViewProperty
}) {
  const { isWishlisted, toggleWishlist, isCompared, toggleCompare, submitEnquiry, properties } = useProperties();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [fullscreenLightboxOpen, setFullscreenLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview | gallery | location | amenities | floorplan | reviews

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
    `Hello Perfect Homes & Developers, I am viewing "${property.title}" (${property.priceDisplay}) on your website. Please share the complete price sheet and legal copy.`
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* ==========================================================
          1. BREADCRUMBS & TOP TITLE HEADER
          ========================================================== */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <button onClick={() => navigate('home')} style={{ color: 'var(--text-secondary)' }}>Home</button>
            <ChevronRight size={13} />
            <button onClick={() => navigate('listing')} style={{ color: 'var(--text-secondary)' }}>Properties</button>
            <ChevronRight size={13} />
            <button onClick={() => navigate('listing', { location: property.location })} style={{ color: 'var(--text-secondary)' }}>{property.location}</button>
            <ChevronRight size={13} />
            <span style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>{property.title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                <span className="badge badge-teal">{property.category}</span>
                <span className="badge badge-success">{property.availability}</span>
                <span className="badge badge-primary">{property.approval}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.3rem)', color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                {property.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--primary-teal)" />
                <span>{property.fullAddress}</span>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--deep-teal)', fontFamily: 'var(--font-display)' }}>
                  {property.priceDisplay}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  EMI starts from <strong>₹{Math.round(property.price * 0.0087).toLocaleString()}/mo</strong>
                </div>
              </div>

              {/* Action icons bar */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              alt={property.title}
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
          </div>

          {/* Thumbnail Preview Strip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '460px', overflowY: 'auto' }} className="gallery-thumbnails-col">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
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
                <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.25rem',
            border: '1.5px solid var(--border-color)'
          }}
        >
          {/* BHK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={specIconCircle}>
              <BedDouble size={20} color="var(--primary-teal)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configuration</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>
                {property.bhk > 0 ? `${property.bhk} BHK` : 'Plotted Land'}
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
                {property.builtUpArea > 0 ? `${property.builtUpArea} sq.ft` : 'Customizable'}
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
                {property.plotArea} sq.ft
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
        </div>
      </section>

      {/* ==========================================================
          4. MAIN TWO-COLUMN BODY: TABS + SIDEBAR ENQUIRY FORM
          ========================================================== */}
      <section className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }} className="property-main-layout">
          {/* LEFT: TABS & CONTENT PANELS */}
          <div>
            {/* Tab Navigation Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '2px solid var(--border-color)',
                paddingBottom: '0.5rem',
                overflowX: 'auto',
                marginBottom: '1.5rem'
              }}
            >
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'location', label: 'Location & Nearby' },
                { id: 'amenities', label: 'Amenities' },
                { id: 'floorplan', label: 'Floor Plan' },
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
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Property Description</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  {property.description}
                </p>

                <h4 style={{ fontSize: '1.15rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Project Highlights</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
                  {(property.highlights || []).map((hl, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                      <CheckCircle2 size={16} color="var(--primary-teal)" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
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
              </div>
            )}

            {/* TAB 2: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1.25rem' }}>High-Resolution Photo Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveImgIndex(idx);
                        setFullscreenLightboxOpen(true);
                      }}
                      style={{
                        height: '200px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(6, 78, 73, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                      >
                        <Maximize2 size={24} color="#FFFFFF" />
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
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
              </div>
            )}

            {/* TAB 5: FLOOR PLAN */}
            {activeTab === 'floorplan' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1rem' }}>Architectural Floor &amp; Layout Plan</h3>
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
              </div>
            )}

            {/* TAB 6: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-teal)', marginBottom: '1.25rem' }}>Verified Buyer Reviews &amp; Feedback</h3>

                {/* Review Form */}
                <form onSubmit={handleAddReview} style={{ backgroundColor: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--deep-teal)', marginBottom: '1rem' }}>Leave a Review for this Property</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '1rem', marginBottom: '1rem' }}>
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
          <div>
            <div
              className="card"
              style={{
                padding: '1.75rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                position: 'sticky',
                top: '90px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--turquoise-light)',
                    color: 'var(--primary-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--deep-teal)', margin: 0 }}>Direct Builder Enquiry</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Instant callback within 15 minutes
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleInlineEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Your Full Name *"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="Mobile Number *"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Email Address"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Your message or preferred visit date..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEnquiry}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {isSubmittingEnquiry ? 'Submitting...' : 'Send Property Enquiry'}
                </button>
              </form>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
                <button
                  onClick={() => onOpenScheduleVisit(property)}
                  className="btn btn-turquoise"
                  style={{ width: '100%' }}
                >
                  <Calendar size={16} /> Schedule Free Cab Site Visit
                </button>

                <button
                  onClick={() => onOpenBrochure(property)}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <FileText size={16} /> Get Verified Brochure
                </button>

                <a
                  href={`https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%' }}
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>

                <a
                  href={`tel:${COMPANY_CONTACT_INFO.phone}`}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <PhoneCall size={16} /> Call +91 98401 23456
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
        <section className="container" style={{ marginTop: '5rem' }}>
          <div className="section-header">
            <span className="section-tag">More In {property.location}</span>
            <h2 className="section-title">Similar Verified Properties You May Like</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
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
            alt="Fullscreen preview"
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
        @media (max-width: 900px) {
          .gallery-grid-layout { grid-template-columns: 1fr !important; }
          .gallery-thumbnails-col { display: none !important; }
          .property-main-layout { grid-template-columns: 1fr !important; }
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
