// Vercel Serverless Function: GET /api/session
import { getAuthenticatedUser, getAllUsers, sanitizeUser, normalizeEmail } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tokenPayload = getAuthenticatedUser(req);
    if (!tokenPayload) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    }

    const users = await getAllUsers();
    const dbUser = users.find(
      (u) => u.id === tokenPayload.userId || normalizeEmail(u.email) === normalizeEmail(tokenPayload.email)
    );

    if (!dbUser) {
      return res.status(401).json({ error: 'Account no longer exists.' });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(dbUser)
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to verify session: ' + err.message });
  }
}
