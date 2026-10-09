/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - PROPERTY CARD (EXACT REFERENCE RECREATION)
   ========================================================================== */

import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  Heart,
  MapPin,
  BedDouble,
  Maximize2,
  FileText,
  MessageCircle,
  Eye,
  CheckCircle2,
  Scale,
  Trees
} from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';

export default function PropertyCard({
  property,
  onViewDetails,
  onOpenBrochure,
  layout = 'grid'
}) {
  const { toggleWishlist, isWishlisted, toggleCompare, isCompared } = useProperties();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const isLiked = isWishlisted(property.id);
  const isComp = isCompared(property.id);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'];

  const whatsappMessage = encodeURIComponent(
    `Hello Perfect Homes & Developers, I am interested in "${property.title}" in ${property.location} priced at ${property.priceDisplay}. Please share full price breakup and layout plan.`
  );

  const whatsappUrl = `https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div
      className={`card property-card ${layout === 'list' ? 'property-card-list' : ''}`}
      style={{
        display: 'flex',
        flexDirection: layout === 'list' ? 'row' : 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1.5px solid var(--border-color)',
        boxShadow: '0 4px 15px rgba(6, 78, 73, 0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
    >
      {/* Property Image Container */}
      <div
        style={{
          position: 'relative',
          width: layout === 'list' ? '360px' : '100%',
          height: layout === 'list' ? '100%' : '210px',
          minHeight: '200px',
          overflow: 'hidden',
          backgroundColor: '#EAF2F0',
          cursor: 'pointer',
          flexShrink: 0
        }}
        onClick={() => onViewDetails(property)}
      >
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          loading="lazy"
        />

        {/* Top-Left 'For Sale' Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2
          }}
        >
          <span
            style={{
              backgroundColor: '#008F83',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            For Sale
          </span>
        </div>

        {/* Top-Right Wishlist & Compare Icons */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px',
            zIndex: 2
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(property);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isComp ? '#E5A823' : 'rgba(255, 255, 255, 0.95)',
              color: isComp ? '#FFFFFF' : '#17313D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              border: 'none',
              cursor: 'pointer'
            }}
            title={isComp ? 'Remove from compare' : 'Add to compare'}
            aria-label="Compare"
          >
            <Scale size={14} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(property.id);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: isLiked ? '#EF4444' : '#17313D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              border: 'none',
              cursor: 'pointer'
            }}
            title={isLiked ? 'Remove from Wishlist' : 'Save to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart size={15} fill={isLiked ? '#EF4444' : 'none'} />
          </button>
        </div>
      </div>

      {/* Property Details Content */}
      <div
        style={{
          padding: '1.15rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          gap: '0.75rem'
        }}
      >
        <div>
          {/* Location Pin */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              color: '#687985',
              fontWeight: 600,
              marginBottom: '0.35rem'
            }}
          >
            <MapPin size={14} color="#008F83" />
            <span>{property.location}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(property)}
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#17313D',
              cursor: 'pointer',
              marginBottom: '0.45rem',
              lineHeight: 1.3
            }}
          >
            {property.title}
          </h3>

          {/* Price */}
          <div
            style={{
              fontSize: '1.28rem',
              fontWeight: 800,
              color: '#064E49',
              fontFamily: 'var(--font-display)',
              marginBottom: '0.65rem'
            }}
          >
            {property.priceDisplay}
          </div>

          {/* Specs Row (BHK / Area / Approval) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              fontSize: '0.78rem',
              color: '#687985',
              paddingTop: '0.45rem',
              borderTop: '1px solid var(--border-light)'
            }}
          >
            {property.bhk > 0 ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#17313D' }}>
                <BedDouble size={14} color="#008F83" /> {property.bhk} BHK
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#17313D' }}>
                <Trees size={14} color="#008F83" /> Plot
              </span>
            )}

            <span style={{ color: '#DCE9E6' }}>|</span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#17313D' }}>
              <Maximize2 size={13} color="#008F83" /> {property.plotAreaRange || (property.builtUpArea > 0 ? `${property.builtUpArea} Sq.ft` : `${property.plotArea} Sq.ft`)}
            </span>

            <span style={{ color: '#DCE9E6' }}>|</span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontWeight: 600 }}>
              <CheckCircle2 size={13} /> {property.approval}
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.2fr auto',
            gap: '0.45rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-light)',
            alignItems: 'center'
          }}
        >
          {/* View Details Button */}
          <button
            onClick={() => onViewDetails(property)}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid #008F83',
              backgroundColor: '#FFFFFF',
              color: '#008F83',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            View Details
          </button>

          {/* Get Brochure Button */}
          <button
            onClick={() => onOpenBrochure(property)}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#064E49',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.78rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Get Brochure
          </button>

          {/* WhatsApp Direct Icon */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
            title="Chat on WhatsApp"
            aria-label="WhatsApp"
          >
            <MessageCircle size={17} />
          </a>
        </div>
      </div>
    </div>
  );
}
