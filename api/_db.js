// Centralized Server-Side Database & Authentication Manager
// Persistent Storage: Vercel Blob Store (store_Wd26cD5SEgDThdiQ) with local fallback
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const BLOB_FILENAME = 'ph_users_database.json';
const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || '';

// In-memory cache for ultra-fast serverless performance and concurrency safety
let memoryUsersCache = null;
let lastCacheSync = 0;
const CACHE_TTL_MS = 2000; // 2-second cache TTL for high freshness
let writeLock = Promise.resolve();

// ==========================================
// 1. NORMALIZATION & VALIDATION HELPERS
// ==========================================

export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

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

export function validateIndianPhone(phone) {
  const digits = normalizeIndianPhone(phone);
  // Valid Indian mobile numbers are 10 digits starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(digits);
}

export function formatIndianPhone(phone) {
  const digits = normalizeIndianPhone(phone);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone ? String(phone).trim() : '';
}

// ==========================================
// 2. PASSWORD HASHING & TOKENS
// ==========================================

export function hashPassword(plainTextPassword) {
  return bcrypt.hashSync(plainTextPassword, 10);
}

export function verifyPassword(plainTextPassword, storedHash) {
  if (!storedHash || !plainTextPassword) return false;
  
  // 1. Standard bcrypt verification
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    return bcrypt.compareSync(plainTextPassword, storedHash);
  }

  // 2. Backward compatibility with legacy SHA-256 salted hashes
  const legacyHash = crypto.createHash('sha256').update(plainTextPassword + '_ph_salt_2026_secure').digest('hex');
  if (storedHash === legacyHash) {
    return true;
  }

  // 3. Backward compatibility with legacy seeds
  if (storedHash === 'perfect_admin_hash_v2' && plainTextPassword === 'Perfect@123') return true;
  if (storedHash === 'prakash_buyer_hash_v2' && plainTextPassword === 'password123') return true;

  return false;
}

