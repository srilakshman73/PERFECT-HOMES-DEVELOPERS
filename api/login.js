// Vercel Serverless Function: POST /api/login
import { authenticateUser } from './_db.js';

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
    const { identifier, password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Please enter your registered email address or mobile number, and password.'
      });
    }

    const { user, token } = await authenticateUser({
      identifier,
      password
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.firstName}!`,
      user,
      token
    });
  } catch (err) {
    const statusCode = err.statusCode || 400;
    return res.status(statusCode).json({
      error: err.message || 'Login failed. Please verify your credentials.'
    });
  }
}
