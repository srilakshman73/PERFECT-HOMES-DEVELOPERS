/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - OFFICIAL BRAND LOGO COMPONENT
   ========================================================================== */

import React from 'react';

export default function Logo({ variant = 'full', size = 'md', className = '', onClick }) {
  const isWhite = variant === 'white';
  const isMarkOnly = variant === 'mark';

  const sizeStyles = {
    sm: { height: 38, iconSize: 34, fontSize: '1.05rem', subSize: '0.62rem', gap: '0.6rem' },
    md: { height: 46, iconSize: 44, fontSize: '1.35rem', subSize: '0.72rem', gap: '0.75rem' },
    lg: { height: 58, iconSize: 52, fontSize: '1.65rem', subSize: '0.82rem', gap: '0.85rem' }
  }[size] || { height: 46, iconSize: 44, fontSize: '1.35rem', subSize: '0.72rem', gap: '0.75rem' };

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
      {/* Official Brand SVG Badge */}
      <svg
        width={sizeStyles.iconSize}
        height={sizeStyles.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="logoTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#008F83" />
            <stop offset="100%" stopColor="#064E49" />
          </linearGradient>
          <linearGradient id="logoTurquoiseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#31D6C5" />
            <stop offset="100%" stopColor="#008F83" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Shield / Diamond Badge */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          fill="url(#logoTealGrad)"
        />
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="20"
          stroke="rgba(49, 214, 197, 0.4)"
          strokeWidth="2.5"
        />

        {/* House / Building Silhouette */}
        <path
          d="M50 18 L82 46 L74 46 L74 78 L58 78 L58 56 L42 56 L42 78 L26 78 L26 46 L18 46 Z"
          fill="#FFFFFF"
        />

        {/* Center Emerald / Turquoise Core Doorway */}
        <path
          d="M50 30 L66 44 L62 44 L62 70 L38 70 L38 44 L34 44 Z"
          fill="url(#logoTealGrad)"
        />

        {/* Diamond Compass Keyhole in Center */}
        <rect x="46" y="50" width="8" height="20" rx="2" fill="url(#logoTurquoiseGrad)" />
        <circle cx="50" cy="40" r="4.5" fill="#31D6C5" />

        {/* Gold Star / Crown Accent at the Peak */}
        <polygon
          points="50,12 53,17 58,17 54,20 55,25 50,22 45,25 46,20 42,17 47,17"
          fill="#E5A823"
        />
      </svg>

      {/* Brand Typography */}
      {!isMarkOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.08 }}>
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

          {variant === 'full-tagline' && (
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
