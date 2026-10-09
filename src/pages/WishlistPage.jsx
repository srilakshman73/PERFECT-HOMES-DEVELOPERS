/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - MY WISHLIST PAGE (SAVED PROPERTIES)
   ========================================================================== */

import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import {
  Heart,
  Scale,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Trash2,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';

export default function WishlistPage({
  navigate,
  onViewProperty,
  onOpenBrochure,
  onOpenCompare
}) {
  const { getWishlistProperties, wishlistCount, compareList } = useProperties();
  const { user } = useAuth();

  const savedProperties = getWishlistProperties();

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
              <span className="section-tag" style={{ margin: 0 }}>
                Saved Homes &amp; Plots
              </span>
              <span className="badge badge-primary">{wishlistCount} Properties</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-heading)' }}>
              My Wishlist {user ? `• ${user.firstName}` : ''}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              Track price drops, compare features, or contact our sales managers for site visits.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {compareList.length > 0 && (
              <button onClick={onOpenCompare} className="btn btn-secondary">
                <Scale size={16} /> Compare Selected ({compareList.length})
              </button>
            )}
            <button onClick={() => navigate('listing')} className="btn btn-primary">
              <span>Explore More Properties</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Wishlist Grid or Empty State */}
        {savedProperties.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '4.5rem 2rem',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '650px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--turquoise-light)',
                color: 'var(--primary-teal)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Heart size={34} />
            </div>
            <h2 style={{ color: 'var(--deep-teal)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              Your Wishlist is Currently Empty
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              You haven&apos;t saved any properties yet. Click the heart icon on any property card to save it here for easy comparison and instant brochures.
            </p>
            <button onClick={() => navigate('listing')} className="btn btn-primary btn-lg">
              <span>Browse Verified Properties</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {savedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={onViewProperty}
                onOpenBrochure={onOpenBrochure}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
