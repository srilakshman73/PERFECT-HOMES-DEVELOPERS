// Vercel Serverless Function: POST /api/register
import crypto from 'crypto';

function hashPasswordSync(str) {
  return crypto.createHash('sha256').update(str + '_ph_salt_2026_secure').digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, email, phone, password } = req.body || {};

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields (fullName, email, phone, password) are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();
  const cleanName = fullName.trim();

  const CLOUD_DB_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a09d98f701a120a277792d44';

  try {
    // 1. Fetch current users
    const cloudRes = await fetch(CLOUD_DB_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });

    let currentUsers = [];
    if (cloudRes.ok) {
      const json = await cloudRes.json();
      currentUsers = json.data?.users || [];
    }
    if (!Array.isArray(currentUsers)) currentUsers = [];

    // 2. Check duplicate
    const exists = currentUsers.some(
      (u) =>
        u.email?.toLowerCase() === cleanEmail ||
        u.phone?.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
    );

    if (exists) {
      return res.status(409).json({ error: 'An account with this email address or mobile number already exists.' });
    }

    // 3. Create user
    const nameParts = cleanName.split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';
    const passwordHash = hashPasswordSync(password);
    const now = new Date();
    const joinedDateStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      firstName,
      lastName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=008f83,064e49`,
      role: 'buyer',
      joinedDate: joinedDateStr,
      city: 'Chennai',
      address: '',
      notificationPrefs: { email: true, whatsapp: true, sms: true },
      profileCompleted: 75,
      mustChangePassword: false,
      status: 'Active',
      registeredAt: now.toISOString()
    };

    const updatedUsers = [newUser, ...currentUsers];

    // 4. Save to persistent DB
    await fetch(CLOUD_DB_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'PH_PERFECT_HOMES_USERS_STORE_2026',
        data: { users: updatedUsers, updatedAt: new Date().toISOString() }
      })
    });

    const sessionUser = { ...newUser };
    delete sessionUser.passwordHash;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully and saved to persistent database',
      user: sessionUser
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process registration: ' + err.message });
  }
}