// HMAC-SHA256 Stateless Token Generator & Verifier
export function createSessionToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');
  
  // Constant-time comparison to prevent timing attacks
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Sanitizes user objects for client consumption (NEVER expose password hashes)
export function sanitizeUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    firstName: u.firstName || (u.name ? u.name.split(' ')[0] : 'User'),
    lastName: u.lastName || '',
    email: u.email,
    phone: formatIndianPhone(u.phone),
    rawPhone: normalizeIndianPhone(u.phone),
    avatar: u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}&backgroundColor=008f83,064e49`,
    role: u.role || 'buyer',
    joinedDate: u.joinedDate || 'Recent',
    city: u.city || 'Chennai',
    address: u.address || '',
    notificationPrefs: u.notificationPrefs || { email: true, whatsapp: true, sms: false },
    profileCompleted: typeof u.profileCompleted === 'number' ? u.profileCompleted : 80,
    mustChangePassword: !!u.mustChangePassword,
    status: u.status || 'Active',
    registeredAt: u.registeredAt || null,
    enquiriesCount: u.enquiriesCount || 0
  };
}

// ==========================================
// 3. PERSISTENT STORAGE ENGINE (VERCEL BLOB)
// ==========================================

function getLocalFallbackPath() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch { /* ignore */ }
  }
  return path.join(dir, 'users_database.json');
}

function readLocalFallback() {
  try {
    const filePath = getLocalFallbackPath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Local fallback read error:', err.message);
  }
  return null;
}

function writeLocalFallback(users) {
  try {
    const filePath = getLocalFallbackPath();
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local fallback write error:', err.message);
  }
}

// Initial seed users if database is brand new
function getInitialSeedUsers() {
  const adminHash = hashPassword(ADMIN_INITIAL_PASSWORD);
  const prakashHash = hashPassword('password123');

  return [
    {
      id: 'usr_admin_srilakshman',
      name: 'Administrator',
      firstName: 'Admin',
      lastName: 'Lakshman',
      email: 'srilakshman73@gmail.com',
      phone: '+91 78455 85919',
      passwordHash: adminHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'admin',
      joinedDate: 'October 2026',
      city: 'Thiruninravur, Chennai',
      address: 'No: 3 Krishna Nagar, CTH Road, Thiruninravur – 602024',
      notificationPrefs: { email: true, whatsapp: true, sms: true },
      profileCompleted: 100,
      mustChangePassword: true,
      status: 'Active',
      registeredAt: new Date().toISOString()
    },
    {
      id: 'usr_prakash_101',
      name: 'Prakash Kumar',
      firstName: 'Prakash',
      lastName: 'Kumar',
      email: 'prakash@example.com',
      phone: '+91 98410 54321',
      passwordHash: prakashHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      role: 'buyer',
      joinedDate: 'January 2024',
      city: 'Chennai',
      address: 'Anna Nagar West, Chennai',
      notificationPrefs: { email: true, whatsapp: true, sms: false },
      profileCompleted: 92,
      mustChangePassword: false,
      status: 'Active',
      registeredAt: new Date().toISOString()
    }
  ];
}

/**
 * Ensures the administrator account exists with explicit admin role.
 * Preserves custom password if already set by administrator.
 */
function ensureAdminAccount(users) {
  const adminEmail = 'srilakshman73@gmail.com';
  let admin = users.find((u) => normalizeEmail(u.email) === adminEmail);

  if (!admin) {
    admin = {
      id: 'usr_admin_srilakshman',
      name: 'Administrator',
      firstName: 'Admin',
      lastName: 'Lakshman',
      email: adminEmail,
      phone: '+91 78455 85919',
      passwordHash: hashPassword(ADMIN_INITIAL_PASSWORD),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'admin',
      joinedDate: 'October 2026',
      city: 'Thiruninravur, Chennai',
      address: 'No: 3 Krishna Nagar, CTH Road, Thiruninravur – 602024',
      notificationPrefs: { email: true, whatsapp: true, sms: true },
      profileCompleted: 100,
      mustChangePassword: true,
      status: 'Active',
      registeredAt: new Date().toISOString()
    };
    users.unshift(admin);
  } else {
    // Ensure role is admin
    admin.role = 'admin';
    if (!admin.passwordHash) {
      admin.passwordHash = hashPassword(ADMIN_INITIAL_PASSWORD);
      admin.mustChangePassword = true;
    }
  }
}

/**
 * Loads all users from persistent storage.
 */
export async function getAllUsers() {
  const now = Date.now();
  if (memoryUsersCache && (now - lastCacheSync < CACHE_TTL_MS)) {
    return memoryUsersCache;
  }

  let users = null;

  // Try Vercel Blob first
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    const match = blobs.find((b) => b.pathname === BLOB_FILENAME);

    if (match && match.url) {
      const res = await fetch(`${match.url}?t=${now}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          users = json;
        }
      }
    }
  } catch (err) {
    console.warn('Vercel Blob fetch warning:', err.message);
  }

  // Fallback to local file or initial seeds
  if (!users) {
    users = readLocalFallback();
  }

  if (!users || !Array.isArray(users) || users.length === 0) {
    users = getInitialSeedUsers();
    // Persist initial seeds
    await saveAllUsers(users);
  } else {
    // Ensure admin account exists
    ensureAdminAccount(users);
  }

  memoryUsersCache = users;
  lastCacheSync = Date.now();
  return users;
}

/**
 * Saves all users atomically to persistent storage and caches.
 */
export async function saveAllUsers(users) {
  // Execute sequentially to prevent race conditions
  return writeLock = writeLock.then(async () => {
    ensureAdminAccount(users);
    memoryUsersCache = users;
    lastCacheSync = Date.now();

    // 1. Write to local fallback
    writeLocalFallback(users);

    // 2. Write to Vercel Blob
    try {
      const { put } = await import('@vercel/blob');
      await put(BLOB_FILENAME, JSON.stringify(users, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true
      });
      return true;
    } catch (err) {
      console.error('Vercel Blob write error:', err.message);
      return false;
    }
  });
}

// ==========================================
// 4. BUSINESS LOGIC & AUTH OPERATIONS
// ==========================================

/**
 * Register a new buyer.
 * Enforces unique normalized email and 10-digit Indian mobile number.
 */
