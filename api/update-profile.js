// Vercel Serverless Function: POST /api/update-profile
import {
  getAuthenticatedUser,
  getAllUsers,
  saveAllUsers,
  sanitizeUser,
  normalizeEmail,
  validateIndianPhone,
  formatIndianPhone
} from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tokenPayload = getAuthenticatedUser(req);
    if (!tokenPayload) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const users = await getAllUsers();
    const userIndex = users.findIndex(
      (u) => u.id === tokenPayload.userId || normalizeEmail(u.email) === normalizeEmail(tokenPayload.email)
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const targetUser = users[userIndex];
    const updates = req.body || {};

    // Update name
    if (updates.name && typeof updates.name === 'string') {
      const cleanName = updates.name.trim();
      targetUser.name = cleanName;
      const parts = cleanName.split(' ');
      targetUser.firstName = parts[0] || targetUser.firstName;
      targetUser.lastName = parts.slice(1).join(' ') || '';
    }

    // Update phone if valid
    if (updates.phone) {
      if (validateIndianPhone(updates.phone)) {
        targetUser.phone = formatIndianPhone(updates.phone);
      }
    }

    if (updates.city) targetUser.city = String(updates.city).trim();
    if (updates.address) targetUser.address = String(updates.address).trim();
    if (updates.avatar) targetUser.avatar = String(updates.avatar).trim();
    if (updates.notificationPrefs && typeof updates.notificationPrefs === 'object') {
      targetUser.notificationPrefs = { ...targetUser.notificationPrefs, ...updates.notificationPrefs };
    }

    targetUser.profileCompleted = Math.min(100, (targetUser.profileCompleted || 80) + 10);

    // STRICT PRIVACY & SECURITY: Never allow role escalation via update-profile!
    // targetUser.role remains unchanged!

    users[userIndex] = targetUser;
    await saveAllUsers(users);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizeUser(targetUser)
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
}
