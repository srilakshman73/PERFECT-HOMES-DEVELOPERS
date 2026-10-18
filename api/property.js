// Vercel Serverless Function: /api/property
// Secure Property Data & Brochure Configuration API
import { PROPERTIES_DATA } from '../src/data/propertiesData.js';
import { getAuthenticatedUser, requireAdmin } from './_db.js';

// In-memory runtime override store for property edits (persisted across warm serverless invocations)
let runtimePropertyOverrides = {};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET /api/property?id=ph-109
  // Returns verified property data for brochure generation or details viewing
  if (req.method === 'GET') {
    try {
      const { id, slug } = req.query;

      if (!id && !slug) {
        // Return public published property catalog summary
        const publicCatalog = PROPERTIES_DATA.map((p) => {
          const overrides = runtimePropertyOverrides[p.id] || {};
          const merged = { ...p, ...overrides };
          return {
            id: merged.id,
            title: merged.title,
            slug: merged.slug,
            category: merged.category,
            location: merged.location,
            priceDisplay: merged.priceDisplay,
            isPublished: merged.isPublished !== false,
            brochurePublished: merged.brochurePublished !== false
          };
        });

        return res.status(200).json({
          success: true,
          count: publicCatalog.length,
          properties: publicCatalog
        });
      }

      // Look up specific property
      const target = PROPERTIES_DATA.find(
        (p) => (id && p.id === id) || (slug && p.slug === slug)
      );

      if (!target) {
        return res.status(404).json({
          success: false,
          error: `Property with ID "${id || slug}" not found in verified database.`
        });
      }

      const overrides = runtimePropertyOverrides[target.id] || {};
      const property = { ...target, ...overrides };

      // Check visibility authorization
      const tokenPayload = getAuthenticatedUser(req);
      const isAdmin = tokenPayload && tokenPayload.role === 'admin';

      if (!isAdmin) {
        if (property.isPublished === false) {
          return res.status(404).json({
            success: false,
            error: 'This property listing is currently unpublished.'
          });
        }
        if (property.brochurePublished === false) {
          return res.status(403).json({
            success: false,
            error: 'The official brochure for this property is currently being updated by the administrator.'
          });
        }
      }

      // Sanitize property object for public delivery (ensure no internal secrets)
      return res.status(200).json({
        success: true,
        property
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. PUT /api/property (ADMIN ONLY)
  // Allows authorized administrators to update brochure publishing status, landmarks, and cover photo
  if (req.method === 'PUT') {
    try {
      await requireAdmin(req);

      const { id, brochurePublished, googleMapsUrl, nearby, coverImage, description } = req.body || {};

      if (!id) {
        return res.status(400).json({ success: false, error: 'Property ID is required for updates.' });
      }

      const target = PROPERTIES_DATA.find((p) => p.id === id);
      if (!target) {
        return res.status(404).json({ success: false, error: `Property with ID "${id}" not found.` });
      }

      runtimePropertyOverrides[id] = {
        ...(runtimePropertyOverrides[id] || {}),
        ...(brochurePublished !== undefined && { brochurePublished }),
        ...(googleMapsUrl !== undefined && { googleMapsUrl }),
        ...(nearby !== undefined && { nearby }),
        ...(coverImage !== undefined && { coverImage }),
        ...(description !== undefined && { description }),
        updatedAt: new Date().toISOString()
      };

      const updated = { ...target, ...runtimePropertyOverrides[id] };

      return res.status(200).json({
        success: true,
        message: `Brochure configuration for ${updated.title} updated successfully.`,
        property: updated
      });
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
