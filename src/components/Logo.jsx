/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - OFFICIAL 3D BRAND LOGO COMPONENT
   ========================================================================== */

import React from 'react';

export default function Logo({ 
  variant = 'horizontal', // 'horizontal' | 'stacked' | 'symbol' | 'white' | 'original'
  size = 'md',            // 'sm' | 'md' | 'lg' | 'xl'
  className = '', 
  onClick,
  style = {}
}) {
  // Height map for responsive rendering
  const heightMap = {
    sm: { h: 36, maxW: 180 },
    md: { h: 48, maxW: 240 },
    lg: { h: 64, maxW: 300 },
    xl: { h: 90, maxW: 380 }
  };

  const { h, maxW } = heightMap[size] || heightMap.md;

  // Source selection based on variant
  let logoSrc = '/perfect-homes-logo-horizontal.png';
  let altText = 'Perfect Homes & Developers Logo';

  if (variant === 'symbol') {
    logoSrc = '/perfect-homes-symbol.png';
    altText = 'Perfect Homes Symbol';
  } else if (variant === 'stacked') {
    logoSrc = '/perfect-homes-logo.png';
    altText = 'Perfect Homes & Developers';
  } else if (variant === 'original') {
    logoSrc = '/perfect-homes-logo-original.jpg';
    altText = 'Perfect Homes Official Brand';
  }

  const isDarkBg = variant === 'white';

  return (
    <div
      className={`logo-lockup ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none',
        userSelect: 'none',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        ...style
      }}
    >
      <img
        src={logoSrc}
        alt={altText}
        style={{
          height: `${h}px`,
          width: variant === 'symbol' ? `${h}px` : 'auto',
          maxWidth: variant === 'symbol' ? `${h}px` : `${maxW}px`,
          objectFit: 'contain',
          display: 'block',
          // Optional slight brightness boost on dark backgrounds
          filter: isDarkBg ? 'drop-shadow(0 2px 8px rgba(49, 214, 197, 0.35))' : 'none'
        }}
      />
    </div>
  );
}
