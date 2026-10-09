/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - HOMEPAGE (EXACT REFERENCE RECREATION)
   ========================================================================== */

import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import EMICalculator from '../components/EMICalculator';
import {
  PROPERTY_CATEGORIES,
  TRUST_INDICATORS
} from '../data/propertiesData';
import { LOCATIONS_DATA, COMPANY_CONTACT_INFO } from '../data/locationsData';
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  BedDouble,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ChevronRight,
  Star,
  Building,
  Hammer,
  Landmark,
  Paintbrush,
  HelpCircle,
  Car,
  Trees,
  Castle,
  Headphones,
  SlidersHorizontal
} from 'lucide-react';

export default function HomePage({
  navigate,
  onViewProperty,
  onOpenBrochure,
  onOpenScheduleVisit
}) {
  const { properties, setFilters } = useProperties();

  // Search hero state
  const [heroLocation, setHeroLocation] = useState('all');
  const [heroType, setHeroType] = useState('all');
  const [heroBudget, setHeroBudget] = useState('all');
  const [heroBhk, setHeroBhk] = useState('all');

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    let minP = 0;
    let maxP = 15000000;

    if (heroBudget === 'under30') {
      maxP = 3000000;
    } else if (heroBudget === '30to60') {
      minP = 3000000;
      maxP = 6000000;
    } else if (heroBudget === '60to1cr') {
      minP = 6000000;
      maxP = 10000000;
    } else if (heroBudget === 'above1cr') {
      minP = 10000000;
      maxP = 50000000;
    }

    setFilters({
      keyword: '',
      location: heroLocation,
      category: heroType,
      bhk: heroBhk,
      minPrice: minP,
      maxPrice: maxP,
      facing: 'all',
      availability: 'all',
      approval: 'all',
      sortBy: 'featured'
    });

    navigate('listing');
  };

  const faqs = [
    {
      q: 'Are all residential plots approved by CMDA / DTCP and registered with RERA?',
      a: 'Yes, 100% of our layout developments and villas come with authentic CMDA or DTCP approved layout plans along with Tamil Nadu RERA registration. We provide clear 40-year parent legal documents verified by senior advocates.'
    },
    {
      q: 'Can I get a bank loan for purchasing plots or building independent villas?',
      a: 'Absolutely. We have pre-approved project tie-ups with SBI, HDFC Bank, ICICI Bank, Canara Bank, Axis Bank, and LIC Housing Finance providing up to 90% loan sanction with attractive interest rates starting from 8.35%.'
    },
    {
      q: 'Do you offer free site visits and transportation?',
      a: 'Yes! We arrange free doorstep AC cab pickup and drop across Chennai, Avadi, Thiruninravur, and surrounding areas 7 days a week. Our senior property advisor will accompany you to explain the layout and title records.'
    },
    {
      q: 'What is the "Land + Construction" package?',
      a: 'Our Land + Construction package allows you to pick your ideal plot and choose from customized 2 BHK or 3 BHK architectural floor plans. We handle soil testing, architectural 3D drawings, building approvals, and complete turnkey construction with a 10-year structural warranty.'
    },
    {
      q: 'How fast can the property registration be completed?',
      a: 'Since all our projects have ready individual patta and approved subdivision numbers, spot registration can be executed at the Sub-Registrar Office within 48 to 72 hours upon payment or bank loan disbursement.'
    }
  ];

  return (
    <div className="homepage-wrapper">
      {/* ==========================================================
          1. HERO SECTION (MATCHING REFERENCE SCREENSHOT)
          ========================================================== */}
      <section
        style={{
          position: 'relative',
          minHeight: '660px',
          background: 'linear-gradient(90deg, rgba(6, 78, 73, 0.95) 0%, rgba(6, 78, 73, 0.85) 38%, rgba(6, 78, 73, 0.35) 70%, rgba(6, 78, 73, 0.1) 100%), url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          color: '#FFFFFF',
          padding: '4.5rem 0 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            {/* Tagline */}
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#31D6C5',
                letterSpacing: '0.04em',
                marginBottom: '0.75rem',
                textTransform: 'capitalize'
              }}
            >
              Your Dream Home, Our Priority
            </div>

            {/* Main Headline */}
            <h1
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                marginBottom: '0.85rem',
                letterSpacing: '-0.02em'
              }}
            >
              Find Your Perfect<br />
              <span style={{ color: '#31D6C5' }}>Home &amp; Land</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                fontWeight: 600,
                marginBottom: '0.35rem',
                letterSpacing: '0.01em'
              }}
            >
              Residential Plots | Independent Houses | Villas | Land + Construction
            </p>

            {/* Description Slogan */}
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.82)',
                fontSize: '0.98rem',
                marginBottom: '2.5rem'
              }}
            >
              Your trusted real estate partner in Chennai and surrounding areas.
            </p>

            {/* Prominent White Search Panel */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: '0.85rem 1.25rem',
                boxShadow: '0 20px 50px rgba(6, 78, 73, 0.35)',
                color: 'var(--text-heading)'
              }}
            >
              <form
                onSubmit={handleHeroSearch}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.2fr 1.1fr 1fr auto',
                  gap: '0.85rem',
                  alignItems: 'center'
                }}
                className="hero-search-form"
              >
                {/* 1. Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.4rem 0.6rem', borderRight: '1px solid var(--border-light)' }} className="search-field-col">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--turquoise-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={16} color="var(--primary-teal)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Location</div>
                    <select
                      value={heroLocation}
                      onChange={(e) => setHeroLocation(e.target.value)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)', width: '100%', cursor: 'pointer' }}
                    >
                      <option value="all">Select Location</option>
                      {LOCATIONS_DATA.map((l) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Property Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.4rem 0.6rem', borderRight: '1px solid var(--border-light)' }} className="search-field-col">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--turquoise-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Home size={16} color="var(--primary-teal)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Property Type</div>
                    <select
                      value={heroType}
                      onChange={(e) => setHeroType(e.target.value)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)', width: '100%', cursor: 'pointer' }}
                    >
                      <option value="all">Any Type</option>
                      <option value="Residential Plots">Residential Plots</option>
                      <option value="2 BHK Homes">2 BHK Homes</option>
                      <option value="3 BHK Homes">3 BHK Homes</option>
                      <option value="Villas">Villas</option>
                      <option value="Land + Construction">Land + Construction</option>
                    </select>
                  </div>
                </div>

                {/* 3. Budget */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.4rem 0.6rem', borderRight: '1px solid var(--border-light)' }} className="search-field-col">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--turquoise-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IndianRupee size={16} color="var(--primary-teal)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Budget</div>
                    <select
                      value={heroBudget}
                      onChange={(e) => setHeroBudget(e.target.value)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)', width: '100%', cursor: 'pointer' }}
                    >
                      <option value="all">Any Budget</option>
                      <option value="under30">Under ₹30 Lakhs</option>
                      <option value="30to60">₹30L - ₹60 Lakhs</option>
                      <option value="60to1cr">₹60L - ₹1 Crore</option>
                      <option value="above1cr">Above ₹1 Crore</option>
                    </select>
                  </div>
                </div>

                {/* 4. BHK */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.4rem 0.6rem' }} className="search-field-col">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--turquoise-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BedDouble size={16} color="var(--primary-teal)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>BHK</div>
                    <select
                      value={heroBhk}
                      onChange={(e) => setHeroBhk(e.target.value)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)', width: '100%', cursor: 'pointer' }}
                    >
                      <option value="all">Any BHK</option>
                      <option value="0">Plots Only</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4+ BHK</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#008F83',
                    padding: '0.85rem 1.6rem',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(0, 143, 131, 0.4)'
                  }}
                >
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>

          {/* Golden Cursive Badge on Top Right: "Build Your Future Today" */}
          <div
            className="hide-mobile-tablet"
            style={{
              position: 'absolute',
              right: '20px',
              top: '80px',
              textAlign: 'center',
              transform: 'rotate(-4deg)'
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', cursive, sans-serif",
                fontSize: '2.3rem',
                fontWeight: 800,
                color: '#E5A823',
                textShadow: '0 3px 12px rgba(0,0,0,0.6)',
                lineHeight: 1.1
              }}
            >
              Build Your<br />
              Future Today
            </div>
            <div style={{ width: '80%', height: '3px', backgroundColor: '#E5A823', margin: '4px auto 0', borderRadius: '2px', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }} />
          </div>

          {/* ========================================================
              TRUST INDICATORS BAR (FLOATING OVER HERO)
              ======================================================== */}
          <div
            style={{
              marginTop: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            {TRUST_INDICATORS.map((trust, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid #31D6C5',
                    backgroundColor: 'rgba(6, 78, 73, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <CheckCircle2 size={18} color="#31D6C5" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#FFFFFF', lineHeight: 1.2 }}>
                    {trust.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
                    {trust.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          2. PROPERTY CATEGORIES (5 HORIZONTAL CARDS)
          ========================================================== */}
      <section style={{ padding: '2.5rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1.25rem'
            }}
            className="categories-grid-5"
          >
            {/* 1. Residential Plots */}
            <div
              className="card"
              onClick={() => navigate('listing', { category: 'Residential Plots' })}
              style={categoryCardStyle}
            >
              <div style={categoryIconStyle}>
                <Trees size={24} color="#008F83" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#064E49', margin: 0 }}>Residential Plots</h3>
                <p style={{ fontSize: '0.78rem', color: '#687985', margin: '2px 0 0' }}>Land for a better future</p>
              </div>
            </div>

            {/* 2. 2 BHK Homes */}
            <div
              className="card"
              onClick={() => navigate('listing', { category: '2 BHK Homes' })}
              style={categoryCardStyle}
            >
              <div style={categoryIconStyle}>
                <Home size={24} color="#008F83" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#064E49', margin: 0 }}>2 BHK Homes</h3>
                <p style={{ fontSize: '0.78rem', color: '#687985', margin: '2px 0 0' }}>Comfortable Living</p>
              </div>
            </div>

            {/* 3. 3 BHK Homes */}
            <div
              className="card"
              onClick={() => navigate('listing', { category: '3 BHK Homes' })}
              style={categoryCardStyle}
            >
              <div style={categoryIconStyle}>
                <Building size={24} color="#008F83" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#064E49', margin: 0 }}>3 BHK Homes</h3>
                <p style={{ fontSize: '0.78rem', color: '#687985', margin: '2px 0 0' }}>More Space, More Joy</p>
              </div>
            </div>

            {/* 4. Villas */}
            <div
              className="card"
              onClick={() => navigate('listing', { category: 'Villas' })}
              style={categoryCardStyle}
            >
              <div style={categoryIconStyle}>
                <Castle size={24} color="#008F83" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#064E49', margin: 0 }}>Villas</h3>
                <p style={{ fontSize: '0.78rem', color: '#687985', margin: '2px 0 0' }}>Luxury Living</p>
              </div>
            </div>

            {/* 5. Land + Construction */}
            <div
              className="card"
              onClick={() => navigate('listing', { category: 'Land + Construction' })}
              style={categoryCardStyle}
            >
              <div style={categoryIconStyle}>
                <Hammer size={24} color="#008F83" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#064E49', margin: 0 }}>Land + Construction</h3>
                <p style={{ fontSize: '0.78rem', color: '#687985', margin: '2px 0 0' }}>Your Land, Our Expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          3. FEATURED PROPERTIES (4 IN A ROW MATCHING SCREENSHOT)
          ========================================================== */}
      <section style={{ padding: '4rem 0 5rem', backgroundColor: '#F5FAF9' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '2.2rem', color: '#17313D', fontWeight: 800, margin: 0 }}>
                Featured Properties
              </h2>
              <p style={{ color: '#687985', fontSize: '0.96rem', marginTop: '4px' }}>
                Discover the best properties in prime locations
              </p>
            </div>

            <button
              onClick={() => navigate('listing')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.55rem 1.35rem',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid #008F83',
                color: '#008F83',
                backgroundColor: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#008F83';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#008F83';
              }}
            >
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* 4 Cards in Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem'
            }}
            className="featured-properties-grid-4"
          >
            {properties.slice(0, 4).map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onViewDetails={onViewProperty}
                onOpenBrochure={onOpenBrochure}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          4. POPULAR LOCATIONS
          ========================================================== */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Prime Locations</span>
            <h2 className="section-title">Strategic Investment Hubs in Chennai West</h2>
            <p className="section-desc">
              Fast railway connectivity, upcoming metro stations, reputed schools, and high capital growth.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {LOCATIONS_DATA.slice(0, 4).map((loc) => (
              <div
                key={loc.id}
                className="card"
                onClick={() => navigate('listing', { location: loc.name })}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-xl)',
                  height: '260px'
                }}
              >
                <img src={loc.image} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(6,78,73,0.1) 0%, rgba(6,78,73,0.92) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.5rem',
                    color: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', margin: 0 }}>{loc.name}</h3>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{loc.propertyCount} Properties</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#31D6C5', fontWeight: 600 }}>Avg: {loc.avgPriceSqft} / sq.ft</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          5. HOME LOAN ASSISTANCE & EMI CALCULATOR
          ========================================================== */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#F5FAF9' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Finance &amp; Banking</span>
            <h2 className="section-title">Home Loan Assistance &amp; EMI Calculator</h2>
            <p className="section-desc">
              Pre-approved tie-ups with SBI, HDFC, ICICI, and Canara Bank at prime interest rates up to 90%.
            </p>
          </div>

          <EMICalculator defaultAmount={4200000} />
        </div>
      </section>

      {/* ==========================================================
          6. FREQUENTLY ASKED QUESTIONS (FAQ)
          ========================================================== */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-header">
            <span className="section-tag">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">Clear answers to your property and legal questions.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  border: '1.5px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#064E49', fontWeight: 700 }}>
                    {faq.q}
                  </h4>
                  <span style={{ fontSize: '1.3rem', color: '#008F83', fontWeight: 700 }}>
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </div>
                {openFaqIndex === idx && (
                  <p style={{ marginTop: '0.85rem', fontSize: '0.92rem', color: '#687985', lineHeight: 1.6, borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          7. SITE VISIT BANNER CTA
          ========================================================== */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
          color: '#FFFFFF',
          padding: '4rem 0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '750px' }}>
          <Car size={36} color="#31D6C5" style={{ marginBottom: '0.75rem' }} />
          <h2 style={{ color: '#FFFFFF', fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Book a Free Doorstep Site Visit with AC Cab Pickup
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', marginBottom: '2rem' }}>
            Inspect the layout, check groundwater, and review CMDA/DTCP legal records 7 days a week.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenScheduleVisit(null)}
              className="btn btn-turquoise btn-lg"
            >
              <span>Schedule Free Site Visit</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={COMPANY_CONTACT_INFO.telLink || `tel:${COMPANY_CONTACT_INFO.phone}`}
              className="btn btn-outline-white btn-lg"
              title="Call Perfect Homes & Developers"
            >
              <PhoneCall size={18} />
              <span>Call 78455 85919</span>
            </a>
          </div>
        </div>
      </section>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 1200px) {
          .featured-properties-grid-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .categories-grid-5 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 850px) {
          .hero-search-form {
            grid-template-columns: 1fr !important;
          }
          .search-field-col {
            border-right: none !important;
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 0.5rem;
          }
          .categories-grid-5 {
            grid-template-columns: 1fr !important;
          }
          .featured-properties-grid-4 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const categoryCardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 'var(--radius-lg)',
  padding: '1.25rem 1.1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  border: '1.5px solid var(--border-color)',
  transition: 'all 0.2s',
  boxShadow: '0 2px 8px rgba(6, 78, 73, 0.04)'
};

const categoryIconStyle = {
  width: '46px',
  height: '46px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--turquoise-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};
