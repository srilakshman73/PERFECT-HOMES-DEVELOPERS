/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - OFFICIAL BRAND LOGO COMPONENT
   ========================================================================== */

import React, { useState } from 'react';

export default function Logo({ 
  variant = 'full', // 'full' | 'white' | 'mark' | '3d' | 'full-tagline'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  className = '', 
  onClick,
  showTagline = false
}) {
  const [imgError, setImgError] = useState(false);
  const isWhite = variant === 'white';
  const isMarkOnly = variant === 'mark';
  const is3D = variant === '3d';

  const sizeStyles = {
    sm: { height: 38, iconSize: 34, fontSize: '1.05rem', subSize: '0.62rem', gap: '0.6rem' },
    md: { height: 46, iconSize: 42, fontSize: '1.35rem', subSize: '0.72rem', gap: '0.75rem' },
    lg: { height: 58, iconSize: 52, fontSize: '1.65rem', subSize: '0.82rem', gap: '0.85rem' },
    xl: { height: 72, iconSize: 64, fontSize: '1.95rem', subSize: '0.92rem', gap: '1rem' }
  }[size] || { height: 46, iconSize: 42, fontSize: '1.35rem', subSize: '0.72rem', gap: '0.75rem' };

  if (is3D) {
    return (
      <div
        className={`logo-lockup logo-3d ${className}`}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: onClick ? 'pointer' : 'default',
          textDecoration: 'none',
          userSelect: 'none'
        }}
      >
        <img
          src="/logo-3d.jpg"
          alt="Perfect Homes & Developers Official Logo"
          style={{
            width: size === 'xl' ? '140px' : size === 'lg' ? '110px' : '80px',
            height: 'auto',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 143, 131, 0.25)',
            border: '1px solid rgba(49, 214, 197, 0.3)',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`logo-lockup ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none',
        userSelect: 'none'
      }}
    >
      {/* Official Brand Emblem Mark */}
      <div
        style={{
          width: sizeStyles.iconSize,
          height: sizeStyles.iconSize,
          borderRadius: '10px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #008F83 0%, #064E49 100%)',
          boxShadow: isWhite 
            ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
            : '0 4px 12px rgba(0, 143, 131, 0.2)',
          border: '1px solid rgba(49, 214, 197, 0.3)'
        }}
      >
        {!imgError ? (
          <img
            src="/logo-badge.png"
            alt="Perfect Homes Emblem"
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : (
          /* SVG Vector Fallback */
          <svg
            width={sizeStyles.iconSize}
            height={sizeStyles.iconSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" rx="20" fill="url(#logoTealGrad)" />
            <path
              d="M50 18 L82 46 L74 46 L74 78 L58 78 L58 56 L42 56 L42 78 L26 78 L26 46 L18 46 Z"
              fill="#FFFFFF"
            />
            <path d="M50 30 L66 44 L62 44 L62 70 L38 70 L38 44 L34 44 Z" fill="#008F83" />
            <rect x="46" y="50" width="8" height="20" rx="2" fill="#31D6C5" />
            <circle cx="50" cy="40" r="4.5" fill="#31D6C5" />
            <polygon
              points="50,12 53,17 58,17 54,20 55,25 50,22 45,25 46,20 42,17 47,17"
              fill="#E5A823"
            />
            <defs>
              <linearGradient id="logoTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#008F83" />
                <stop offset="100%" stopColor="#064E49" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Brand Typography Lockup */}
      {!isMarkOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <div
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: sizeStyles.fontSize,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: isWhite ? '#FFFFFF' : '#064E49'
            }}
          >
            PERFECT
          </div>
          
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: sizeStyles.subSize,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: isWhite ? '#31D6C5' : '#008F83',
              marginTop: '1px'
            }}
          >
            HOMES &amp; DEVELOPERS
          </div>

          {(showTagline || variant === 'full-tagline') && (
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 500,
                color: isWhite ? 'rgba(255, 255, 255, 0.8)' : '#687985',
                marginTop: '2px'
              }}
            >
              Your Dream Home, Our Priority
            </div>
          )}
        </div>
      )}
    </div>
  );
}
