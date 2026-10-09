/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - MY PROFILE PAGE (PROTECTED)
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Bell,
  Shield,
  LogOut,
  Save,
  CheckCircle2,
  Heart,
  FileText,
  KeyRound,
  Sparkles,
  Camera
} from 'lucide-react';

export default function ProfilePage({ navigate, initialTab = 'personal' }) {
  const { user, isAuthenticated, updateProfile, changePassword, logout } = useAuth();
  const { wishlistCount, getUserEnquiries } = useProperties();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || 'Chennai',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  // Password change state
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passError, setPassError] = useState('');

  // Notification prefs state
  const [notifPrefs, setNotifPrefs] = useState(
    user?.notificationPrefs || { email: true, whatsapp: true, sms: false }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('login');
      return;
    }
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || 'Chennai',
        address: user.address || '',
        avatar: user.avatar || ''
      });
      setNotifPrefs(user.notificationPrefs || { email: true, whatsapp: true, sms: false });
    }
  }, [user, isAuthenticated, navigate]);

  if (!user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        city: profileForm.city,
        address: profileForm.address,
        avatar: profileForm.avatar,
        notificationPrefs: notifPrefs
      });
      setIsEditing(false);
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    if (!passForm.currentPassword) {
      setPassError('Please enter your current password');
      return;
    }
    if (!passForm.newPassword || passForm.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    try {
      await changePassword(passForm.currentPassword, passForm.newPassword);
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.message || 'Failed to change password');
    }
  };

  const userEnquiries = getUserEnquiries();

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Profile Top Greeting Banner */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
            color: '#FFFFFF',
            padding: '2rem 2.5rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user.name}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #31D6C5',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  backgroundColor: '#10B981',
                  border: '2px solid #FFFFFF',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ color: '#FFFFFF', fontSize: '1.8rem', margin: 0 }}>
                  Hi, {user.name}
                </h1>
                <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                  {user.role === 'admin' ? 'Administrator' : 'Verified Buyer'}
                </span>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', margin: 0 }}>
                {user.email} • {user.phone} • Member since {user.joinedDate}
              </p>
            </div>
          </div>

          {/* Quick Stat Counters */}
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div
              onClick={() => navigate('wishlist')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#31D6C5' }}>{wishlistCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>Saved Properties</div>
            </div>

            <div
              onClick={() => navigate('enquiries')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#31D6C5' }}>{userEnquiries.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>My Enquiries</div>
            </div>
          </div>
        </div>

        {/* Profile Main Body: Sidebar + Active Tab Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="profile-layout-grid">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', height: 'fit-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { id: 'personal', label: 'Personal Information', icon: User },
                { id: 'contact', label: 'Contact Details', icon: Phone },
                { id: 'password', label: 'Change Password', icon: KeyRound },
                { id: 'notifications', label: 'Notification Preferences', icon: Bell },
                { id: 'security', label: 'Privacy & Security', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.92rem',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    backgroundColor: activeTab === tab.id ? 'var(--turquoise-light)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary-teal)' : 'var(--text-heading)',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <tab.icon size={18} color={activeTab === tab.id ? 'var(--primary-teal)' : 'var(--text-muted)'} />
                  <span>{tab.label}</span>
                </button>
              ))}

              <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => navigate('wishlist')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-heading)',
                    fontSize: '0.92rem',
                    fontWeight: 500
                  }}
                >
                  <Heart size={18} color="var(--primary-teal)" />
                  <span>My Wishlist ({wishlistCount})</span>
                </button>

                <button
                  onClick={() => navigate('enquiries')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-heading)',
                    fontSize: '0.92rem',
                    fontWeight: 500
                  }}
                >
                  <FileText size={18} color="var(--primary-teal)" />
                  <span>My Enquiries ({userEnquiries.length})</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('home');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    color: 'var(--danger)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    marginTop: '0.5rem'
                  }}
                >
                  <LogOut size={18} color="var(--danger)" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT TAB CONTENT */}
          <main>
            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-teal)' }}>Personal Information</h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      Manage your profile name, avatar, and residential location.
                    </p>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                      Edit Profile
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Avatar Picker */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                    <img
                      src={profileForm.avatar || user.avatar}
                      alt={user.name}
                      style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    {isEditing && (
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Profile Avatar Image URL</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="https://..."
                          value={profileForm.avatar}
                          onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className="form-input"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        style={{ backgroundColor: isEditing ? '#FFFFFF' : 'var(--bg-main)' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Primary City</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className="form-input"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        style={{ backgroundColor: isEditing ? '#FFFFFF' : 'var(--bg-main)' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Address</label>
                    <textarea
                      rows={2}
                      disabled={!isEditing}
                      className="form-textarea"
                      placeholder="Enter your street address..."
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      style={{ backgroundColor: isEditing ? '#FFFFFF' : 'var(--bg-main)' }}
                    />
                  </div>

                  {isEditing && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" disabled={isSaving} className="btn btn-primary">
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* TAB 2: CONTACT DETAILS */}
            {activeTab === 'contact' && (
              <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-teal)', marginBottom: '0.35rem' }}>Contact Information</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Keep your phone and email updated to receive site visit schedules and brochure alerts.
                </p>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address (Read Only)</label>
                    <input
                      type="email"
                      disabled
                      className="form-input"
                      value={profileForm.email}
                      style={{ backgroundColor: 'var(--bg-main)' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email address cannot be changed for security reasons.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ width: 'fit-content' }}>
                    <Save size={16} /> Update Contact Details
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: CHANGE PASSWORD */}
            {activeTab === 'password' && (
              <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-teal)', marginBottom: '0.35rem' }}>Change Account Password</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Ensure your account is protected with a secure password.
                </p>

                {passError && (
                  <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.86rem' }}>
                    {passError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '480px' }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      className="form-input"
                      placeholder="Enter current password"
                      value={passForm.currentPassword}
                      onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      className="form-input"
                      placeholder="Minimum 6 characters"
                      value={passForm.newPassword}
                      onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      className="form-input"
                      placeholder="Re-enter new password"
                      value={passForm.confirmPassword}
                      onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                    <KeyRound size={16} /> Update Password
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: NOTIFICATION PREFERENCES */}
            {activeTab === 'notifications' && (
              <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-teal)', marginBottom: '0.35rem' }}>Notification Preferences</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Choose how Perfect Homes &amp; Developers reaches out with property updates and loan confirmations.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { key: 'whatsapp', label: 'WhatsApp Updates', desc: 'Receive instant price sheet PDFs, layout maps, and site visit cab confirmations directly on WhatsApp.' },
                    { key: 'email', label: 'Email Newsletters & Launch Alerts', desc: 'Get monthly reports on new CMDA/DTCP plotted developments and Chennai infrastructure trends.' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Important appointment reminders and OTP verifications.' }
                  ].map((pref) => (
                    <div
                      key={pref.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ maxWidth: '80%' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep-teal)' }}>{pref.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{pref.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPrefs[pref.key] || false}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, [pref.key]: e.target.checked })}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-primary"
                    style={{ width: 'fit-content', marginTop: '1rem' }}
                  >
                    <Save size={16} /> Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: PRIVACY & SECURITY */}
            {activeTab === 'security' && (
              <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-teal)', marginBottom: '0.35rem' }}>Privacy &amp; Account Security</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Manage account sessions and data privacy controls.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--deep-teal)' }}>Active Session Status</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Logged in from Browser on Windows (Session persistence active).
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--deep-teal)' }}>Data Protection Policy</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Your personal details are encrypted and never shared with 3rd-party brokers.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      navigate('home');
                    }}
                    className="btn btn-secondary"
                    style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', width: 'fit-content' }}
                  >
                    <LogOut size={16} /> Sign Out of All Devices
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .profile-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
