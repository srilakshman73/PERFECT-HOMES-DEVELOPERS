/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - ABOUT US PAGE
   ========================================================================== */

import React from 'react';
import Logo from '../components/Logo';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';
import {
  ShieldCheck,
  Award,
  Users,
  Building,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Heart,
  Target,
  Eye,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function AboutUsPage({ navigate, onOpenScheduleVisit }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
          color: '#FFFFFF',
          padding: '4rem 0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              color: '#31D6C5',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={14} />
            <span>15+ YEARS OF REAL ESTATE EXCELLENCE</span>
          </div>

          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
            About Perfect Homes &amp; Developers
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            {COMPANY_CONTACT_INFO.tagline} — Building legally verified residential communities, premium plots, and custom villas across Chennai West.
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center',
            border: '1.5px solid var(--border-color)'
          }}
        >
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'var(--font-display)' }}>
              15+
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Years of Excellence
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'var(--font-display)' }}>
              1,500+
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Happy Families Settled
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'var(--font-display)' }}>
              38+
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Completed Projects
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'var(--font-display)' }}>
              100%
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              CMDA / DTCP Clear Titles
            </div>
          </div>
        </div>
      </div>

      {/* Company Story & Mission */}
      <section className="container" style={{ marginTop: '4.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span className="section-tag">Our Heritage</span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--text-heading)', marginBottom: '1.25rem' }}>
              Pioneering Transparent Real Estate in Suburban Chennai
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Established in 2011, <strong>Perfect Homes &amp; Developers</strong> was founded with a singular purpose: to make premium residential plot ownership and bespoke home construction transparent, legally secure, and genuinely affordable for every aspiring family.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Operating across strategic growth corridors like Avadi, Thiruninravur, Veppampattu, Poonamallee, and Pattabiram, we have developed gated layouts with wide 40ft blacktop roads, potable groundwater, street illumination, and 100% undisputed parent documents.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('listing')} className="btn btn-primary">
                View Our Projects
              </button>
              <button onClick={() => onOpenScheduleVisit(null)} className="btn btn-secondary">
                Book Free Site Visit
              </button>
            </div>
          </div>

          {/* Visual card */}
          <div
            className="card"
            style={{
              padding: '2.5rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Mission */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--turquoise-light)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', marginBottom: '4px' }}>Our Mission</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    To provide 100% legally clear, government-approved residential properties that maximize long-term family security and financial appreciation.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--turquoise-light)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Eye size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', marginBottom: '4px' }}>Our Vision</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    To be recognized as Tamil Nadu’s gold standard in plotted developments, eco-friendly luxury villas, and customer-first building craftsmanship.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--turquoise-light)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', marginBottom: '4px' }}>Uncompromising Ethics</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    Zero hidden brokerage, direct builder-to-buyer transactions, and complete legal parent deed documentation prior to booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approvals Guarantee */}
      <section className="container" style={{ marginTop: '5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
            color: '#FFFFFF',
            padding: '3rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center'
          }}
        >
          <ShieldCheck size={44} color="#31D6C5" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#FFFFFF', fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Government Approvals &amp; Legal Assurance Guarantee
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.88)', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Every project promoted by Perfect Homes &amp; Developers is vetted by registered senior advocates. We provide complete parent documents for 40+ years, individual Patta, Encumbrance Certificates (EC), and RERA registration.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-white" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
              CMDA Approved
            </span>
            <span className="badge badge-white" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
              DTCP Approved
            </span>
            <span className="badge badge-white" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
              RERA Reg: TN/RERA/Agent/0842/2021
            </span>
            <span className="badge badge-white" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
              90% Bank Loan Approved
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
