/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - AUTHENTICATION CONTEXT & PERSISTENCE
   Strict Server-Side Architecture: Enforces privacy, session persistence,
   and server authorization.
   ========================================================================== */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import {
  apiLogin,
  apiRegister,
  apiGetSession,
  apiGetAdminUsers,
  apiChangePassword,
  apiUpdateProfile,
  apiResetPassword
} from '../services/apiService';

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = 'ph_auth_token_v4';
const STORAGE_USER_KEY = 'ph_session_user_v4';

function getStoredToken() {
  try {
    return localStorage.getItem(STORAGE_TOKEN_KEY) || sessionStorage.getItem(STORAGE_TOKEN_KEY);
  } catch {
    return null;
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY) || sessionStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeSession(token, user, rememberMe = true) {
  try {
    const target = rememberMe ? localStorage : sessionStorage;
    target.setItem(STORAGE_TOKEN_KEY, token);
    target.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    // Clean opposite storage to avoid duplicate out-of-sync tokens
    const other = rememberMe ? sessionStorage : localStorage;
    other.removeItem(STORAGE_TOKEN_KEY);
    other.removeItem(STORAGE_USER_KEY);
  } catch (err) {
    console.warn('Storage write error:', err);
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    sessionStorage.removeItem(STORAGE_TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_USER_KEY);
  } catch (err) {
    console.warn('Storage clear error:', err);
  }
}

export function AuthProvider({ children }) {
  const { addToast } = useToast();
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  // Synchronize authenticated session with server on initial app load
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      const activeToken = getStoredToken();
      if (!activeToken) {
        if (mounted) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await apiGetSession(activeToken);
        if (mounted && res.success && res.user) {
          setUser(res.user);
          setToken(activeToken);
          // Update cached user in storage
          storeSession(activeToken, res.user, true);

          if (res.user.mustChangePassword) {
            setShowPasswordChangeModal(true);
          }
        }
      } catch (err) {
        console.warn('Active session invalidated:', err.message);
        clearSession();
        if (mounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();
    return () => {
      mounted = false;
    };
  }, []);

  // Login handler
  const login = async (identifier, password, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await apiLogin(identifier, password);
      const { user: authedUser, token: authToken } = res;

      setUser(authedUser);
      setToken(authToken);
      storeSession(authToken, authedUser, rememberMe);

      if (authedUser.mustChangePassword) {
        setShowPasswordChangeModal(true);
      }

      addToast(`Welcome back, ${authedUser.firstName || authedUser.name}!`, 'success');
      return authedUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler: persists user to production database
  const register = async ({ fullName, email, phone, password }) => {
    setIsLoading(true);
    try {
      const res = await apiRegister({ fullName, email, phone, password });
      const { user: registeredUser, token: authToken } = res;

      setUser(registeredUser);
      setToken(authToken);
      storeSession(authToken, registeredUser, true);

      addToast(`Account created successfully! Welcome to Perfect Homes, ${registeredUser.firstName}.`, 'success');
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    const name = user?.firstName || 'User';
    clearSession();
    setUser(null);
    setToken(null);
    setUsersList([]);
    setShowPasswordChangeModal(false);
    addToast(`Goodbye ${name}, you have been logged out.`, 'info');
  };

  // Complete first-time mandatory password change
  const completeFirstTimePasswordChange = async (newPassword) => {
    if (!token) throw new Error('Not authenticated');

    setIsLoading(true);
    try {
      const res = await apiChangePassword(token, { newPassword });
      const updatedUser = res.user;
      const newToken = res.token || token;

      setUser(updatedUser);
      setToken(newToken);
      storeSession(newToken, updatedUser, true);
      setShowPasswordChangeModal(false);

      addToast('Password updated securely! First-time setup complete.', 'success');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Change Password
  const changePassword = async (currentPassword, newPassword) => {
    if (!token) throw new Error('Not authenticated');

    const res = await apiChangePassword(token, { currentPassword, newPassword });
    const updatedUser = res.user;
    const newToken = res.token || token;

    setUser(updatedUser);
    setToken(newToken);
    storeSession(newToken, updatedUser, true);

    addToast('Password changed successfully!', 'success');
    return true;
  };

  // Update Profile
  const updateProfile = async (updatedData) => {
    if (!token) throw new Error('You must be logged in to update profile.');

    setIsLoading(true);
    try {
      const res = await apiUpdateProfile(token, updatedData);
      const updatedUser = res.user;

      setUser(updatedUser);
      storeSession(token, updatedUser, true);

      addToast('Profile updated successfully!', 'success');
      return updatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password (with OTP / Forgot Password)
  const resetPassword = async (identifier, newPassword) => {
    const res = await apiResetPassword(identifier, newPassword);
    addToast(res.message || 'Password reset successful! You can now log in with your new password.', 'success');
    return true;
  };

  // Admin Data Provider: Fetches fresh sanitized registered users via protected API
  const getRegisteredUsersForAdmin = useCallback(async () => {
    if (!token || user?.role !== 'admin') {
      throw new Error('Unauthorized: Administrator authorization required.');
    }

    setIsSyncing(true);
    try {
      const users = await apiGetAdminUsers(token);
      setUsersList(users);
      return users;
    } finally {
      setIsSyncing(false);
    }
  }, [token, user]);

  const syncUsers = useCallback(async () => {
    if (user?.role === 'admin' && token) {
      try {
        await getRegisteredUsersForAdmin();
      } catch {
        // Ignore background sync errors
      }
    }
  }, [user, token, getRegisteredUsersForAdmin]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        isSyncing,
        usersList,
        showPasswordChangeModal,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        completeFirstTimePasswordChange,
        resetPassword,
        syncUsers,
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