export async function registerUser({ fullName, email, phone, password }) {
  if (!fullName || !email || !phone || !password) {
    throw new Error('Full name, email address, mobile number, and password are all required.');
  }

  const cleanEmail = normalizeEmail(email);
  const cleanPhone = normalizeIndianPhone(phone);
  const formattedPhone = formatIndianPhone(phone);
  const cleanName = fullName.trim();

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  // Validate mobile number
  if (!validateIndianPhone(phone)) {
    throw new Error('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
  }

  // Validate password strength
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = await getAllUsers();

  // Check for duplicate account by normalized email or normalized mobile number
  const existingUser = users.find((u) => {
    const uEmail = normalizeEmail(u.email);
    const uPhone = normalizeIndianPhone(u.phone);
    return uEmail === cleanEmail || (cleanPhone.length === 10 && uPhone === cleanPhone);
  });

  if (existingUser) {
    const isEmail = normalizeEmail(existingUser.email) === cleanEmail;
    throw new Error(
      isEmail
        ? 'An account with this email address already exists. Please log in.'
        : 'An account with this mobile number already exists. Please log in.'
    );
  }

  const nameParts = cleanName.split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';
  const passwordHash = hashPassword(password);
  const now = new Date();
  const joinedDateStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    firstName,
    lastName,
    email: cleanEmail,
    phone: formattedPhone,
    passwordHash,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=008f83,064e49`,
    role: 'buyer', // Public registration is strictly buyer
    joinedDate: joinedDateStr,
    city: 'Chennai',
    address: '',
    notificationPrefs: { email: true, whatsapp: true, sms: true },
    profileCompleted: 75,
    mustChangePassword: false,
    status: 'Active',
    registeredAt: now.toISOString(),
    enquiriesCount: 0
  };

  const updatedUsers = [newUser, ...users];
  await saveAllUsers(updatedUsers);

  const token = createSessionToken(newUser);
  return {
    user: sanitizeUser(newUser),
    token
  };
}

/**
 * Authenticate user with email OR Indian mobile number + password.
 */
export async function authenticateUser({ identifier, password }) {
  if (!identifier || !password) {
    throw new Error('Email address or mobile number and password are required.');
  }

  const users = await getAllUsers();
  const cleanId = identifier.trim();
  const cleanEmail = normalizeEmail(cleanId);
  const cleanPhone = normalizeIndianPhone(cleanId);

  const matchedUser = users.find((u) => {
    const uEmail = normalizeEmail(u.email);
    const uPhone = normalizeIndianPhone(u.phone);
    if (uEmail === cleanEmail) return true;
    if (cleanPhone.length === 10 && uPhone === cleanPhone) return true;
    return false;
  });

  if (!matchedUser) {
    const notFoundErr = new Error('No account found with this email address or mobile number.');
    notFoundErr.statusCode = 404;
    throw notFoundErr;
  }

  const isPasswordValid = verifyPassword(password, matchedUser.passwordHash);

  if (!isPasswordValid) {
    const invalidErr = new Error('Incorrect password. Please double check and try again.');
    invalidErr.statusCode = 401;
    throw invalidErr;
  }

  // Upgrade legacy hash to bcrypt if needed
  if (!matchedUser.passwordHash?.startsWith('$2')) {
    matchedUser.passwordHash = hashPassword(password);
    await saveAllUsers(users);
  }

  const token = createSessionToken(matchedUser);
  return {
    user: sanitizeUser(matchedUser),
    token
  };
}

/**
 * Extract and verify authentication from HTTP Request.
 */
export function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1];
  return verifySessionToken(token);
}

/**
 * Admin Authorization Guard.
 * Throws 401 if unauthenticated, 403 if not admin.
 */
export async function requireAdmin(req) {
  const tokenPayload = getAuthenticatedUser(req);
  if (!tokenPayload) {
    const err = new Error('Authentication required. Please log in.');
    err.statusCode = 401;
    throw err;
  }

  // Cross-verify against database
  const users = await getAllUsers();
  const dbUser = users.find((u) => u.id === tokenPayload.userId || normalizeEmail(u.email) === normalizeEmail(tokenPayload.email));

  if (!dbUser || dbUser.role !== 'admin') {
    const err = new Error('Access denied. Administrator privileges required.');
    err.statusCode = 403;
    throw err;
  }

  return dbUser;
}
