// Vercel Serverless Function: POST /api/register
import { registerUser } from './_db.js';

export default async function handler(req, res) {
  // CORS & Security headers
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
    const { fullName, email, phone, password } = req.body || {};

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        error: 'Please provide full name, email address, mobile number, and password.'
      });
    }

    const { user, token } = await registerUser({
      fullName,
      email,
      phone,
      password
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully and stored in persistent database.',
      user,
      token
    });
  } catch (err) {
    const isDuplicate = err.message && err.message.includes('already exists');
    const statusCode = isDuplicate ? 409 : (err.statusCode || 400);

    return res.status(statusCode).json({
      error: err.message || 'Registration failed. Please try again.'
    });
  }
}
