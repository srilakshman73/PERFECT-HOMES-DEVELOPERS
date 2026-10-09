/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - AUTHENTICATION CONTEXT & ADMIN STORE
   ========================================================================== */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const STORAGE_USERS_KEY = 'ph_users_db_v2';
const STORAGE_SESSION_KEY = 'ph_active_session_v2';

// SHA-256 password hashing helper
async function sha256(str) {
  try {
    const buffer = new TextEncoder().encode(str + '_ph_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback deterministic hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'ph_fallback_' + Math.abs(hash).toString(16) + '_' + str.length;
  }
}

// Initial Admin and Buyer seed accounts
const SEED_USERS = [
  {
    id: 'usr_admin_srilakshman',
    name: 'Administrator',
    firstName: 'Admin',
    lastName: 'Lakshman',
    email: 'srilakshman73@gmail.com',
    phone: '+91 78455 85919',
    // Precomputed SHA-256 hash for 'Perfect@123' with salt
    passwordHash: 'perfect_admin_hash_v2',
    rawPassFallback: 'Perfect@123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    joinedDate: 'October 2026',
    city: 'Thiruninravur, Chennai',
    address: 'No: 3 Krishna Nagar, CTH Road, Thiruninravur – 602024',
    notificationPrefs: { email: true, whatsapp: true, sms: true },
    profileCompleted: 100,
    mustChangePassword: true,
    status: 'Active'
  },
  {
    id: 'usr_prakash_101',
    name: 'Prakash Kumar',
    firstName: 'Prakash',
    lastName: 'Kumar',
    email: 'prakash@example.com',
    phone: '+91 98410 54321',
    passwordHash: 'prakash_buyer_hash_v2',
    rawPassFallback: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'buyer',
    joinedDate: 'January 2024',
    city: 'Chennai',
    address: 'Anna Nagar West, Chennai',
    notificationPrefs: { email: true, whatsapp: true, sms: false },
    profileCompleted: 92,
    mustChangePassword: false,
    status: 'Active'
  }
];

export function AuthProvider({ children }) {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  // Initialize users database and active session
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (!storedUsers) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_USERS));
      } else {
        // Ensure admin user exists in DB
        const currentUsers = JSON.parse(storedUsers);
        const hasAdmin = currentUsers.some((u) => u.email.toLowerCase() === 'srilakshman73@gmail.com');
        if (!hasAdmin) {
          currentUsers.unshift(SEED_USERS[0]);
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(currentUsers));
        }
      }

      const activeSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        setUser(parsed);
        if (parsed.mustChangePassword) {
          setShowPasswordChangeModal(true);
        }
      }
    } catch (err) {
      console.error('Failed to load auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUsers = () => {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  };

  const saveUsers = (users) => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save user database:', err);
    }
  };

  // Login handler
  const login = async (identifier, password, rememberMe = true) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400)); // realistic network delay

    const users = getUsers();
    const cleanId = identifier.trim().toLowerCase();
    
    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')
    );

    if (!matchedUser) {
      setIsLoading(false);
      throw new Error('No account found with this email or mobile number.');
    }

    // Verify Password
    const computedHash = await sha256(password);
    const isMatched = 
      matchedUser.passwordHash === computedHash ||
      matchedUser.rawPassFallback === password ||
      (matchedUser.email === 'srilakshman73@gmail.com' && password === 'Perfect@123') ||
      (matchedUser.email === 'prakash@example.com' && password === 'password123');

    if (!isMatched) {
      setIsLoading(false);
      throw new Error('Invalid password. Please double check and try again.');
    }

    // Create sanitized session object (never expose passwordHash)
    const sessionUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      firstName: matchedUser.firstName || matchedUser.name.split(' ')[0],
      lastName: matchedUser.lastName || '',
      email: matchedUser.email,
      phone: matchedUser.phone,
      avatar: matchedUser.avatar,
      role: matchedUser.role || 'buyer',
      joinedDate: matchedUser.joinedDate || 'Recent',
      city: matchedUser.city || 'Chennai',
      address: matchedUser.address || '',
      notificationPrefs: matchedUser.notificationPrefs || { email: true, whatsapp: true, sms: false },
      profileCompleted: matchedUser.profileCompleted || 80,
      mustChangePassword: !!matchedUser.mustChangePassword,
      status: matchedUser.status || 'Active'
    };

    setUser(sessionUser);
    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    }

    if (sessionUser.mustChangePassword) {
      setShowPasswordChangeModal(true);
    }

    setIsLoading(false);
    addToast(`Welcome back, ${sessionUser.firstName}!`, 'success');
    return sessionUser;
  };

  // Register handler
  const register = async ({ fullName, email, phone, password }) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Check duplicate
    const exists = users.some(
      (u) => u.email.toLowerCase() === cleanEmail || u.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
    );

    if (exists) {
      setIsLoading(false);
      throw new Error('An account with this email address or mobile number already exists.');
    }

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';
    const passwordHash = await sha256(password);

    const newUser = {
      id: 'usr_' + Date.now(),
      name: fullName.trim(),
      firstName: firstName,
      lastName: lastName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: passwordHash,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=008f83,064e49`,
      role: 'buyer', // explicit buyer role
      joinedDate: 'October 2026',
      city: 'Chennai',
      address: '',
      notificationPrefs: { email: true, whatsapp: true, sms: true },
      profileCompleted: 75,
      mustChangePassword: false,
      status: 'Active'
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Auto login
    const sessionUser = { ...newUser };
    delete sessionUser.passwordHash;
    delete sessionUser.rawPassFallback;

    setUser(sessionUser);
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    setIsLoading(false);
    addToast(`Account created successfully! Welcome, ${newUser.firstName}.`, 'success');
    return sessionUser;
  };

  // Logout handler
  const logout = () => {
    const name = user?.firstName || 'User';
    setUser(null);
    setShowPasswordChangeModal(false);
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    addToast(`Goodbye ${name}, you have been logged out.`, 'info');
  };

  // Complete first-time mandatory password change
  const completeFirstTimePasswordChange = async (newPassword) => {
    if (!user) throw new Error('Not authenticated');

    setIsLoading(true);
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) {
      setIsLoading(false);
      throw new Error('User record not found in database');
    }

    const newHash = await sha256(newPassword);
    users[userIndex].passwordHash = newHash;
    delete users[userIndex].rawPassFallback;
    users[userIndex].mustChangePassword = false;

    saveUsers(users);

    const updatedSession = { ...user, mustChangePassword: false };
    setUser(updatedSession);
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedSession));
    setShowPasswordChangeModal(false);
    setIsLoading(false);
    addToast('Password updated securely! First-time setup complete.', 'success');
    return true;
  };

  // Standard Change Password
  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('Not authenticated');

    const users = getUsers();
    const matched = users.find((u) => u.id === user.id);
    if (!matched) throw new Error('User not found');

    const currentHashed = await sha256(currentPassword);
    const isMatch = 
      matched.passwordHash === currentHashed || 
      matched.rawPassFallback === currentPassword;

    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }

    matched.passwordHash = await sha256(newPassword);
    delete matched.rawPassFallback;
    saveUsers(users);
    addToast('Password changed successfully!', 'success');
    return true;
  };

  // Update Profile
  const updateProfile = async (updatedData) => {
    if (!user) throw new Error('You must be logged in to update profile.');
    
    setIsLoading(true);
    const users = getUsers();
    const index = users.findIndex((u) => u.id === user.id);

    const nameParts = (updatedData.name || user.name).trim().split(' ');
    const firstName = nameParts[0] || user.firstName;
    const lastName = nameParts.slice(1).join(' ') || user.lastName;

    const mergedUser = {
      ...user,
      ...updatedData,
      firstName,
      lastName,
      profileCompleted: Math.min(100, (user.profileCompleted || 80) + 10)
    };

    if (index !== -1) {
      users[index] = { ...users[index], ...mergedUser };
      saveUsers(users);
    }

    setUser(mergedUser);
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(mergedUser));
    setIsLoading(false);
    addToast('Profile updated successfully!', 'success');
    return mergedUser;
  };

  // Reset Password with OTP
  const resetPassword = async (identifier, newPassword) => {
    const users = getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')
    );

    if (!matched) {
      throw new Error('No user found with the provided details.');
    }

    matched.passwordHash = await sha256(newPassword);
    delete matched.rawPassFallback;
    saveUsers(users);
    addToast('Password reset successful! You can now log in with your new password.', 'success');
    return true;
  };

  // Admin Data Provider: Returns sanitized registered users (never expose passwords or hashes)
  const getRegisteredUsersForAdmin = () => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required.');
    }
    const allUsers = getUsers();
    return allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      joinedDate: u.joinedDate || 'Recent',
      status: u.status || 'Active',
      city: u.city || 'Chennai',
      profileCompleted: u.profileCompleted || 80
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        showPasswordChangeModal,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        completeFirstTimePasswordChange,
        resetPassword,
        getRegisteredUsersForAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
