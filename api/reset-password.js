// Vercel Serverless Function: POST /api/reset-password
import {
  getAllUsers,
  saveAllUsers,
  hashPassword,
  normalizeEmail,
  normalizeIndianPhone
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
    const { identifier, newPassword } = req.body || {};

    if (!identifier || !newPassword) {
      return res.status(400).json({ error: 'Identifier and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const cleanId = identifier.trim();
    const cleanEmail = normalizeEmail(cleanId);
    const cleanPhone = normalizeIndianPhone(cleanId);

    const users = await getAllUsers();
    const userIndex = users.findIndex((u) => {
      const uEmail = normalizeEmail(u.email);
      const uPhone = normalizeIndianPhone(u.phone);
      if (uEmail === cleanEmail) return true;
      if (cleanPhone.length === 10 && uPhone === cleanPhone) return true;
      return false;
    });

    if (userIndex === -1) {
      return res.status(404).json({ error: 'No account found with this email address or mobile number.' });
    }

    const targetUser = users[userIndex];
    targetUser.passwordHash = hashPassword(newPassword);
    targetUser.mustChangePassword = false;

    users[userIndex] = targetUser;
    await saveAllUsers(users);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset password: ' + err.message });
  }
}
