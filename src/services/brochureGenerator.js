/* ==========================================================================
   PERFECT HOMES & DEVELOPERS — DYNAMIC AI PROPERTY BROCHURE GENERATION ENGINE
   Professional 8-Page Verified A4 PDF Engine with Native Vector Icon Graphics,
   Strict Standard-Compliant Typography, and Exact Visual Reference Alignment.
   ========================================================================== */

import { jsPDF } from 'jspdf';
import { COMPANY_CONTACT_INFO } from '../data/locationsData.js';
import { PROPERTIES_DATA } from '../data/propertiesData.js';

// Verified Brand Color Palette matching Perfect Homes & Developers Identity
export const COLORS = {
  primaryTeal: [0, 143, 131],       // #008F83
  deepTeal: [6, 78, 73],           // #064E49
  darkSlate: [23, 49, 61],         // #17313D
  lightMint: [230, 247, 245],      // #E6F7F5
  mintSoft: [245, 250, 249],       // #F5FAF9
  mintAccent: [49, 214, 197],      // #31D6C5
  gold: [229, 168, 35],            // #E5A823
  goldLight: [254, 243, 199],      // #FEF3C7
  white: [255, 255, 255],
  darkGray: [31, 41, 55],          // #1F2937
  midGray: [75, 85, 99],           // #4B5563
  lightGray: [229, 231, 235],      // #E5E7EB
  cardBg: [248, 250, 252],         // #F8FAFC
  whatsappGreen: [37, 211, 102],   // #25D366
  mapsBlue: [66, 133, 244]         // #4285F4
};

// ============================================================================
// 1. NATIVE PDF VECTOR ICON DRAWING PRIMITIVES
// Zero external font or Unicode emoji dependencies. Guaranteed sharp at all DPIs.
// ============================================================================

/**
 * 5-Pointed Star Vector
 */
export function drawStarVector(doc, cx, cy, rOuter = 3.5, rInner = 1.6, fillColor = COLORS.gold) {
  doc.saveGraphicsState();
  doc.setFillColor(...fillColor);
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? rOuter : rInner;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  const lines = [];
  for (let i = 1; i < points.length; i++) {
    lines.push([points[i].x - points[i - 1].x, points[i].y - points[i - 1].y]);
  }
  lines.push([points[0].x - points[points.length - 1].x, points[0].y - points[points.length - 1].y]);
  doc.lines(lines, points[0].x, points[0].y, [1, 1], 'F', true);
  doc.restoreGraphicsState();
}

/**
 * Checkmark Vector
 */
export function drawCheckmarkVector(doc, cx, cy, size = 3, strokeColor = COLORS.mintAccent) {
  doc.saveGraphicsState();
  doc.setDrawColor(...strokeColor);
  doc.setLineWidth(size * 0.28);
  doc.setLineCap('round');
  doc.setLineJoin('round');
  doc.line(cx - size * 0.5, cy, cx - size * 0.1, cy + size * 0.4);
  doc.line(cx - size * 0.1, cy + size * 0.4, cx + size * 0.6, cy - size * 0.5);
  doc.restoreGraphicsState();
}

/**
 * Phone Receiver Vector
 */
export function drawPhoneVector(doc, cx, cy, size = 3.2, color = COLORS.white, bgColor = null) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  doc.setDrawColor(...color);
  doc.setFillColor(...color);
  doc.setLineWidth(size * 0.22);
  doc.setLineCap('round');
  doc.setLineJoin('round');

  const r = size * 0.65;
  // Handset arc
  doc.line(cx - r * 0.4, cy + r * 0.4, cx - r * 0.6, cy + r * 0.1);
  doc.line(cx - r * 0.6, cy + r * 0.1, cx - r * 0.2, cy - r * 0.4);
  doc.line(cx - r * 0.2, cy - r * 0.4, cx + r * 0.1, cy - r * 0.5);
  // Earpiece and mouthpiece
  doc.circle(cx - r * 0.5, cy + r * 0.35, size * 0.22, 'F');
  doc.circle(cx + r * 0.2, cy - r * 0.45, size * 0.22, 'F');
  doc.restoreGraphicsState();
}

/**
 * WhatsApp Speech Bubble & Handset Vector
 */
export function drawWhatsAppVector(doc, cx, cy, size = 3.5, color = COLORS.white, bgColor = COLORS.whatsappGreen) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  // Outer speech bubble
  doc.setFillColor(...color);
  const r = size * 0.85;
  doc.circle(cx, cy - 0.2, r, 'F');
  // Speech bubble pointer tail
  doc.triangle(
    cx - r * 0.85, cy + r * 0.3,
    cx - r * 0.2, cy + r * 0.8,
    cx - r * 1.05, cy + r * 1.0,
    'F'
  );

  // Phone silhouette inside
  const phoneColor = bgColor || COLORS.deepTeal;
  drawPhoneVector(doc, cx, cy - 0.2, size * 0.55, phoneColor);
  doc.restoreGraphicsState();
}

/**
 * Email Envelope Vector
 */
export function drawEmailVector(doc, cx, cy, size = 3.2, color = COLORS.white, bgColor = null) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  doc.setDrawColor(...color);
  doc.setLineWidth(0.45);
  const w = size * 1.5;
  const h = size * 1.0;
  doc.roundedRect(cx - w / 2, cy - h / 2, w, h, 0.4, 0.4, 'S');
  doc.line(cx - w / 2, cy - h / 2, cx, cy + h * 0.15);
  doc.line(cx, cy + h * 0.15, cx + w / 2, cy - h / 2);
  doc.restoreGraphicsState();
}

/**
 * Location Pin Vector
 */
export function drawLocationPinVector(doc, cx, cy, size = 3.5, color = COLORS.white, bgColor = null, innerDotColor = null) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  doc.setFillColor(...color);
  doc.circle(cx, cy - size * 0.25, size * 0.45, 'F');
  doc.triangle(
    cx - size * 0.42, cy - size * 0.1,
    cx + size * 0.42, cy - size * 0.1,
    cx, cy + size * 0.6,
    'F'
  );

  // Center hole
  doc.setFillColor(...(innerDotColor || bgColor || COLORS.white));
  doc.circle(cx, cy - size * 0.25, size * 0.18, 'F');
  doc.restoreGraphicsState();
}

/**
 * Globe / Website Vector
 */
export function drawGlobeVector(doc, cx, cy, size = 3.2, color = COLORS.white, bgColor = null) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  doc.setDrawColor(...color);
  doc.setLineWidth(0.38);
  const r = size * 0.75;
  doc.circle(cx, cy, r, 'S');
  doc.line(cx - r, cy, cx + r, cy);
  doc.line(cx, cy - r, cx, cy + r);
  doc.ellipse(cx, cy, r * 0.48, r, 'S');
  doc.restoreGraphicsState();
}

/**
 * House Icon Badge Vector (for Quality Homes badge)
 */
export function drawHouseBadgeVector(doc, cx, cy, size = 3.5, color = COLORS.white, bgColor = COLORS.deepTeal) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  doc.setFillColor(...color);
  // Roof
  doc.triangle(
    cx, cy - size * 0.7,
    cx - size * 0.7, cy - size * 0.05,
    cx + size * 0.7, cy - size * 0.05,
    'F'
  );
  // Body
  doc.rect(cx - size * 0.5, cy - size * 0.05, size, size * 0.65, 'F');
  // Doorway cutout
  doc.setFillColor(...(bgColor || COLORS.deepTeal));
  doc.rect(cx - size * 0.18, cy + size * 0.2, size * 0.36, size * 0.4, 'F');
  doc.restoreGraphicsState();
}

/**
 * Community / People Badge Vector (for Better Communities badge)
 */
