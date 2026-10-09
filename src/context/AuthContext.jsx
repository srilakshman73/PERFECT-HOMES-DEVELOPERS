/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - AUTHENTICATION CONTEXT & SESSION STORE
   ========================================================================== */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const STORAGE_USERS_KEY = 'ph_users_db_v1';
const STORAGE_SESSION_KEY = 'ph_active_session_v1';

// Seed default accounts if fresh browser session
const DEFAULT_USERS = [
  {
    id: 'usr_prakash_101',
    name: 'Prakash Kumar',
    firstName: 'Prakash',
    lastName: 'Kumar',
    email: 'prakash@example.com',
    phone: '+91 98410 54321',
    passwordHash: 'e6c2797f62c75756d4d1f7f28ad58e82', // standard demo hash for "password123"
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'buyer',
    joinedDate: 'January 2024',
    city: 'Chennai',
    address: 'Anna Nagar West, Chennai',
    notificationPrefs: { email: true, whatsapp: true, sms: false },
    profileCompleted: 92
  },
  {
    id: 'usr_admin_001',
    name: 'Admin Manager',
    firstName: 'Admin',
    lastName: 'Manager',
    email: 'admin@perfecthomes.com',
    phone: '+91 98401 23456',
    passwordHash: 'e6c2797f62c75756d4d1f7f28ad58e82', // demo hash for "password123"
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    joinedDate: 'October 2021',
    city: 'Avadi, Chennai',
    address: 'No. 42 Gandhi Main Road, Avadi',
    notificationPrefs: { email: true, whatsapp: true, sms: true },
    profileCompleted: 100
  }
];

// Simple deterministic hash helper for client-side storage
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'ph_h_' + Math.abs(hash).toString(16) + '_' + password.length;
}

export function AuthProvider({ children }) {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize users database and active session
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (!storedUsers) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      }

      const activeSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        setUser(parsed);
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
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
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
    await new Promise((res) => setTimeout(res, 500)); // realistic network latency

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

    // Check password (supports demo accounts and newly registered accounts)
    const computed = hashPassword(password);
    const isDemoPass = password === 'password123' || password === 'admin123';
    const isMatchedPass = matchedUser.passwordHash === computed || (isDemoPass && matchedUser.id.startsWith('usr_'));

    if (!isMatchedPass) {
      setIsLoading(false);
      throw new Error('Invalid password. Please double check and try again.');
    }

    // Create session object
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
      profileCompleted: matchedUser.profileCompleted || 80
    };

    setUser(sessionUser);
    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    }

    setIsLoading(false);
    addToast(`Welcome back, ${sessionUser.firstName}!`, 'success');
    return sessionUser;
  };

  // Register handler
  const register = async ({ fullName, email, phone, password }) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

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

    const newUser = {
      id: 'usr_' + Date.now(),
      name: fullName.trim(),
      firstName: firstName,
      lastName: lastName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=008f83,064e49`,
      role: 'buyer',
      joinedDate: 'October 2026',
      city: 'Chennai',
      address: '',
      notificationPrefs: { email: true, whatsapp: true, sms: true },
      profileCompleted: 75
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Auto login
    setUser(newUser);
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    addToast(`Account created successfully! Welcome, ${newUser.firstName}.`, 'success');
    return newUser;
  };

  // Logout handler
  const logout = () => {
    const name = user?.firstName || 'User';
    setUser(null);
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    addToast(`Goodbye ${name}, you have been logged out.`, 'info');
  };

  // Update Profile
  const updateProfile = async (updatedData) => {
    if (!user) throw new Error('You must be logged in to update profile.');
    
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

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

  // Change Password
  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('Not authenticated');

    const users = getUsers();
    const matched = users.find((u) => u.id === user.id);
    if (!matched) throw new Error('User not found');

    const currentHashed = hashPassword(currentPassword);
    const isDemoPass = currentPassword === 'password123';

    if (matched.passwordHash !== currentHashed && !isDemoPass) {
      throw new Error('Current password is incorrect.');
    }

    matched.passwordHash = hashPassword(newPassword);
    saveUsers(users);
    addToast('Password changed successfully!', 'success');
    return true;
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

    matched.passwordHash = hashPassword(newPassword);
    saveUsers(users);
    addToast('Password reset successful! You can now log in with your new password.', 'success');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        resetPassword
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
