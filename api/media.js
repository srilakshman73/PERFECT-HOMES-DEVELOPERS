// Vercel Serverless Function: /api/media
// Secure Media Management API with Server-Side Administrator Guard
import { requireAdmin } from './_db.js';
import fs from 'fs';
import path from 'path';

// Load default media catalog
import { IMPORTED_MEDIA, MEDIA_PARTS_CONFIG } from '../src/data/mediaData.js';

// In-memory / runtime override store for admin updates (reassignments, featured toggles)
let runtimeMediaState = [...IMPORTED_MEDIA];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Fetch media items with optional filters (Part, Project, MediaType, Search)
  if (req.method === 'GET') {
    try {
      const { part, type, projectId, search, includeArchived } = req.query;

      let list = runtimeMediaState;

      // Filter out archived unless explicitly requested by admin
      if (includeArchived !== 'true') {
        list = list.filter((m) => !m.isArchived);
      }

      if (part && part !== 'all') {
        const pNum = parseInt(part, 10);
        list = list.filter((m) => m.partNumber === pNum);
      }

      if (type && type !== 'all') {
        list = list.filter((m) => m.mediaType === type);
      }

      if (projectId && projectId !== 'all') {
        list = list.filter((m) => m.projectId === projectId);
      }

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter(
          (m) =>
            m.originalFilename?.toLowerCase().includes(q) ||
            m.caption?.toLowerCase().includes(q) ||
            m.partName?.toLowerCase().includes(q)
        );
      }

      return res.status(200).json({
        success: true,
        count: list.length,
        totalCatalog: runtimeMediaState.length,
        partsSummary: MEDIA_PARTS_CONFIG,
        media: list
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. PUT: Update media assignment, featured flag, or caption (ADMIN ONLY)
  if (req.method === 'PUT') {
    try {
      await requireAdmin(req);

      const { id, projectId, isFeatured, caption, isArchived, partNumber } = req.body || {};

      if (!id) {
        return res.status(400).json({ success: false, error: 'Media ID is required for update.' });
      }

      const itemIndex = runtimeMediaState.findIndex((m) => m.id === id);
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, error: 'Media item not found in catalog.' });
      }

      // Update fields
      const updatedItem = { ...runtimeMediaState[itemIndex] };
      if (projectId !== undefined) updatedItem.projectId = projectId;
      if (partNumber !== undefined) updatedItem.partNumber = parseInt(partNumber, 10);
      if (caption !== undefined) updatedItem.caption = caption;
      if (isArchived !== undefined) updatedItem.isArchived = isArchived;

      if (isFeatured !== undefined) {
        updatedItem.isFeatured = isFeatured;
        // If set to featured, unset other items in same project
        if (isFeatured && updatedItem.projectId) {
          runtimeMediaState = runtimeMediaState.map((m) =>
            m.projectId === updatedItem.projectId && m.id !== id ? { ...m, isFeatured: false } : m
          );
        }
      }

      runtimeMediaState[itemIndex] = updatedItem;

      return res.status(200).json({
        success: true,
        message: 'Media record updated successfully.',
        media: updatedItem
      });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      return res.status(statusCode).json({ success: false, error: err.message });
    }
  }

  // 3. DELETE: Soft-remove media from website without deleting original local file (ADMIN ONLY)
  if (req.method === 'DELETE') {
    try {
      await requireAdmin(req);

      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Media ID is required to remove from website.' });
      }

      const item = runtimeMediaState.find((m) => m.id === id);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Media item not found.' });
      }

      // Mark as archived (preserves original local file while hiding from site)
      item.isArchived = true;

      return res.status(200).json({
        success: true,
        message: `Media "${item.originalFilename}" removed from website. Local file preserved.`,
        id
      });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      return res.status(statusCode).json({ success: false, error: err.message });
    }
  }

  // 4. POST: Add or register newly imported media record (ADMIN ONLY)
  if (req.method === 'POST') {
    try {
      await requireAdmin(req);

      const newMedia = req.body;
      if (!newMedia || !newMedia.storagePath) {
        return res.status(400).json({ success: false, error: 'Invalid media asset data.' });
      }

      const entry = {
        id: newMedia.id || `med_custom_${Date.now()}`,
        partNumber: newMedia.partNumber || 8,
        partName: newMedia.partName || 'Custom Uploaded Media',
        projectId: newMedia.projectId || 'ph-unassigned',
        originalFilename: newMedia.originalFilename || 'uploaded_media.jpg',
        filename: newMedia.filename || 'uploaded_media.jpg',
        mediaType: newMedia.mediaType || 'image',
        storagePath: newMedia.storagePath,
        sizeKB: newMedia.sizeKB || 100,
        uploadDate: new Date().toISOString().split('T')[0],
        isFeatured: false,
        caption: newMedia.caption || 'Property Media'
      };

      runtimeMediaState.unshift(entry);

      return res.status(201).json({
        success: true,
        message: 'Media registered successfully in catalog.',
        media: entry
      });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      return res.status(statusCode).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
