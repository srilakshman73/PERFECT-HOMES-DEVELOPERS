// Vercel Serverless Function: GET /api/users
// STRICT PRIVACY PROTECTION: Strictly accessible ONLY by authorized administrators
import { requireAdmin, getAllUsers, sanitizeUser } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Enforce server-side administrator authorization guard
    await requireAdmin(req);

    // Retrieve fresh users from persistent database
    const users = await getAllUsers();

    // Sanitize user records (STRICT SECURITY: Never expose password or password hashes)
    const sanitizedList = users.map((u) => sanitizeUser(u));

    return res.status(200).json({
      success: true,
      count: sanitizedList.length,
      users: sanitizedList
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Unauthorized access'
    });
  }
}
