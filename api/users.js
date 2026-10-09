// Vercel Serverless Function: GET /api/users
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const CLOUD_DB_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a09d98f701a120a277792d44';

  try {
    const cloudRes = await fetch(CLOUD_DB_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });

    let users = [];
    if (cloudRes.ok) {
      const json = await cloudRes.json();
      users = json.data?.users || [];
    }

    if (!Array.isArray(users) || users.length === 0) {
      users = [
        {
          id: 'usr_admin_srilakshman',
          name: 'Administrator',
          firstName: 'Admin',
          lastName: 'Lakshman',
          email: 'srilakshman73@gmail.com',
          phone: '+91 78455 85919',
          role: 'admin',
          joinedDate: 'October 2026',
          city: 'Thiruninravur, Chennai',
          status: 'Active'
        },
        {
          id: 'usr_prakash_101',
          name: 'Prakash Kumar',
          firstName: 'Prakash',
          lastName: 'Kumar',
          email: 'prakash@example.com',
          phone: '+91 98410 54321',
          role: 'buyer',
          joinedDate: 'January 2024',
          city: 'Chennai',
          status: 'Active'
        }
      ];
    }

    // Sanitize user records (never return passwords or password hashes)
    const sanitized = users.map((u) => ({
      id: u.id,
      name: u.name,
      firstName: u.firstName || u.name?.split(' ')[0] || 'User',
      lastName: u.lastName || '',
      email: u.email,
      phone: u.phone,
      role: u.role || 'buyer',
      joinedDate: u.joinedDate || 'Recent',
      status: u.status || 'Active',
      city: u.city || 'Chennai',
      profileCompleted: u.profileCompleted || 80,
      registeredAt: u.registeredAt || null
    }));

    return res.status(200).json({
      success: true,
      count: sanitized.length,
      users: sanitized
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users from database',
      message: err.message
    });
  }
}
