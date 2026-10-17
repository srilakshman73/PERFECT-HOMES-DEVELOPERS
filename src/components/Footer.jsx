/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - GLOBAL FOOTER (EXACT REFERENCE RECREATION)
   ========================================================================== */

import React from 'react';
import Logo from './Logo';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageCircle,
  Bot,
  ArrowUp
} from 'lucide-react';

export default function Footer({ navigate, onOpenAI }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
    'Hello Perfect Homes & Developers, I am interested in exploring residential plots and villas in Chennai West.'
  )}`;

  return (
    <>
      <footer
        style={{
          backgroundColor: '#064E49',
          color: '#FFFFFF',
          borderTop: '3px solid #008F83',
          marginTop: 'auto',
          position: 'relative',
          padding: '3.5rem 0 1.5rem'
        }}
      >
        <div className="container">
          {/* Main Footer Columns Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr 1.1fr 1.8fr 1.6fr 0.9fr',
              gap: '1.5rem',
              alignItems: 'flex-start',
              paddingBottom: '2.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
            }}
            className="footer-columns-grid"
          >
            {/* Column 1: Brand Logo & Tagline */}
            <div>
              <Logo variant="white" size="md" onClick={() => navigate('home')} />
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.85rem',
                  marginTop: '0.85rem',
                  lineHeight: 1.5
                }}
              >
                Your Dream Home, Our Priority
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={footerColHeading}>Quick Links</h4>
              <ul style={footerListStyle}>
                <li><button onClick={() => navigate('home')} style={footerLinkBtn}>Home</button></li>
                <li><button onClick={() => navigate('listing')} style={footerLinkBtn}>Properties</button></li>
                <li><button onClick={() => navigate('locations')} style={footerLinkBtn}>Locations</button></li>
                <li><button onClick={() => navigate('about')} style={footerLinkBtn}>About Us</button></li>
                <li><button onClick={() => navigate('contact')} style={footerLinkBtn}>Contact</button></li>
              </ul>
            </div>

            {/* Column 3: Property Types */}
            <div>
              <h4 style={footerColHeading}>Property Types</h4>
              <ul style={footerListStyle}>
                <li>
                  <button onClick={() => navigate('listing', { category: 'Residential Plots' })} style={footerLinkBtn}>
                    <MapPin size={12} color="#31D6C5" /> Residential Plots
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('listing', { category: '2 BHK Homes' })} style={footerLinkBtn}>
                    <MapPin size={12} color="#31D6C5" /> Independent Houses
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('listing', { category: 'Villas' })} style={footerLinkBtn}>
                    <MapPin size={12} color="#31D6C5" /> Villas
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('listing', { category: 'Land + Construction' })} style={footerLinkBtn}>
                    <MapPin size={12} color="#31D6C5" /> Land + Construction
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Popular Locations (2 inner columns matching screenshot) */}
            <div>
              <h4 style={footerColHeading}>Popular Locations</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <ul style={footerListStyle}>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Avadi' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Avadi
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Thiruninravur' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Thiruninravur
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Veppampattu' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Veppampattu
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Redhills' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Redhills
                    </button>
                  </li>
                </ul>

                <ul style={footerListStyle}>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Tiruvallur' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Tiruvallur
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Nemilichery' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Nemilichery
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Siruseri / OMR' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Siruseri / OMR
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('listing', { location: 'Chennai' })} style={footerLinkBtn}>
                      <MapPin size={12} color="#31D6C5" /> Chennai
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 5: Contact Us */}
            <div>
              <h4 style={footerColHeading}>Contact Us</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneCall size={14} color="#31D6C5" style={{ flexShrink: 0 }} />
                  <a href={`tel:${COMPANY_CONTACT_INFO.phone}`} style={{ color: '#FFFFFF' }}>
                    {COMPANY_CONTACT_INFO.phoneDisplay}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={14} color="#25D366" style={{ flexShrink: 0 }} />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#FFFFFF' }}
                  >
                    WhatsApp: {COMPANY_CONTACT_INFO.whatsappDisplay}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="#31D6C5" style={{ flexShrink: 0 }} />
                  <a href={`mailto:${COMPANY_CONTACT_INFO.email}`} style={{ color: '#FFFFFF' }}>
                    {COMPANY_CONTACT_INFO.email}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
                  <MapPin size={14} color="#31D6C5" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <a
                    href={COMPANY_CONTACT_INFO.googleMapsUrl || "https://maps.app.goo.gl/Qit2fHzxKrSnyGvd8"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}
                    title="View office location on Google Maps"
                  >
                    {COMPANY_CONTACT_INFO.officeAddress}
                  </a>
                </div>
              </div>
            </div>

            {/* Column 6: Follow Us */}
            <div>
              <h4 style={footerColHeading}>Follow Us</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* FB */}
                <a
                  href={COMPANY_CONTACT_INFO.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#1877F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}
                  title="Facebook"
                >
                  f
                </a>

                {/* IG */}
                <a
                  href={COMPANY_CONTACT_INFO.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                  title="Instagram"
                >
                  <div style={{ width: '14px', height: '14px', border: '2px solid #FFFFFF', borderRadius: '4px' }} />
                </a>

                {/* YT */}
                <a
                  href={COMPANY_CONTACT_INFO.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '0.85rem'
                  }}
                  title="YouTube"
                >
                  ▶
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '1.5rem',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.75)'
            }}
          >
            <div>
              © 2025 <strong>Perfect Homes &amp; Developers</strong>. All Rights Reserved.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <button onClick={() => navigate('about')} style={{ color: 'rgba(255,255,255,0.75)' }}>Privacy Policy</button>
              <span>|</span>
              <button onClick={() => navigate('about')} style={{ color: 'rgba(255,255,255,0.75)' }}>Terms &amp; Conditions</button>
              <span>|</span>
              <button
                onClick={scrollToTop}
                style={{ color: '#31D6C5', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
              >
                <ArrowUp size={13} /> Back to Top
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button on Bottom Right */}
      <div
        className="floating-whatsapp-container"
        style={{
          position: 'fixed',
          bottom: 'max(20px, calc(20px + env(safe-area-inset-bottom, 0px)))',
          right: 'max(20px, calc(20px + env(safe-area-inset-right, 0px)))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px',
          zIndex: 9000,
          pointerEvents: 'none',
          maxWidth: 'calc(100vw - 32px)'
        }}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp-link"
          style={{
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '0.88rem',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
            textDecoration: 'none',
            transition: 'transform 0.2s',
            pointerEvents: 'auto',
            touchAction: 'manipulation'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={22} style={{ flexShrink: 0 }} />
          <span className="floating-whatsapp-text">Chat on WhatsApp</span>
        </a>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .footer-columns-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 650px) {
          .footer-columns-grid {
            grid-template-columns: 1fr !important;
          }
          .floating-whatsapp-container {
            bottom: max(16px, calc(16px + env(safe-area-inset-bottom, 0px))) !important;
            right: max(16px, calc(16px + env(safe-area-inset-right, 0px))) !important;
          }
          .floating-whatsapp-link {
            width: 48px !important;
            height: 48px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            justify-content: center !important;
            box-shadow: 0 4px 18px rgba(37, 211, 102, 0.5) !important;
          }
          .floating-whatsapp-text {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const footerColHeading = {
  color: '#FFFFFF',
  fontSize: '0.95rem',
  fontWeight: 700,
  marginBottom: '0.85rem'
};

const footerListStyle = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  padding: 0,
  margin: 0
};

const footerLinkBtn = {
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.82rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  textAlign: 'left',
  transition: 'color 0.15s'
};