export function drawPeopleBadgeVector(doc, cx, cy, size = 3.5, color = COLORS.white, bgColor = COLORS.deepTeal) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  doc.setFillColor(...color);
  // Center person head & shoulders
  doc.circle(cx, cy - size * 0.35, size * 0.28, 'F');
  doc.roundedRect(cx - size * 0.45, cy + size * 0.02, size * 0.9, size * 0.5, 0.4, 0.4, 'F');

  // Left teammate
  doc.circle(cx - size * 0.65, cy - size * 0.15, size * 0.2, 'F');
  doc.roundedRect(cx - size * 0.95, cy + size * 0.12, size * 0.5, size * 0.4, 0.3, 0.3, 'F');

  // Right teammate
  doc.circle(cx + size * 0.65, cy - size * 0.15, size * 0.2, 'F');
  doc.roundedRect(cx + size * 0.45, cy + size * 0.12, size * 0.5, size * 0.4, 0.3, 0.3, 'F');
  doc.restoreGraphicsState();
}

/**
 * Growth Chart Badge Vector (for Brighter Futures badge)
 */
export function drawChartBadgeVector(doc, cx, cy, size = 3.5, color = COLORS.white, bgColor = COLORS.deepTeal) {
  doc.saveGraphicsState();
  if (bgColor) {
    doc.setFillColor(...bgColor);
    doc.circle(cx, cy, size * 1.5, 'F');
  }

  doc.setFillColor(...color);
  // 3 Ascending Bars
  doc.rect(cx - size * 0.6, cy + size * 0.1, size * 0.3, size * 0.45, 'F');
  doc.rect(cx - size * 0.15, cy - size * 0.18, size * 0.3, size * 0.73, 'F');
  doc.rect(cx + size * 0.3, cy - size * 0.5, size * 0.3, size * 1.05, 'F');

  // Trendline arrow
  doc.setDrawColor(...color);
  doc.setLineWidth(0.35);
  doc.line(cx - size * 0.6, cy - size * 0.1, cx + size * 0.6, cy - size * 0.65);
  doc.restoreGraphicsState();
}

/**
 * Vector Map Thumbnail with location roads & red pin
 */
export function drawMapVectorThumbnail(doc, x, y, w, h) {
  doc.saveGraphicsState();
  doc.setFillColor(238, 245, 243);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setDrawColor(...COLORS.lightMint);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, w, h, 2, 2, 'S');

  // White roads
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2.5);
  doc.line(x + 2, y + h * 0.55, x + w - 2, y + h * 0.55);
  doc.line(x + w * 0.45, y + 2, x + w * 0.45, y + h - 2);

  // Red Pin
  drawLocationPinVector(doc, x + w * 0.45, y + h * 0.45, 3.8, [234, 67, 53], null, [255, 255, 255]);
  doc.restoreGraphicsState();
}

// ============================================================================
// 2. BRAND LOGO & SYSTEM HELPERS
// ============================================================================

/**
 * Draw the official Perfect Homes & Developers vector logo mark
 */
export function drawBrandLogo(doc, x, y, scale = 1, isWhite = false) {
  doc.saveGraphicsState();

  const primaryCol = isWhite ? COLORS.white : COLORS.deepTeal;
  const goldCol = isWhite ? COLORS.mintAccent : COLORS.gold;

  // Roof Gable
  doc.setFillColor(...primaryCol);
  doc.triangle(
    x + 10 * scale, y,
    x, y + 8 * scale,
    x + 20 * scale, y + 8 * scale,
    'F'
  );

  // Chimney
  doc.setFillColor(...goldCol);
  doc.rect(x + 14 * scale, y + 2 * scale, 2.5 * scale, 4 * scale, 'F');

  // House Base Body
  doc.setFillColor(...primaryCol);
  doc.roundedRect(x + 2 * scale, y + 7.5 * scale, 16 * scale, 12 * scale, 1 * scale, 1 * scale, 'F');

  // Window Squares
  doc.setFillColor(...goldCol);
  doc.rect(x + 4.5 * scale, y + 10 * scale, 3.2 * scale, 3.2 * scale, 'F');
  doc.rect(x + 8.2 * scale, y + 10 * scale, 3.2 * scale, 3.2 * scale, 'F');

  // Doorway
  doc.setFillColor(...(isWhite ? COLORS.deepTeal : COLORS.white));
  doc.roundedRect(x + 12.5 * scale, y + 12 * scale, 3.8 * scale, 7.5 * scale, 0.5 * scale, 0.5 * scale, 'F');

  // Base wave swoosh in gold
  doc.setFillColor(...goldCol);
  doc.ellipse(x + 10 * scale, y + 20.5 * scale, 9 * scale, 1.2 * scale, 'F');

  doc.restoreGraphicsState();
}

/**
 * Format property filename according to specification:
 * e.g. Model-Villa-Aster-Property-Brochure.pdf
 */
export function getBrochureFilename(property) {
  if (!property) return 'Property-Brochure.pdf';
  const raw = property.title || 'Property';
  const primaryName = raw.split('—')[0].replace(/[-–]/g, ' ').trim();
  const words = primaryName.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
  const titleCased = words
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('-');
  return `${titleCased || 'Property'}-Property-Brochure.pdf`;
}

/**
 * Helper: Asynchronously load an image URL into a base64 Data URL via HTML Canvas
 */
