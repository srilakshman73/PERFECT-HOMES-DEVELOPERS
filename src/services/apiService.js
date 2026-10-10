/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - AUTHENTICATION & PRODUCTION API SERVICE
   Strict Server-Side Architecture: Never downloads password hashes or other
   users' private details to client storage.
   ========================================================================== */

const API_BASE = '/api';

/**
 * Normalizes Indian mobile number to 10 digits
 */
export function normalizeIndianPhone(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Validates Indian mobile number format (10 digits starting with 6, 7, 8, or 9)
 */
export function validateIndianPhone(phone) {
  const digits = normalizeIndianPhone(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Formats phone number as '+91 XXXXX XXXXX'
 */
export function formatIndianPhone(phone) {
  const digits = normalizeIndianPhone(phone);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone ? String(phone).trim() : '';
}

/**
 * Normalizes email by trimming and converting to lowercase
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Generic API request helper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { error: `HTTP ${response.status}: Unexpected response` };
  }

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed (${response.status})`;
    const error = new Error(errorMsg);
    error.statusCode = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Register a new buyer account on the server.
 * Persists directly to the production database.
 */
export async function apiRegister({ fullName, email, phone, password }) {
  return await request('/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, phone, password })
  });
}

/**
 * Authenticate with Email OR Mobile Number and Password.
 */
export async function apiLogin(identifier, password) {
  return await request('/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
}

/**
 * Verify active session token and retrieve current user profile.
 */
export async function apiGetSession(token) {
  if (!token) throw new Error('No session token provided');
  return await request('/session', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Fetch all registered users (Strict Administrator Access Only).
 * Server validates administrator authorization before returning data.
 */
export async function apiGetAdminUsers(token) {
  if (!token) throw new Error('Admin token required');
  const res = await request('/users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.users || [];
}

/**
 * Update authenticated user's password.
 */
export async function apiChangePassword(token, { currentPassword, newPassword }) {
  if (!token) throw new Error('Authentication required');
  return await request('/change-password', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

/**
 * Update user's permitted profile fields (Name, Phone, City, Address, Avatar, Prefs).
 */
export async function apiUpdateProfile(token, profileData) {
  if (!token) throw new Error('Authentication required');
  return await request('/update-profile', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
}

/**
 * Reset password via forgot password flow.
 */
export async function apiResetPassword(identifier, newPassword) {
  return await request('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ identifier, newPassword })
  });
}
