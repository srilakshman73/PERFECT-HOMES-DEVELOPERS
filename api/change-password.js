// Vercel Serverless Function: POST /api/change-password
import {
  getAuthenticatedUser,
  getAllUsers,
  saveAllUsers,
  verifyPassword,
  hashPassword,
  sanitizeUser,
  createSessionToken,
  normalizeEmail
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

    const { currentPassword, newPassword } = req.body || {};

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const users = await getAllUsers();
    const userIndex = users.findIndex(
      (u) => u.id === tokenPayload.userId || normalizeEmail(u.email) === normalizeEmail(tokenPayload.email)
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const targetUser = users[userIndex];

    // If user has mustChangePassword or provides current password, verify it
    if (currentPassword) {
      const isCurrentValid = verifyPassword(currentPassword, targetUser.passwordHash);
      if (!isCurrentValid) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    } else if (!targetUser.mustChangePassword) {
      return res.status(400).json({ error: 'Current password is required to change password.' });
    }

    // Hash new password using bcrypt
    targetUser.passwordHash = hashPassword(newPassword);
    targetUser.mustChangePassword = false;

    users[userIndex] = targetUser;
    await saveAllUsers(users);

    const freshToken = createSessionToken(targetUser);

    return res.status(200).json({
      success: true,
      message: 'Password updated securely in persistent database.',
      user: sanitizeUser(targetUser),
      token: freshToken
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update password: ' + err.message });
  }
}