export async function loadImageAsBase64(url) {
  if (!url || typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    const timer = setTimeout(() => {
      resolve(null);
    }, 4000);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let w = img.naturalWidth || img.width || 800;
        let h = img.naturalHeight || img.height || 600;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({ dataUrl, width: w, height: h });
      } catch (err) {
        console.warn('Canvas conversion fallback for:', url, err);
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * Retrieve verified property information by ID or object
 */
export async function getPropertyForBrochure(propertyOrId) {
  if (typeof propertyOrId === 'object' && propertyOrId !== null && propertyOrId.id) {
    return propertyOrId;
  }

  const propertyId = typeof propertyOrId === 'string' ? propertyOrId.trim() : String(propertyOrId);

  // 1. Try fetching from backend API endpoint
  if (typeof window !== 'undefined' && window.fetch) {
    try {
      const res = await fetch(`/api/property?id=${encodeURIComponent(propertyId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.property) {
          return data.property;
        }
      }
    } catch (err) {
      console.warn('Backend API lookup fallback:', err.message);
    }
  }

  // 2. Try localStorage stored properties
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem('ph_properties_db_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = parsed.find((p) => p.id === propertyId || p.slug === propertyId);
        if (found) return found;
      }
    } catch {}
  }

  // 3. Fallback to verified catalog PROPERTIES_DATA
  const catalogFound = PROPERTIES_DATA.find((p) => p.id === propertyId || p.slug === propertyId);
  if (catalogFound) return catalogFound;

  throw new Error(`Property with ID "${propertyId}" was not found in verified database.`);
}

/**
 * Standard Page Footer
 */
export function drawPageFooter(doc, pageNum, pageTitle) {
  doc.saveGraphicsState();
  const y = 288;
  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.3);
  doc.line(18, y, 192, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGray);
  doc.text('Perfect Homes & Developers - Official Property Brochure', 18, y + 4.5);
  doc.text(`Page ${pageNum} - ${pageTitle}`, 192, y + 4.5, { align: 'right' });
  doc.restoreGraphicsState();
}

/**
 * Decorative Arched Top Page Header Canopy for interior pages (Pages 2 - 6)
 */
export function drawPageHeaderRibbon(doc, title, subtitle) {
  doc.saveGraphicsState();

  doc.setFillColor(...COLORS.deepTeal);
  doc.rect(0, 0, 210, 20, 'F');

  // Corner decorative arches
  doc.setFillColor(...COLORS.primaryTeal);
  doc.circle(210, 0, 36, 'F');
  doc.circle(0, 0, 22, 'F');

  doc.setFillColor(...COLORS.mintAccent);
  doc.circle(105, -38, 52, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(...COLORS.white);
  doc.text(title, 105, 11, { align: 'center' });

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.lightMint);
    doc.text(subtitle, 105, 16.5, { align: 'center' });
  }

  doc.restoreGraphicsState();
}

// ============================================================================
// 3. STANDALONE COMPANY CONTACT PAGE RENDERER
// Precisely matches the uploaded reference image:
// - White background with fluid teal & gold wave corner flourishes
// - Top-left logo with tagline & Top-right 3 brand badges
// - Left column 5 rounded pill rows with native vector icons
// - Right column framed property photo
// - 3 large action buttons (Call Now, Chat on WhatsApp, Send Email)
// - Bottom office card with map vector thumbnail & View on Google Maps button
// ============================================================================

export function renderCompanyContactSheet(doc, property = null, heroPhoto = null) {
  doc.saveGraphicsState();

  // 1. Fluid decorative corner waves
  doc.setFillColor(...COLORS.deepTeal);
  doc.circle(0, 0, 32, 'F');
  doc.setFillColor(...COLORS.primaryTeal);
  doc.circle(210, 0, 42, 'F');
  doc.setFillColor(...COLORS.gold);
  doc.circle(210, 297, 45, 'F');
  doc.setFillColor(...COLORS.deepTeal);
  doc.circle(0, 297, 36, 'F');

  // 2. Main Outer Card Frame
  const cardX = 14;
  const cardY = 12;
  const cardW = 182;
  const cardH = 268;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(cardX, cardY, cardW, cardH, 5, 5, 'F');
  doc.setDrawColor(...COLORS.primaryTeal);
  doc.setLineWidth(0.7);
  doc.roundedRect(cardX, cardY, cardW, cardH, 5, 5, 'S');

  // 3. Header: Left Logo & Right 3 Badges
  // Logo
  drawBrandLogo(doc, cardX + 6, cardY + 7, 1.25, false);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.deepTeal);
  doc.text('PERFECT HOMES', cardX + 35, cardY + 14.5);
  doc.setFontSize(12.5);
  doc.text('& DEVELOPERS', cardX + 35, cardY + 21);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.gold);
  doc.text('Your Dream - Our Commitment', cardX + 35, cardY + 27);

  // Right 3 Badges
  const badgeBaseX = cardX + 112;
  const badgeY = cardY + 10;

  // Badge 1: Quality Homes
  drawHouseBadgeVector(doc, badgeBaseX + 8, badgeY + 6, 3.2, COLORS.white, COLORS.deepTeal);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...COLORS.darkSlate);
  doc.text('Quality Homes', badgeBaseX + 8, badgeY + 14.5, { align: 'center' });

  // Badge 2: Better Communities
  drawPeopleBadgeVector(doc, badgeBaseX + 32, badgeY + 6, 3.2, COLORS.white, COLORS.deepTeal);
  doc.text('Better Communities', badgeBaseX + 32, badgeY + 14.5, { align: 'center' });

  // Badge 3: Brighter Futures
  drawChartBadgeVector(doc, badgeBaseX + 56, badgeY + 6, 3.2, COLORS.white, COLORS.deepTeal);
  doc.text('Brighter Futures', badgeBaseX + 56, badgeY + 14.5, { align: 'center' });

  // Divider
  doc.setDrawColor(...COLORS.lightMint);
  doc.setLineWidth(0.4);
  doc.line(cardX + 6, cardY + 31, cardX + cardW - 6, cardY + 31);

  // 4. Two-Column Body: Left 5 Pill Rows & Right Framed Photo
  const colLeftX = cardX + 6;
  const colLeftW = 86;
  const colRightX = cardX + 96;
  const colRightW = cardW - 102;
  const bodyStartY = cardY + 36;

  // Contact rows definitions matching reference image
  const contactPills = [
    {
      label: 'Direct Phone / Enquiry:',
      value: '+91 73050 23919',
      height: 18,
      drawIcon: (cx, cy) => drawPhoneVector(doc, cx, cy, 3.2, COLORS.white, COLORS.deepTeal)
    },
    {
      label: 'WhatsApp Concierge:',
      value: '+91 73050 23919',
      height: 18,
      drawIcon: (cx, cy) => drawWhatsAppVector(doc, cx, cy, 3.4, COLORS.white, COLORS.whatsappGreen)
    },
    {
      label: 'Official Email:',
      value: 'perfecthomesd@gmail.com',
      height: 18,
      drawIcon: (cx, cy) => drawEmailVector(doc, cx, cy, 3.2, COLORS.white, COLORS.primaryTeal)
    },
    {
      label: 'Registered Office Address:',
      value: 'No. 3, Krishna Nagar, CTH Road,\nThiruninravur - 602024, Tamil Nadu, India.',
      height: 25,
      drawIcon: (cx, cy) => drawLocationPinVector(doc, cx, cy, 3.4, COLORS.white, COLORS.primaryTeal, COLORS.deepTeal)
    },
    {
      label: 'Official Website:',
      value: 'www.perfecthomesdevelopers.in',
      height: 18,
      drawIcon: (cx, cy) => drawGlobeVector(doc, cx, cy, 3.2, COLORS.white, COLORS.deepTeal)
    }
  ];

  let curPillY = bodyStartY;
  contactPills.forEach((p) => {
    // Pill background
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(colLeftX, curPillY, colLeftW, p.height, 3, 3, 'F');
    doc.setDrawColor(...COLORS.lightMint);
    doc.setLineWidth(0.35);
    doc.roundedRect(colLeftX, curPillY, colLeftW, p.height, 3, 3, 'S');

    // Icon
    p.drawIcon(colLeftX + 8, curPillY + p.height / 2);

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(...COLORS.deepTeal);
    doc.text(p.label, colLeftX + 17, curPillY + 5.8);

    // Value
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(...COLORS.darkSlate);
    const splitVal = doc.splitTextToSize(p.value, colLeftW - 20);
    doc.text(splitVal, colLeftX + 17, curPillY + 11.2);

    curPillY += p.height + 3.2;
  });

  // Right Column: Framed Villa / Property Photo
  const photoH = curPillY - bodyStartY - 3.2; // Match total height of pills exactly
  if (heroPhoto) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(colRightX - 0.5, bodyStartY - 0.5, colRightW + 1, photoH + 1, 3.5, 3.5, 'F');
    doc.addImage(heroPhoto.dataUrl, 'JPEG', colRightX, bodyStartY, colRightW, photoH);
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.setLineWidth(0.6);
    doc.roundedRect(colRightX, bodyStartY, colRightW, photoH, 3, 3, 'S');
  } else {
    // Graphic fallback villa card
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(colRightX, bodyStartY, colRightW, photoH, 3, 3, 'F');
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.roundedRect(colRightX, bodyStartY, colRightW, photoH, 3, 3, 'S');
    drawBrandLogo(doc, colRightX + colRightW / 2 - 10, bodyStartY + photoH / 2 - 18, 1.8, false);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.deepTeal);
    doc.text('Model Architecture', colRightX + colRightW / 2, bodyStartY + photoH / 2 + 16, { align: 'center' });
  }

  // 5. Middle Row: 3 Wide Action Buttons matching reference image
  const actBtnY = curPillY + 3;
  const actBtnW = (cardW - 16) / 3;
  const actBtnH = 20;

  // Button 1: Call Now
  const b1X = cardX + 6;
  doc.setFillColor(...COLORS.deepTeal);
  doc.roundedRect(b1X, actBtnY, actBtnW, actBtnH, 3.5, 3.5, 'F');
  drawPhoneVector(doc, b1X + 10, actBtnY + 10, 3.5, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.white);
  doc.text('Call Now', b1X + actBtnW / 2 + 4, actBtnY + 8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(...COLORS.lightMint);
  doc.text('+91 73050 23919', b1X + actBtnW / 2 + 4, actBtnY + 15, { align: 'center' });
  doc.link(b1X, actBtnY, actBtnW, actBtnH, { url: 'tel:+917305023919' });

  // Button 2: Chat on WhatsApp
  const b2X = b1X + actBtnW + 2;
  doc.setFillColor(...COLORS.whatsappGreen);
  doc.roundedRect(b2X, actBtnY, actBtnW, actBtnH, 3.5, 3.5, 'F');
  drawWhatsAppVector(doc, b2X + 10, actBtnY + 10, 3.5, COLORS.white, COLORS.whatsappGreen);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.white);
  doc.text('Chat on WhatsApp', b2X + actBtnW / 2 + 4, actBtnY + 8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(...COLORS.white);
  doc.text('+91 73050 23919', b2X + actBtnW / 2 + 4, actBtnY + 15, { align: 'center' });
  const waPropName = property?.title ? `"${property.title}"` : 'your projects';
  const waUrl = `https://wa.me/917305023919?text=${encodeURIComponent(`Hello Perfect Homes & Developers, I would like to schedule a site visit and enquire about ${waPropName}.`)}`;
  doc.link(b2X, actBtnY, actBtnW, actBtnH, { url: waUrl });

  // Button 3: Send Email
  const b3X = b2X + actBtnW + 2;
  doc.setFillColor(...COLORS.primaryTeal);
  doc.roundedRect(b3X, actBtnY, actBtnW, actBtnH, 3.5, 3.5, 'F');
  drawEmailVector(doc, b3X + 10, actBtnY + 10, 3.5, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.white);
  doc.text('Send Email', b3X + actBtnW / 2 + 4, actBtnY + 8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.lightMint);
  doc.text('perfecthomesd@gmail.com', b3X + actBtnW / 2 + 4, actBtnY + 15, { align: 'center' });
  doc.link(b3X, actBtnY, actBtnW, actBtnH, { url: 'mailto:perfecthomesd@gmail.com' });

  // 6. Bottom Office Location Card
  const offCardY = actBtnY + actBtnH + 6;
  const offCardW = cardW - 12;
  const offCardH = 26;
  const offCardX = cardX + 6;

  doc.setFillColor(...COLORS.mintSoft);
  doc.roundedRect(offCardX, offCardY, offCardW, offCardH, 3.5, 3.5, 'F');
  doc.setDrawColor(...COLORS.lightMint);
  doc.setLineWidth(0.4);
  doc.roundedRect(offCardX, offCardY, offCardW, offCardH, 3.5, 3.5, 'S');

  // Vector map thumbnail on left
  drawMapVectorThumbnail(doc, offCardX + 5, offCardY + 4, 20, 18);

  // Address text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.deepTeal);
  doc.text('Visit Our Registered Office', offCardX + 30, offCardY + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGray);
  doc.text('No. 3, Krishna Nagar, CTH Road, Thiruninravur - 602024, Tamil Nadu, India.', offCardX + 30, offCardY + 18);

  // "View on Google Maps" button on right
  const mapBtnW = 54;
  const mapBtnH = 14;
  const mapBtnX = offCardX + offCardW - mapBtnW - 6;
  const mapBtnY = offCardY + 6;

  doc.setFillColor(...COLORS.deepTeal);
  doc.roundedRect(mapBtnX, mapBtnY, mapBtnW, mapBtnH, 3, 3, 'F');
  drawLocationPinVector(doc, mapBtnX + 8, mapBtnY + 7, 2.8, COLORS.white, COLORS.deepTeal);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(...COLORS.white);
  doc.text('View on Google Maps', mapBtnX + mapBtnW / 2 + 3, mapBtnY + 8.8, { align: 'center' });
  doc.link(mapBtnX, mapBtnY, mapBtnW, mapBtnH, { url: COMPANY_CONTACT_INFO.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=13.124850%2C80.043786' });

  doc.restoreGraphicsState();
}

/**
 * Generate Standalone Company Profile & Contact Card PDF
 */
export async function generateCompanyContactPdf() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const heroPhoto = await loadImageAsBase64('/images/thank-you-house.jpg') ||
                    await loadImageAsBase64('/media/part8/images/whatsapp_image_2026-10-16_at_11_24_53_am_1__1.jpeg');

  renderCompanyContactSheet(doc, null, heroPhoto);
  drawPageFooter(doc, 1, 'Company Profile & Contact Card');
  return doc;
}

export async function downloadCompanyContactPdf() {
  const doc = await generateCompanyContactPdf();
  const filename = 'Perfect-Homes-Developers-Company-Profile.pdf';
  doc.save(filename);
  return { success: true, filename };
}

export async function previewCompanyContactPdf() {
  const doc = await generateCompanyContactPdf();
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  return { success: true, url };
}

// ============================================================================
// 4. MAIN DYNAMIC 8-PAGE VERIFIED PROPERTY BROCHURE GENERATOR
// ============================================================================

export async function generatePropertyBrochure(propertyOrId) {
  const property = await getPropertyForBrochure(propertyOrId);
  if (!property) throw new Error('Valid property record is required for brochure generation');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Preload property images asynchronously
  const imageSources = (property.images || []).filter(Boolean);
  const loadedImages = [];
  for (let i = 0; i < Math.min(imageSources.length, 6); i++) {
    const loaded = await loadImageAsBase64(imageSources[i]);
    if (loaded) loadedImages.push(loaded);
  }

  // Preload logo
  const logoImg = (await loadImageAsBase64('/perfect-homes-logo-horizontal.png')) ||
                 (await loadImageAsBase64('/perfect-homes-logo.png'));

  // Preload floor plan image
  let floorPlanImg = property.floorPlanImg ? await loadImageAsBase64(property.floorPlanImg) : null;
  if (!floorPlanImg && (property.bhk || (property.category && property.category.includes('House')) || property.id === 'ph-109')) {
    floorPlanImg = await loadImageAsBase64('/images/model-villa-floor-plan.jpg');
  }

  // Preload map snapshot
  const mapImg = await loadImageAsBase64('/images/thiruninravur-map.jpg');

  // Preload thank-you miniature house photo for Page 8
  const thankYouImg = await loadImageAsBase64('/images/thank-you-house.jpg');

  // Property Details Normalization
  const propTitle = property.title || 'Exclusive Property Listing';
  const propCategory = property.category || property.propertyType || 'Residential';
  const propLocation = property.location || 'Thiruninravur, Chennai';
  const propAddress = property.fullAddress || `${propLocation}, Tamil Nadu - 602024`;
  const propPrice = property.priceDisplay
    ? property.priceDisplay.replace(/₹/g, 'Rs. ')
    : (property.price ? `Rs. ${(property.price / 100000).toFixed(1)} Lakhs` : 'Contact us for details');
  const propApproval = property.approval || 'DTCP & CMDA Compliant';
  const propRoad = property.roadWidth || '40ft & 33ft Wide Blacktop Tar Roads';
  const propFacing = property.facing || 'East / North';
  const propAvailability = property.availability || property.possession || 'Ready to Move';
  const propConfig = property.bhk
    ? `${property.bhk} BHK (${property.bhk} Bedrooms, Hall, Kitchen)`
    : (property.propertyType === 'Plot' || propCategory.includes('Plot')
      ? (property.plotAreaRange || `${property.plotArea || 1200} Sq.ft Residential Plot`)
      : (property.builtUpArea ? `${property.builtUpArea} Sq.ft Built-up Area` : 'Custom Specifications'));
  const propBuiltUp = property.builtUpArea ? `${property.builtUpArea} Sq.ft` : (property.bhk ? 'Provide actual area' : 'N/A (Plotted Land)');
  const propLandArea = property.plotArea ? `${property.plotArea} Sq.ft` : (property.plotAreaRange || 'Provide actual area');

  // Smart Title Decomposition
  const titleParts = propTitle.split('—');
  const mainTitlePrefix = titleParts[0].trim();
  const mainTitleWords = mainTitlePrefix.split(' ');
  const titleLine1 = mainTitleWords.length > 2 ? mainTitleWords.slice(0, 2).join(' ') : 'Exclusive';
  const titleLine2 = mainTitleWords.length > 2 ? mainTitleWords.slice(2).join(' ') : mainTitlePrefix;
  const subTitle = titleParts[1] ? titleParts[1].trim() : (property.tagline || `${propCategory} in ${propLocation}`);

  /* ==========================================================================
     PAGE 1 — COVER PAGE
     ========================================================================== */
  if (logoImg) {
    doc.addImage(logoImg.dataUrl, 'JPEG', 18, 12, 54, 15);
  } else {
    drawBrandLogo(doc, 18, 11, 1.1, false);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.deepTeal);
    doc.text('PERFECT HOMES', 44, 17);
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.gold);
    doc.text('& DEVELOPERS', 44, 22);
  }

  // Right Motto Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGray);
  doc.text('Quality Homes', 192, 14.5, { align: 'right' });
  doc.text('Better Communities', 192, 19, { align: 'right' });
  doc.text('Brighter Futures', 192, 23.5, { align: 'right' });

  // Divider Line
  doc.setDrawColor(...COLORS.lightMint);
  doc.setLineWidth(0.6);
  doc.line(18, 29, 192, 29);

  // Property Title Formatting
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.darkSlate);
  doc.text(titleLine1, 18, 37);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...COLORS.primaryTeal);
  doc.text(titleLine2, 18, 47);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.deepTeal);
  doc.text(subTitle, 18, 54);

  // Category Badge Pill with native Star Vector
  doc.setFillColor(...COLORS.lightMint);
  doc.roundedRect(18, 57.5, 76, 7, 3.5, 3.5, 'F');
  drawStarVector(doc, 22.5, 61, 2.2, 1.0, COLORS.deepTeal);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(...COLORS.deepTeal);
  doc.text(`Category: ${propCategory}`, 26.5, 62.2);

  // Cover Hero Photo
  const heroImg = loadedImages[0];
  const photoY = 68;
  const photoH = 106;

  if (heroImg) {
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(17, photoY - 1, 176, photoH + 2, 4, 4, 'F');
    doc.addImage(heroImg.dataUrl, 'JPEG', 18, photoY, 174, photoH);
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.setLineWidth(0.7);
    doc.roundedRect(18, photoY, 174, photoH, 3, 3, 'S');
  } else {
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(18, photoY, 174, photoH, 3, 3, 'F');
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.roundedRect(18, photoY, 174, photoH, 3, 3, 'S');
    drawBrandLogo(doc, 90, photoY + 35, 2.5, false);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.deepTeal);
    doc.text(propTitle, 105, photoY + 70, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.midGray);
    doc.text(propLocation, 105, photoY + 77, { align: 'center' });
  }

  // 4 Feature Badges with native Checkmark Vector
  const badgeY = 182;
  const badgeLabels = propCategory.includes('Plot')
    ? ['DTCP / CMDA Approved', 'Clear 40-Yr Parent Deed', 'Wide Blacktop Roads', 'Prime Growth Corridor']
    : ['Modern Design', 'Spacious Living', 'Quality Construction', 'Peaceful Location'];

  badgeLabels.forEach((lbl, idx) => {
    const bx = 18 + idx * 44.5;
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(bx, badgeY, 41, 17, 2.5, 2.5, 'F');
    doc.setDrawColor(...COLORS.lightMint);
    doc.setLineWidth(0.4);
    doc.roundedRect(bx, badgeY, 41, 17, 2.5, 2.5, 'S');

    // Circular badge icon with vector checkmark
    doc.setFillColor(...COLORS.deepTeal);
    doc.circle(bx + 8, badgeY + 8.5, 4.5, 'F');
    drawCheckmarkVector(doc, bx + 8, badgeY + 8.5, 3.2, COLORS.mintAccent);

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...COLORS.darkSlate);
    const splitLbl = doc.splitTextToSize(lbl, 26);
    doc.text(splitLbl, bx + 14.5, badgeY + 7);
  });

  // Bottom Wave Slogan Banner
  const bannerY = 207;
  doc.setFillColor(...COLORS.deepTeal);
  doc.roundedRect(18, bannerY, 174, 38, 4, 4, 'F');

  doc.setFillColor(...COLORS.primaryTeal);
  doc.circle(185, bannerY + 12, 14, 'F');
  doc.circle(25, bannerY + 30, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.white);
  doc.text('A Perfect Home for a Better Tomorrow', 105, bannerY + 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.lightMint);
  doc.text('Verified Legal Approvals | Transparent Pricing | Complete Peace of Mind', 105, bannerY + 24, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.mintAccent);
  doc.text(`Location: ${propLocation}  |  Enquiries: ${COMPANY_CONTACT_INFO.phoneDisplay}`, 105, bannerY + 31, { align: 'center' });

  drawPageFooter(doc, 1, 'Cover Page');

  /* ==========================================================================
     PAGE 2 — PROPERTY OVERVIEW
     ========================================================================== */
  doc.addPage();
  drawPageHeaderRibbon(doc, 'Property Overview', 'Comprehensive Verified Specifications & Details');

  // Specifications Table Card
  const specCardY = 28;
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(18, specCardY, 174, 150, 3, 3, 'F');
  doc.setDrawColor(...COLORS.lightMint);
  doc.setLineWidth(0.6);
  doc.roundedRect(18, specCardY, 174, 150, 3, 3, 'S');

  // Spec Rows with verified property fields
  const specItems = [
    { label: 'Property Name', val: propTitle },
    { label: 'Property ID', val: (property.id || 'PH-109').toUpperCase() },
    { label: 'Property Type', val: `${property.propertyType || propCategory} (${propCategory})` },
    { label: 'Location', val: propAddress },
    { label: 'Configuration', val: propConfig },
    { label: 'Built-up Area', val: propBuiltUp },
    { label: 'Land Area / Plot Area', val: propLandArea },
    { label: 'Facing Orientation', val: propFacing },
    { label: 'Road Access & Width', val: propRoad },
    { label: 'Price & Payment Terms', val: propPrice },
    { label: 'Approval Status', val: propApproval },
    { label: 'Availability / Handover', val: propAvailability }
  ];

  let currentY = specCardY + 3;
  specItems.forEach((item, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(...COLORS.mintSoft);
      doc.rect(19, currentY, 172, 11.8, 'F');
    }

    doc.setFillColor(...COLORS.deepTeal);
    doc.circle(26, currentY + 5.9, 2.5, 'F');
    doc.setFillColor(...COLORS.mintAccent);
    doc.circle(26, currentY + 5.9, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.deepTeal);
    doc.text(item.label, 32, currentY + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.darkGray);
    const valText = doc.splitTextToSize(item.val, 105);
    doc.text(valText, 85, currentY + 7.5);

    currentY += 12.2;
  });

  // "About This Property" Card
  const aboutY = 186;
  doc.setFillColor(...COLORS.mintSoft);
  doc.roundedRect(18, aboutY, 174, 94, 3, 3, 'F');
  doc.setDrawColor(...COLORS.primaryTeal);
  doc.setLineWidth(0.5);
  doc.roundedRect(18, aboutY, 174, 94, 3, 3, 'S');

  doc.setFillColor(...COLORS.deepTeal);
  doc.roundedRect(24, aboutY + 8, 38, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(...COLORS.white);
  doc.text('ABOUT THIS PROPERTY', 26, aboutY + 12.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.deepTeal);
  doc.text(`Why Choose ${mainTitlePrefix}?`, 66, aboutY + 13.5);

  const descText = property.description ||
    `${propTitle} is a thoughtfully designed development by Perfect Homes & Developers, providing unmatched lifestyle convenience, sound structural engineering, and verified legal approvals in ${propLocation}. Ideal for families seeking a peaceful residential environment with good connectivity.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(...COLORS.darkGray);
  const splitDesc = doc.splitTextToSize(descText, 162);
  doc.text(splitDesc, 24, aboutY + 23);

  // Key Highlights Bullets with native Vector Gold Dots
  const highlights = (property.highlights && property.highlights.length > 0
    ? property.highlights
    : [
      '100% Clear Legal Title verified with 40-year parent deed documentation.',
      'Sanctioned bank loan facility from SBI, HDFC, Canara Bank, and leading financial institutions.',
      'High groundwater table with sweet potable drinking water.',
      'Close proximity to CBSE schools, railway stations, bus terminals, and shopping hubs.'
    ]
  ).slice(0, 4);

  let hlY = aboutY + 48;
  highlights.forEach((hl) => {
    doc.setFillColor(...COLORS.gold);
    doc.circle(28, hlY + 2, 1.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(...COLORS.deepTeal);
    const splitHl = doc.splitTextToSize(hl, 152);
    doc.text(splitHl, 33, hlY + 3.2);
    hlY += 10;
  });

  drawPageFooter(doc, 2, 'Property Overview');

  /* ==========================================================================
     PAGE 3 — PROPERTY GALLERY (ACTUAL PHOTOS)
     ========================================================================== */
  doc.addPage();
  drawPageHeaderRibbon(doc, 'Property Gallery', `Actual Photos of ${mainTitlePrefix}`);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGray);
  doc.text('Note: These are verified genuine photographs of this property and actual site development.', 105, 26, { align: 'center' });

  // Top Large Hero Photo
  const gHeroY = 30;
  const gHeroH = 96;
  const topPhoto = loadedImages[0] || loadedImages[1];

  if (topPhoto) {
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(17, gHeroY - 1, 176, gHeroH + 2, 3, 3, 'F');
    doc.addImage(topPhoto.dataUrl, 'JPEG', 18, gHeroY, 174, gHeroH);
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.setLineWidth(0.5);
    doc.roundedRect(18, gHeroY, 174, gHeroH, 2, 2, 'S');

    doc.setFillColor(...COLORS.deepTeal);
    doc.roundedRect(22, gHeroY + 4, 64, 6, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.white);
    doc.text('Main Architectural Elevation / Facade', 25, gHeroY + 8.2);
  } else {
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(18, gHeroY, 174, gHeroH, 3, 3, 'F');
    drawBrandLogo(doc, 95, gHeroY + 30, 2, false);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.deepTeal);
    doc.text('Actual Site Photo Gallery', 105, gHeroY + 60, { align: 'center' });
  }

  // Bottom 4 Sub-Photos (2x2 Grid)
  const gGridY = 132;
  const cellW = 85;
  const cellH = 70;
  const subImages = loadedImages.slice(1, 5);

  const fallbackCaptions = propCategory.includes('Plot')
    ? ['40ft Blacktop Tar Road', 'Internal Plotted Demarcations', 'Surrounding Gated Layout', 'Clear Concrete Boundary Stones']
    : ['Living & Dining Hall', 'Modular Kitchen Platform', 'Well-Ventilated Master Bedroom', 'Modern Ceramic Bathroom & Fittings'];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const idx = row * 2 + col;
      const cellX = 18 + col * (cellW + 4);
      const cellY = gGridY + row * (cellH + 4);
      const subImg = subImages[idx] || loadedImages[idx % loadedImages.length];

      if (subImg) {
        doc.addImage(subImg.dataUrl, 'JPEG', cellX, cellY, cellW, cellH);
        doc.setDrawColor(...COLORS.primaryTeal);
        doc.setLineWidth(0.4);
        doc.roundedRect(cellX, cellY, cellW, cellH, 2, 2, 'S');

        doc.setFillColor(0, 0, 0, 0.65);
        doc.rect(cellX, cellY + cellH - 7, cellW, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.white);
        doc.text(fallbackCaptions[idx] || `Property Photo #${idx + 1}`, cellX + 4, cellY + cellH - 2.5);
      } else {
        doc.setFillColor(...COLORS.mintSoft);
        doc.roundedRect(cellX, cellY, cellW, cellH, 2, 2, 'F');
        doc.setDrawColor(...COLORS.lightMint);
        doc.roundedRect(cellX, cellY, cellW, cellH, 2, 2, 'S');
        drawBrandLogo(doc, cellX + 35, cellY + 20, 1.2, false);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.deepTeal);
        doc.text(fallbackCaptions[idx] || `Verified View #${idx + 1}`, cellX + cellW / 2, cellY + 45, { align: 'center' });
      }
    }
  }

  drawPageFooter(doc, 3, 'Property Photos');

  /* ==========================================================================
     PAGE 4 — FLOOR PLAN / MASTER LAYOUT
     ========================================================================== */
  doc.addPage();
  const planTitle = propCategory.includes('Plot') ? 'Layout Master Plan' : 'Floor Plan';
  drawPageHeaderRibbon(doc, planTitle, 'Designed for Optimal Space, Vastu Compliance & Modern Utility');

  const planY = 28;
  const planH = 224;

  if (floorPlanImg) {
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(18, planY, 174, planH, 3, 3, 'F');
    doc.addImage(floorPlanImg.dataUrl, 'JPEG', 20, planY + 4, 170, planH - 22);
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.setLineWidth(0.6);
    doc.roundedRect(18, planY, 174, planH, 3, 3, 'S');
  } else {
    // High-precision CAD architectural diagram fallback
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(18, planY, 174, planH, 3, 3, 'F');
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.setLineWidth(0.6);
    doc.roundedRect(18, planY, 174, planH, 3, 3, 'S');

    if (propCategory.includes('Plot')) {
      const plX = 26;
      const plY = planY + 16;
      const plW = 158;
      const plH = 180;

      doc.setFillColor(...COLORS.mintSoft);
      doc.rect(plX, plY, plW, plH, 'F');
      doc.setDrawColor(...COLORS.deepTeal);
      doc.setLineWidth(0.8);
      doc.rect(plX, plY, plW, plH, 'S');

      // 40ft Main Road
      doc.setFillColor(...COLORS.lightGray);
      doc.rect(plX + 68, plY, 22, plH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.darkSlate);
      doc.text('40 FEET WIDE MAIN TAR ROAD', plX + 79, plY + 90, { angle: 90, align: 'center' });

      // Left Plots Grid
      for (let i = 0; i < 5; i++) {
        const py = plY + i * 36;
        doc.setFillColor(255, 255, 255);
        doc.rect(plX + 4, py + 4, 60, 31, 'FD');
        doc.setDrawColor(...COLORS.primaryTeal);
        doc.setLineWidth(0.4);
        doc.rect(plX + 4, py + 4, 60, 31, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.deepTeal);
        doc.text(`PLOT #${i + 1}`, plX + 34, py + 16, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.midGray);
        doc.text("30' x 40'  |  1200 Sq.Ft", plX + 34, py + 22, { align: 'center' });

        drawStarVector(doc, plX + 16, py + 26.5, 1.8, 0.8, COLORS.gold);
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.gold);
        doc.text('CMDA & RERA Approved', plX + 36, py + 27, { align: 'center' });
      }

      // Right Plots Grid
      for (let i = 0; i < 5; i++) {
        const py = plY + i * 36;
        doc.setFillColor(255, 255, 255);
        doc.rect(plX + 94, py + 4, 60, 31, 'FD');
        doc.setDrawColor(...COLORS.primaryTeal);
        doc.setLineWidth(0.4);
        doc.rect(plX + 94, py + 4, 60, 31, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.deepTeal);
        doc.text(`PLOT #${i + 6}`, plX + 124, py + 16, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.midGray);
        doc.text("30' x 40'  |  1200 Sq.Ft", plX + 124, py + 22, { align: 'center' });

        drawStarVector(doc, plX + 104, py + 26.5, 1.8, 0.8, COLORS.gold);
        doc.setFontSize(6.8);
        doc.setTextColor(...COLORS.gold);
        doc.text('Ready for Registration', plX + 126, py + 27, { align: 'center' });
      }
    } else {
      const fpX = 26;
      const fpY = planY + 15;
      const fpW = 158;
      const fpH = 180;

      // Outer house wall
      doc.setFillColor(253, 253, 253);
      doc.rect(fpX, fpY, fpW, fpH, 'F');
      doc.setDrawColor(...COLORS.darkSlate);
      doc.setLineWidth(1.2);
      doc.rect(fpX, fpY, fpW, fpH, 'S');

      // Bedroom 1 (Master)
      doc.setFillColor(243, 248, 247);
      doc.rect(fpX + 3, fpY + 3, 74, 55, 'FD');
      doc.rect(fpX + 3, fpY + 3, 74, 55, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.deepTeal);
      doc.text('Bedroom 1', fpX + 40, fpY + 28, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.midGray);
      doc.text('10\'0" x 10\'0"', fpX + 40, fpY + 35, { align: 'center' });

      // Bedroom 2
      doc.setFillColor(243, 248, 247);
      doc.rect(fpX + 80, fpY + 3, 75, 55, 'FD');
      doc.rect(fpX + 80, fpY + 3, 75, 55, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.deepTeal);
      doc.text('Bedroom 2', fpX + 117, fpY + 28, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.midGray);
      doc.text('10\'0" x 10\'0"', fpX + 117, fpY + 35, { align: 'center' });

      // Living & Dining Hall
      doc.setFillColor(255, 255, 255);
      doc.rect(fpX + 3, fpY + 61, 95, 65, 'FD');
      doc.rect(fpX + 3, fpY + 61, 95, 65, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.deepTeal);
      doc.text('Living & Dining', fpX + 50, fpY + 90, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.midGray);
      doc.text('16\'0" x 10\'0"', fpX + 50, fpY + 97, { align: 'center' });

      // Kitchen
      doc.setFillColor(254, 250, 242);
      doc.rect(fpX + 101, fpY + 61, 54, 38, 'FD');
      doc.rect(fpX + 101, fpY + 61, 54, 38, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.deepTeal);
      doc.text('Kitchen', fpX + 128, fpY + 78, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.midGray);
      doc.text('8\'0" x 8\'0"', fpX + 128, fpY + 84, { align: 'center' });

      // Bathroom
      doc.setFillColor(240, 249, 255);
      doc.rect(fpX + 101, fpY + 102, 54, 24, 'FD');
      doc.rect(fpX + 101, fpY + 102, 54, 24, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.deepTeal);
      doc.text('Bathroom', fpX + 128, fpY + 113, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.midGray);
      doc.text('6\'0" x 4\'0"', fpX + 128, fpY + 119, { align: 'center' });

      // Car Parking
      doc.setFillColor(245, 245, 245);
      doc.rect(fpX + 3, fpY + 129, 152, 48, 'FD');
      doc.rect(fpX + 3, fpY + 129, 152, 48, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.deepTeal);
      doc.text('Car Parking (if applicable)', fpX + 79, fpY + 152, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.midGray);
      doc.text('Covered Vehicle Parking & Entrance Porch', fpX + 79, fpY + 159, { align: 'center' });
    }
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGray);
  doc.text('Note: This is a sample floor plan for illustration purposes. Actual dimensions may vary.', 105, planY + planH + 6, { align: 'center' });

  drawPageFooter(doc, 4, 'Floor Plan');

  /* ==========================================================================
     PAGE 5 — LOCATION & NEARBY LANDMARKS
     ========================================================================== */
  doc.addPage();
  drawPageHeaderRibbon(doc, 'Location & Nearby Landmarks', `${propLocation}, Tamil Nadu`);

  const lmY = 28;
  const landmarks = (property.nearby && property.nearby.length > 0)
    ? property.nearby
    : [
      { name: 'Sri Ram College / Educational Hub', distance: 'Approx. 2 minutes' },
      { name: 'Railway Station', distance: 'Approx. 10 minutes' },
      { name: 'Bus Stand', distance: 'Approx. 10 minutes' },
      { name: 'Outer Ring Road (ORR) Interchange', distance: 'Approx. 8 minutes' },
      { name: 'Sriram Polytechnic College', distance: 'Approx. 3 minutes' },
      { name: 'Supermarkets & Multi-Specialty Clinic', distance: 'Approx. 5 minutes' }
    ];

  doc.setFillColor(...COLORS.white);
  doc.roundedRect(18, lmY, 174, 96, 3, 3, 'F');
  doc.setDrawColor(...COLORS.lightMint);
  doc.setLineWidth(0.6);
  doc.roundedRect(18, lmY, 174, 96, 3, 3, 'S');

  let curLmY = lmY + 5;
  landmarks.slice(0, 6).forEach((lm, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(...COLORS.mintSoft);
      doc.rect(19, curLmY, 172, 13.5, 'F');
    }

    // Native Location Pin Vector
    drawLocationPinVector(doc, 26, curLmY + 6.8, 3.2, COLORS.primaryTeal, null, COLORS.deepTeal);

    // Landmark Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.darkSlate);
    doc.text(lm.name, 35, curLmY + 8.5);

    // Distance / Time
    const distText = lm.distance || lm.time || 'Short Drive';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.primaryTeal);
    doc.text(distText.includes('Approx') ? distText : `Approx. ${distText}`, 186, curLmY + 8.5, { align: 'right' });

    curLmY += 14.5;
  });

  // Map Preview Box
  const mapY = 132;
  const mapH = 96;

  if (mapImg) {
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(17, mapY - 1, 176, mapH + 2, 3, 3, 'F');
    doc.addImage(mapImg.dataUrl, 'JPEG', 18, mapY, 174, mapH - 18);
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.setLineWidth(0.6);
    doc.roundedRect(18, mapY, 174, mapH, 3, 3, 'S');
  } else {
    doc.setFillColor(...COLORS.mintSoft);
    doc.roundedRect(18, mapY, 174, mapH, 3, 3, 'F');
    doc.setDrawColor(...COLORS.primaryTeal);
    doc.setLineWidth(0.6);
    doc.roundedRect(18, mapY, 174, mapH, 3, 3, 'S');

    doc.setDrawColor(220, 235, 233);
    doc.setLineWidth(0.4);
    for (let x = 30; x < 185; x += 18) doc.line(x, mapY + 6, x, mapY + mapH - 24);
    for (let y = mapY + 12; y < mapY + mapH - 24; y += 14) doc.line(22, y, 188, y);

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(4);
    doc.line(22, mapY + 38, 188, mapY + 38);
    doc.line(105, mapY + 6, 105, mapY + mapH - 24);

    drawLocationPinVector(doc, 105, mapY + 28, 4.5, [239, 68, 68], null, [255, 255, 255]);
  }

  // Clickable "View on Google Maps" Button with native location pin
  const btnY = mapY + mapH - 14;
  const btnW = 90;
  const btnX = 105 - btnW / 2;
  const btnH = 11;

  doc.setFillColor(...COLORS.deepTeal);
  doc.roundedRect(btnX, btnY, btnW, btnH, 3, 3, 'F');
  doc.setDrawColor(...COLORS.mintAccent);
  doc.setLineWidth(0.6);
  doc.roundedRect(btnX, btnY, btnW, btnH, 3, 3, 'S');

  drawLocationPinVector(doc, btnX + 12, btnY + 5.5, 2.5, COLORS.white, null, [234, 67, 53]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.white);
  doc.text('View on Google Maps', btnX + btnW / 2 + 4, btnY + 7.5, { align: 'center' });

  const mapsUrl = property.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=13.124850%2C80.043786';
  doc.link(btnX, btnY, btnW, btnH, { url: mapsUrl });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.midGray);
  doc.text('Note: Travel times are approximate and provided by the company.', 105, 240, { align: 'center' });

  drawPageFooter(doc, 5, 'Location & Landmarks');

  /* ==========================================================================
     PAGE 6 — KEY FEATURES & BENEFITS
     ========================================================================== */
  doc.addPage();
  drawPageHeaderRibbon(doc, 'Key Features & Benefits', 'Distinctive Advantages & Construction Standards');

  const featGridY = 28;
  const fCardW = 84;
  const fCardH = 41;

  const featuresList = propCategory.includes('Plot')
    ? [
      { title: '100% Clear Legal Title', desc: 'Comprehensive 40-year parent document search with individual title verification.' },
      { title: 'DTCP & CMDA Approvals', desc: 'Legally surveyed layouts with registered approved plan & RERA registration.' },
      { title: 'Wide Blacktop Tar Roads', desc: '40ft and 33ft wide high-grade asphalt roads with street lighting infrastructure.' },
      { title: 'Sweet Ground Water Table', desc: 'Abundant clean drinking potable water available at shallow 20-25ft depth.' },
      { title: '90% Bank Loan Support', desc: 'Pre-sanctioned bank loan approval from SBI, HDFC, Canara Bank, and LIC.' },
      { title: 'Elevated Highland Terrain', desc: 'Naturally elevated red-soil land guaranteeing zero waterlogging during monsoons.' },
      { title: 'Rapid Growth Hub', desc: 'Directly linked to Outer Ring Road (ORR) and burgeoning IT & industrial corridors.' },
      { title: 'Immediate Registration', desc: 'Spot registration support with rapid patta transfer in buyer name.' }
    ]
    : [
      { title: `Modern ${property.bhk ? `${property.bhk} BHK` : ''} Design`, desc: 'Comfortable and functional living spaces designed for modern families.' },
      { title: 'Spacious Rooms', desc: 'Well-ventilated and bright interiors with ample natural airflow.' },
      { title: 'Quality Construction', desc: 'Built with quality materials and earthquake-resistant RCC structure.' },
      { title: 'Modern Kitchen', desc: 'Designed for convenience with granite platform and plumbing provisions.' },
      { title: 'Good Connectivity', desc: 'Close to colleges, railway station, bus stand and Outer Ring Road.' },
      { title: 'Car Parking', desc: 'Dedicated covered vehicle parking space and entrance portico.' },
      { title: 'Suitable for Families', desc: 'Peaceful and family-friendly residential area surrounded by homes.' },
      { title: 'Investment Potential', desc: 'Ideal for end-use or long-term capital appreciation in Chennai outer corridor.' }
    ];

  for (let i = 0; i < 8; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const fx = 18 + col * (fCardW + 6);
    const fy = featGridY + row * (fCardH + 5);
    const item = featuresList[i];

    doc.setFillColor(...COLORS.white);
    doc.roundedRect(fx, fy, fCardW, fCardH, 2.5, 2.5, 'F');
    doc.setDrawColor(...COLORS.lightMint);
    doc.setLineWidth(0.5);
    doc.roundedRect(fx, fy, fCardW, fCardH, 2.5, 2.5, 'S');

    // Vector Star Icon
    drawStarVector(doc, fx + 9, fy + 12, 3.2, 1.4, COLORS.primaryTeal);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(...COLORS.deepTeal);
    const splitTitle = doc.splitTextToSize(item.title, 62);
    doc.text(splitTitle, fx + 16, fy + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(...COLORS.darkGray);
    const splitDesc = doc.splitTextToSize(item.desc, 70);
    doc.text(splitDesc, fx + 6, fy + 22);
  }

  // Bottom Inspirational Brand Banner
  const btmBannerY = 218;
  doc.setFillColor(...COLORS.deepTeal);
  doc.roundedRect(18, btmBannerY, 174, 34, 3.5, 3.5, 'F');

  drawBrandLogo(doc, 26, btmBannerY + 7, 0.9, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.white);
  doc.text('A Home That Grows With Your Dreams', 110, btmBannerY + 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.mintAccent);
  doc.text('Live Better   |   Invest Smarter   |   Build Your Future', 110, btmBannerY + 23, { align: 'center' });

  drawPageFooter(doc, 6, 'Key Features');

  /* ==========================================================================
     PAGE 7 — CONTACT US & COMPANY SHEET
     Precisely matches the uploaded reference image!
     ========================================================================== */
  doc.addPage();
  renderCompanyContactSheet(doc, property, heroImg);
  drawPageFooter(doc, 7, 'Contact Us');

  /* ==========================================================================
     PAGE 8 — BACK PAGE (THANK YOU)
     ========================================================================== */
  doc.addPage();

  // Full-bleed deep teal background
  doc.setFillColor(...COLORS.deepTeal);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(...COLORS.primaryTeal);
  doc.circle(210, 0, 70, 'F');
  doc.circle(0, 297, 85, 'F');

  doc.setFillColor(...COLORS.darkSlate);
  doc.circle(0, 0, 45, 'F');

  // Top Logo on Back Page
  drawBrandLogo(doc, 90, 28, 1.6, true);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.white);
  doc.text('PERFECT HOMES & DEVELOPERS', 105, 48, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.mintAccent);
  doc.text('Your Dream - Our Commitment', 105, 54, { align: 'center' });

  // Hero Thank You Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...COLORS.white);
  doc.text('Thank You', 105, 78, { align: 'center' });
  doc.text('for Your Interest', 105, 90, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.lightMint);
  doc.text('We look forward to helping you find your perfect home.', 105, 101, { align: 'center' });

  // Center Miniature House Visual Card
  const handCardY = 114;
  const handCardH = 88;
  const handCardW = 144;
  const handCardX = 105 - handCardW / 2;

  if (thankYouImg) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(handCardX - 1, handCardY - 1, handCardW + 2, handCardH + 2, 4, 4, 'F');
    doc.addImage(thankYouImg.dataUrl, 'JPEG', handCardX, handCardY, handCardW, handCardH);
    doc.setDrawColor(...COLORS.mintAccent);
    doc.setLineWidth(0.6);
    doc.roundedRect(handCardX, handCardY, handCardW, handCardH, 3, 3, 'S');
  } else {
    doc.setFillColor(255, 255, 255, 0.12);
    doc.roundedRect(handCardX, handCardY, handCardW, handCardH, 6, 6, 'F');
    doc.setDrawColor(...COLORS.mintAccent);
    doc.setLineWidth(0.6);
    doc.roundedRect(handCardX, handCardY, handCardW, handCardH, 6, 6, 'S');

    drawBrandLogo(doc, 90, handCardY + 16, 2.2, true);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.white);
    doc.text(mainTitlePrefix, 105, handCardY + 60, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.mintAccent);
    doc.text(propLocation, 105, handCardY + 68, { align: 'center' });
  }

  // 4 Category Badges at bottom with vector stars
  const bCatY = 214;
  const categoriesList = ['Residential Plots', 'Independent Houses', 'Villas', 'Land with Construction'];

  categoriesList.forEach((cat, idx) => {
    const cx = 18 + idx * 44.5;
    doc.setFillColor(255, 255, 255, 0.15);
    doc.roundedRect(cx, bCatY, 41, 25, 3, 3, 'F');
    doc.setDrawColor(...COLORS.mintAccent);
    doc.setLineWidth(0.4);
    doc.roundedRect(cx, bCatY, 41, 25, 3, 3, 'S');

    drawStarVector(doc, cx + 20.5, bCatY + 8, 2.5, 1.1, COLORS.gold);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.white);
    const splitCat = doc.splitTextToSize(cat, 36);
    doc.text(splitCat, cx + 20.5, bCatY + 15, { align: 'center' });
  });

  // Footer Company Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.mintAccent);
  doc.text('PERFECT HOMES & DEVELOPERS - Building Quality Communities', 105, 258, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.lightMint);
  doc.text(`No. 3, Krishna Nagar, CTH Road, Thiruninravur - 602024  |  +91 73050 23919`, 105, 264, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.lightMint);
  doc.text('Page 8 - Back Page', 192, 288, { align: 'right' });

  return doc;
}

/**
 * Direct browser download of property brochure PDF with meaningful filename
 */
export async function downloadPropertyBrochure(propertyOrId) {
  try {
    const property = await getPropertyForBrochure(propertyOrId);
    const doc = await generatePropertyBrochure(property);
    const filename = getBrochureFilename(property);

    doc.save(filename);
    return { success: true, filename, property };
  } catch (err) {
    console.error('Failed to generate PDF brochure:', err);
    throw err;
  }
}

/**
 * Open generated PDF in a new tab for previewing
 */
export async function previewPropertyBrochure(propertyOrId) {
  try {
    const property = await getPropertyForBrochure(propertyOrId);
    const doc = await generatePropertyBrochure(property);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    return { success: true, url, property };
  } catch (err) {
    console.error('Failed to preview PDF brochure:', err);
    throw err;
  }
}
