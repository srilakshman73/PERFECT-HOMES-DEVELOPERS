/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - LOCATIONS EXPLORER PAGE
   ========================================================================== */

import React from 'react';
import { LOCATIONS_DATA } from '../data/locationsData';
import {
  MapPin,
  TrendingUp,
  ArrowRight,
  Train,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function LocationsPage({ navigate }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
          color: '#FFFFFF',
          padding: '4rem 0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
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
            <span>PRIME CORRIDORS OF CHENNAI WEST</span>
          </div>

          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
            Explore Prime Real Estate Locations
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Discover high-growth suburban hubs with suburban railway connectivity, proposed metro routes, top schools, and high capital appreciation.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <div className="container" style={{ marginTop: '3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {LOCATIONS_DATA.map((loc) => (
            <div
              key={loc.id}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1.5px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img
                    src={loc.image}
                    alt={loc.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(6, 78, 73, 0.85) 100%)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      color: '#FFFFFF'
                    }}
                  >
                    <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0 }}>{loc.name}</h3>
                    <span className="badge badge-teal">{loc.propertyCount} Properties</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--primary-teal)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <TrendingUp size={16} />
                    <span>Price Range: {loc.avgPriceSqft} / sq.ft</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {loc.description}
                  </p>

                  <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-teal)', marginBottom: '0.6rem' }}>Key Highlights</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {(loc.keyHighlights || []).map((h, i) => (
                      <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <CheckCircle2 size={14} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    style={{
                      backgroundColor: 'var(--turquoise-light)',
                      border: '1px solid rgba(0, 143, 131, 0.2)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--deep-teal)',
                      fontWeight: 600
                    }}
                  >
                    📈 {loc.growthPotential}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)' }}>
                <button
                  onClick={() => navigate('listing', { location: loc.name })}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <span>Explore Properties in {loc.name}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
