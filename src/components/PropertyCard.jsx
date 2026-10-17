/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - PROPERTY CARD (EXACT REFERENCE RECREATION)
   ========================================================================== */

import React, { useState, useEffect } from 'react';
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
  Trees,
  Clock,
  Play,
  Video,
  Home
} from 'lucide-react';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';

const FALLBACK_IMAGE = '/media/part8/images/whatsapp_image_2026-10-16_at_11_24_53_am_1__1.jpeg';

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
    : [FALLBACK_IMAGE];

  const [imgSrc, setImgSrc] = useState(images[currentImgIndex] || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(images[currentImgIndex] || FALLBACK_IMAGE);
  }, [images, currentImgIndex]);

  const whatsappMessage = encodeURIComponent(
    property.isUpcoming || property.slug === 'nathamedu-niranjan-nagar-upcoming-project'
      ? `Hello Perfect Homes & Developers, I am interested in the upcoming project "${property.title}" at Niranjan Nagar, Nathamedu (${property.priceDisplay}). Please share project layout, price breakup, and launch updates.`
      : `Hello Perfect Homes & Developers, I am interested in "${property.title}" in ${property.location} priced at ${property.priceDisplay}. Please share full price breakup and layout plan.`
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
          src={imgSrc}
          alt={property.title}
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) {
              setImgSrc(FALLBACK_IMAGE);
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease'
          }}
          loading="lazy"
        />

        {/* Top-Left Status Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 2,
            maxWidth: 'calc(100% - 85px)'
          }}
        >
          <span
            style={{
              backgroundColor: property.isUpcoming || property.category === 'Upcoming Projects' ? '#008F83' : '#008F83',
              background: property.isUpcoming || property.category === 'Upcoming Projects'
                ? 'linear-gradient(135deg, #064E49 0%, #008F83 100%)'
                : '#008F83',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              display: 'inline-block',
              lineHeight: 1.25
            }}
          >
            {property.statusBadge || 'For Sale'}
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

        {/* Bottom-Left Video Indicator Badge */}
        {property.videos && property.videos.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'rgba(6, 78, 73, 0.92)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}
          >
            <Play size={11} fill="#FFFFFF" />
            <span>{property.videos.length} Site Videos</span>
          </div>
        )}
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

          {/* Specs Row (BHK / Area / Approval or Upcoming status) */}
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
            {property.isUpcoming || property.category === 'Upcoming Projects' ? (
              <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#064E49' }}>
                  <Trees size={14} color="#008F83" /> {property.propertyType || 'Residential Property'}
                </span>
                <span style={{ color: '#DCE9E6' }}>|</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#008F83', fontWeight: 600 }}>
                  <Clock size={13} /> Planned Soon
                </span>
              </>
            ) : (
              <>
                {property.bhk > 0 ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#17313D' }}>
                    <BedDouble size={14} color="#008F83" /> {property.bhk} BHK
                  </span>
                ) : property.propertyType === 'Plot' || property.category === 'Residential Plots' ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#17313D' }}>
                    <Trees size={14} color="#008F83" /> Plot
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#17313D' }}>
                    <Home size={14} color="#008F83" /> {property.propertyType || 'House'}
                  </span>
                )}

                {(property.plotAreaRange || property.builtUpArea > 0 || property.plotArea > 0) ? (
                  <>
                    <span style={{ color: '#DCE9E6' }}>|</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#17313D' }}>
                      <Maximize2 size={13} color="#008F83" /> {property.plotAreaRange || (property.builtUpArea > 0 ? `${property.builtUpArea} Sq.ft` : `${property.plotArea} Sq.ft`)}
                    </span>
                  </>
                ) : property.availability ? (
                  <>
                    <span style={{ color: '#DCE9E6' }}>|</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#008F83' }}>
                      <CheckCircle2 size={13} /> {property.availability}
                    </span>
                  </>
                ) : null}

                {property.approval && (
                  <>
                    <span style={{ color: '#DCE9E6' }}>|</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontWeight: 600 }}>
                      <CheckCircle2 size={13} /> {property.approval}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Visible Watch Site Videos Button for Properties with Videos */}
        {property.videos && property.videos.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(property, { tab: 'videos' });
            }}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#064E49',
              backgroundImage: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              boxShadow: '0 2px 8px rgba(0, 143, 131, 0.28)',
              transition: 'all 0.2s ease',
              marginTop: '0.2rem'
            }}
            title={`Watch all ${property.videos.length} site walkthrough videos`}
          >
            <Play size={13} fill="#FFFFFF" />
            <span>Watch Site Videos ({property.videos.length})</span>
          </button>
        )}

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
