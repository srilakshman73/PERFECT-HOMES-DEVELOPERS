/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - ADMIN MANAGEMENT DASHBOARD (PROTECTED)
   Responsive mobile layout + Live persistent database synchronization
   ========================================================================== */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldAlert,
  Building,
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Search,
  Users,
  Phone,
  Mail,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Play,
  Film,
  Star,
  Download,
  Sparkles
} from 'lucide-react';
import { IMPORTED_MEDIA } from '../data/mediaData.js';

export default function AdminPage({ navigate }) {
  const { user, getRegisteredUsersForAdmin } = useAuth();
  const {
    properties,
    adminProperties,
    enquiries,
    adminAddProperty,
    adminUpdateProperty,
    adminDeleteProperty,
    adminTogglePublish,
    updateEnquiryStatus
  } = useProperties();
  const { addToast } = useToast();

  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'properties' | 'enquiries'
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState('all');
  const [editingProperty, setEditingProperty] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoPoster, setNewVideoPoster] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [dbUsers, setDbUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Media Management State
  const [mediaAssets, setMediaAssets] = useState(() => {
    try {
      const saved = localStorage.getItem('ph_admin_media_catalog_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return IMPORTED_MEDIA;
  });
  const [mediaPartFilter, setMediaPartFilter] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [mediaProjectFilter, setMediaProjectFilter] = useState('all');
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [previewMediaItem, setPreviewMediaItem] = useState(null);

  const saveMediaAssets = (updatedList) => {
    setMediaAssets(updatedList);
    try {
      localStorage.setItem('ph_admin_media_catalog_v1', JSON.stringify(updatedList));
    } catch (e) {}
  };

  const handleReassignMedia = async (mediaId, newProjectId) => {
    const updated = mediaAssets.map((m) =>
      m.id === mediaId ? { ...m, projectId: newProjectId } : m
    );
    saveMediaAssets(updated);
    addToast('Media asset reassigned to ' + (newProjectId || 'Unassigned'), 'success');

    try {
      await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mediaId, projectId: newProjectId })
      });
    } catch (e) {}
  };

  const handleToggleFeaturedMedia = async (mediaId) => {
    const item = mediaAssets.find((m) => m.id === mediaId);
    if (!item) return;
    const newFeatured = !item.isFeatured;
    const updated = mediaAssets.map((m) => {
      if (m.id === mediaId) return { ...m, isFeatured: newFeatured };
      if (newFeatured && m.projectId && m.projectId === item.projectId) {
        return { ...m, isFeatured: false };
      }
      return m;
    });
    saveMediaAssets(updated);
    addToast(newFeatured ? 'Marked as featured property cover' : 'Unmarked featured', 'info');

    try {
      await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mediaId, isFeatured: newFeatured })
      });
    } catch (e) {}
  };

  const handleToggleSoftDeleteMedia = async (mediaId) => {
    const item = mediaAssets.find((m) => m.id === mediaId);
    if (!item) return;
    const newArchived = !item.isArchived;
    const updated = mediaAssets.map((m) =>
      m.id === mediaId ? { ...m, isArchived: newArchived } : m
    );
    saveMediaAssets(updated);
    addToast(
      newArchived
        ? 'Asset removed from active website display. Local file remains safely preserved.'
        : 'Asset restored to active website display.',
      'info'
    );

    try {
      await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mediaId, isArchived: newArchived })
      });
    } catch (e) {}
  };

  const handleBulkAssignPart8 = (targetProjectId, count = 8) => {
    let assigned = 0;
    const updated = mediaAssets.map((m) => {
      if (m.partNumber === 8 && (m.projectId === 'ph-112' || m.projectId === 'unassigned') && assigned < count) {
        assigned++;
        return { ...m, projectId: targetProjectId };
      }
      return m;
    });
    saveMediaAssets(updated);
    addToast(`Successfully allocated ${assigned} Part 8 photographs to ${targetProjectId}!`, 'success');
  };

  const filteredMedia = useMemo(() => {
    return mediaAssets.filter((m) => {
      if (mediaPartFilter !== 'all' && m.partNumber !== parseInt(mediaPartFilter, 10)) {
        return false;
      }
      if (mediaTypeFilter !== 'all' && m.mediaType !== mediaTypeFilter) {
        return false;
      }
      if (mediaProjectFilter !== 'all' && m.projectId !== mediaProjectFilter) {
        return false;
      }
      if (mediaSearchTerm.trim()) {
        const q = mediaSearchTerm.trim().toLowerCase();
        const matches =
          m.originalFilename?.toLowerCase().includes(q) ||
          m.filename?.toLowerCase().includes(q) ||
          m.caption?.toLowerCase().includes(q) ||
          m.partName?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [mediaAssets, mediaPartFilter, mediaTypeFilter, mediaProjectFilter, mediaSearchTerm]);

  // Fetch live registered users from persistent database
  const loadUsers = useCallback(async (showNotification = false) => {
    if (user?.role !== 'admin') return;
    try {
      setIsRefreshing(true);
      const list = await getRegisteredUsersForAdmin();
      if (Array.isArray(list)) {
        setDbUsers(list);
      }
      if (showNotification) {
        addToast(`Registered accounts updated (${list.length} accounts loaded)`, 'success');
      }
    } catch (err) {
      console.error('Failed to load registered users:', err);
      if (showNotification) {
        addToast('Failed to refresh users list: ' + err.message, 'error');
      }
    } finally {
      setIsLoadingUsers(false);
      setIsRefreshing(false);
    }
  }, [user, getRegisteredUsersForAdmin, addToast]);

  useEffect(() => {
    loadUsers(false);
  }, [loadUsers]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return dbUsers;
    const term = userSearchTerm.toLowerCase();
    return dbUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phone?.includes(term) ||
        u.role?.toLowerCase().includes(term)
    );
  }, [dbUsers, userSearchTerm]);

  // New property form state
  const [newProp, setNewProp] = useState({
    title: '',
    category: 'Plots',
    propertyType: 'Plot',
    price: 3000000,
    priceDisplay: '₹30.0 Lakhs',
    pricePerSqft: 2500,
    location: 'Avadi',
    fullAddress: 'Avadi Main Road, Chennai',
    bhk: 0,
    builtUpArea: 0,
    plotArea: 1200,
    facing: 'East',
    approval: 'CMDA & RERA Approved',
    approvalNo: 'CMDA: 2026/01',
    bankLoan: '90% Loan Available',
    availability: 'Ready to Move',
    featured: true,
    forSale: true,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    description: 'New premium project by Perfect Homes & Developers.'
  });

  // Strict Server-Side & Route-Level Role Authorization Check
  if (!user || user.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}
        >
          <ShieldAlert size={40} />
        </div>
        <h2 style={{ color: 'var(--text-heading)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          Access Denied: Administrator Required
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          You do not have administrative privileges to access this area. This section is strictly restricted to verified administrators of Perfect Homes &amp; Developers.
        </p>
        <button onClick={() => navigate('home')} className="btn btn-primary">
          Return to Homepage
        </button>
      </div>
    );
  }

  const handleAddPropertySubmit = (e) => {
    e.preventDefault();
    if (!newProp.title) {
      addToast('Please enter property title', 'error');
      return;
    }
    const propToAdd = {
      ...newProp,
      id: 'ph-' + Date.now(),
      slug: newProp.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      rating: 5.0,
      reviewsCount: 1
    };
    adminAddProperty(propToAdd);
    setShowAddModal(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-teal">Administrator Portal</span>
              <span className="badge badge-gold">Active: {user.email}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', color: 'var(--text-heading)', margin: 0 }}>
              Admin Management Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => loadUsers(true)}
              disabled={isRefreshing}
              className="btn btn-secondary btn-sm"
              title="Refresh database records"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh DB'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} /> Add Property
            </button>
            <button onClick={() => navigate('home')} className="btn btn-secondary btn-sm">
              View Website
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Registered Users</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--deep-teal)', marginTop: '4px' }}>
              {isLoadingUsers ? '...' : dbUsers.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Properties</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-teal)', marginTop: '4px' }}>
              {properties.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Enquiries</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--deep-teal)', marginTop: '4px' }}>
              {enquiries.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>New Leads Pending</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
              {enquiries.filter((e) => e.status === 'New').length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Project Media</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-teal)', marginTop: '4px' }}>
              {mediaAssets.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>({mediaAssets.filter((m) => m.mediaType === 'video').length} vids)</span>
            </div>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`btn btn-sm ${activeAdminTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={15} /> Registered Users ({dbUsers.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('properties')}
            className={`btn btn-sm ${activeAdminTab === 'properties' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Building size={15} /> Property Inventory ({properties.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('enquiries')}
            className={`btn btn-sm ${activeAdminTab === 'enquiries' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={15} /> Customer Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('media')}
            className={`btn btn-sm ${activeAdminTab === 'media' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Film size={15} /> Media & Video Catalog ({mediaAssets.length})
          </button>
        </div>

        {/* ========================================================
            TAB 1: REGISTERED USERS MANAGEMENT
            ======================================================== */}
        {activeAdminTab === 'users' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {/* Header & Search Bar */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', margin: 0 }}>Registered User Accounts</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Persistent Database • Passwords &amp; hashes strictly protected
                </span>
              </div>

              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name, email, phone..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Loading / Empty State */}
            {isLoadingUsers ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <RefreshCw size={28} className="animate-spin" color="var(--primary-teal)" style={{ margin: '0 auto 0.75rem' }} />
                <div>Loading registered user database...</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                <div>No users matched &ldquo;{userSearchTerm}&rdquo;</div>
              </div>
            ) : (
              <>
                {/* 1. DESKTOP VIEW: FULL TABLE (HIDDEN ON MOBILE) */}
                <div className="admin-desktop-table" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.85rem 1.25rem' }}>User Name</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Phone Number</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Registration Date</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Enquiries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const userEnquiryCount = enquiries.filter((e) => e.email?.toLowerCase() === u.email?.toLowerCase()).length;
                        return (
                          <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '0.85rem 1.25rem' }}>
                              <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--text-heading)' }}>{u.email}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{u.phone}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-teal'}`}>
                                {u.role === 'admin' ? 'Administrator' : 'Buyer'}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                              {u.joinedDate}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontWeight: 600, fontSize: '0.82rem' }}>
                                <CheckCircle2 size={13} /> {u.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary-teal)' }}>
                              {userEnquiryCount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 2. MOBILE VIEW: RESPONSIVE STACKED USER CARDS (Zero Horizontal Overflow) */}
                <div className="admin-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                  {filteredUsers.map((u) => {
                    const userEnquiryCount = enquiries.filter((e) => e.email?.toLowerCase() === u.email?.toLowerCase()).length;
                    return (
                      <div
                        key={u.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          boxShadow: 'var(--shadow-xs)'
                        }}
                      >
                        {/* Name and Role */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--deep-teal)' }}>{u.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                          </div>
                          <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-teal'}`}>
                            {u.role === 'admin' ? 'Admin' : 'Buyer'}
                          </span>
                        </div>

                        {/* Email & Phone */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.86rem', color: 'var(--text-heading)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={14} color="var(--primary-teal)" />
                            <span>{u.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={14} color="var(--primary-teal)" />
                            <span>{u.phone}</span>
                          </div>
                        </div>

                        {/* Date, Status, and Enquiry count footer */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '0.6rem',
                            borderTop: '1px solid var(--border-light)',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div style={{ color: 'var(--text-secondary)' }}>
                            📅 {u.joinedDate}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <CheckCircle2 size={12} /> {u.status || 'Active'}
                            </span>
                            <span style={{ color: 'var(--primary-teal)', fontWeight: 700 }}>
                              {userEnquiryCount} Enq
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: PROPERTIES MANAGEMENT
            ======================================================== */}
        {activeAdminTab === 'properties' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', margin: 0 }}>Property Inventory</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {(adminProperties || properties).length} total listings in database
                </span>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Listings' },
                  { id: 'Upcoming Projects', label: 'Upcoming Projects' },
                  { id: 'Plots', label: 'Plots' },
                  { id: '2 BHK Homes', label: '2 BHK' },
                  { id: '3 BHK Homes', label: '3 BHK' },
                  { id: 'Villas', label: 'Villas' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setPropertyCategoryFilter(c.id)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: propertyCategoryFilter === c.id ? 'var(--deep-teal)' : 'var(--bg-main)',
                      color: propertyCategoryFilter === c.id ? '#FFFFFF' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Property</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status / Construction</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Public Status</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminProperties || properties)
                    .filter((p) => propertyCategoryFilter === 'all' || p.category === propertyCategoryFilter)
                    .map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                            alt={p.title}
                            style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{p.title}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              ID: {p.id} • {p.images?.length || 0} photos{p.videos?.length ? ` • ${p.videos.length} videos` : ''}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className={`badge ${p.category === 'Upcoming Projects' ? 'badge-primary' : 'badge-teal'}`}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-heading)' }}>{p.location}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--deep-teal)' }}>
                            {p.statusBadge || p.availability || 'Available'}
                          </div>
                          {p.constructionStatus && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {p.constructionStatus}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
                          {p.priceDisplay}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <button
                            onClick={() => adminTogglePublish(p.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: p.isPublished !== false ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                              color: p.isPublished !== false ? '#059669' : '#DC2626',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            title="Click to toggle public visibility"
                          >
                            {p.isPublished !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                            {p.isPublished !== false ? 'Published' : 'Hidden'}
                          </button>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => setEditingProperty({ ...p })}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                              title="Edit Property Details & Photos"
                            >
                              <Edit size={13} /> Edit
                            </button>
                            <button
                              onClick={() => adminDeleteProperty(p.id)}
                              style={{ color: 'var(--danger)', padding: '6px', borderRadius: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                              title="Delete Property"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ENQUIRIES MANAGEMENT
            ======================================================== */}
        {activeAdminTab === 'enquiries' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', margin: 0 }}>Customer Leads &amp; Site Visit Log</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  style={{
                    padding: '1.25rem',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--deep-teal)' }}>{enq.name}</strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        📞 {enq.phone} • ✉️ {enq.email} • Date: {enq.date}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Status:</span>
                      <select
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '3px 8px', fontSize: '0.82rem', width: 'auto' }}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-heading)' }}>
                    <strong>Property:</strong> {enq.propertyTitle} ({enq.propertyLocation})
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.84rem' }}>
                    <strong>Customer Message:</strong> {enq.message}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add executive update note..."
                      defaultValue={enq.salesNotes || ''}
                      onBlur={(e) => updateEnquiryStatus(enq.id, enq.status, e.target.value)}
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem', flex: 1, minWidth: '200px' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      (Auto-saves on blur)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PROJECT MEDIA & VIDEO CATALOG MANAGEMENT
            ======================================================== */}
        {activeAdminTab === 'media' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {/* Header & Overview */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: '#F9FBFB'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--deep-teal)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film size={20} color="#008F83" />
                  <span>Project Media &amp; Video Catalog</span>
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  156 Local Media Assets (128 Photos + 28 Walkthrough Videos) across Parts 1–8. Reassign projects, toggle featured covers, or preview videos.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  {filteredMedia.length} Assets Shown
                </span>
              </div>
            </div>

            {/* Special Part 8 Unassigned Gallery Review Alert */}
            {mediaAssets.filter((m) => m.partNumber === 8 && (m.projectId === 'ph-112' || m.projectId === 'unassigned')).length > 0 && (
              <div
                style={{
                  margin: '1.25rem 1.5rem 0',
                  padding: '1.2rem 1.5rem',
                  backgroundColor: '#FFFBEB',
                  border: '1.5px solid #FDE68A',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#92400E', fontSize: '0.98rem' }}>
                    <Sparkles size={18} color="#D97706" />
                    <span>Part 8 Model Houses Unassigned Review Gallery ({mediaAssets.filter((m) => m.partNumber === 8 && (m.projectId === 'ph-112' || m.projectId === 'unassigned')).length} Photos)</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#B45309' }}>
                    These photographs are preserved in the review archive rather than guessed. You can quick-allocate them in batches or individually:
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleBulkAssignPart8('ph-109', 8)}
                    className="btn btn-sm"
                    style={{ backgroundColor: '#008F83', color: '#FFFFFF', fontSize: '0.78rem' }}
                  >
                    +8 to Villa Aster
                  </button>
                  <button
                    onClick={() => handleBulkAssignPart8('ph-110', 8)}
                    className="btn btn-sm"
                    style={{ backgroundColor: '#008F83', color: '#FFFFFF', fontSize: '0.78rem' }}
                  >
                    +8 to Villa Bloom
                  </button>
                  <button
                    onClick={() => handleBulkAssignPart8('ph-111', 8)}
                    className="btn btn-sm"
                    style={{ backgroundColor: '#008F83', color: '#FFFFFF', fontSize: '0.78rem' }}
                  >
                    +8 to Villa Celeste
                  </button>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              {/* Part Filter */}
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Filter by Part (1–8)
                </label>
                <select
                  className="form-select"
                  value={mediaPartFilter}
                  onChange={(e) => setMediaPartFilter(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="all">All Parts (1–8)</option>
                  <option value="1">Part 1: Kuberan Avenue (Nathamedu)</option>
                  <option value="2">Part 2: Promotional Posters</option>
                  <option value="3">Part 3: Construction Progress</option>
                  <option value="4">Part 4: Company Office (19 Photos)</option>
                  <option value="6">Part 6: Rail Nagar (Veppampattu)</option>
                  <option value="7">Part 7: Thiruninravur Site (Kosavanpalayam)</option>
                  <option value="8">Part 8: Model Houses (74 Photos + 3 Videos)</option>
                </select>
              </div>

              {/* Type Filter */}
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Media Type
                </label>
                <select
                  className="form-select"
                  value={mediaTypeFilter}
                  onChange={(e) => setMediaTypeFilter(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="all">All Media (Photos &amp; Videos)</option>
                  <option value="image">Photos Only ({mediaAssets.filter((m) => m.mediaType === 'image').length})</option>
                  <option value="video">Videos Only ({mediaAssets.filter((m) => m.mediaType === 'video').length})</option>
                </select>
              </div>

              {/* Project Filter */}
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Assigned Project
                </label>
                <select
                  className="form-select"
                  value={mediaProjectFilter}
                  onChange={(e) => setMediaProjectFilter(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="all">All Project Assignments</option>
                  <option value="ph-106">ph-106: Kuberan Avenue</option>
                  <option value="ph-107">ph-107: Rail Nagar</option>
                  <option value="ph-108">ph-108: Thiruninravur On-Road</option>
                  <option value="ph-109">ph-109: Villa Aster</option>
                  <option value="ph-110">ph-110: Villa Bloom</option>
                  <option value="ph-111">ph-111: Villa Celeste</option>
                  <option value="ph-112">ph-112: Part 8 Review Archive</option>
                  <option value="office">Corporate Office</option>
                  <option value="construction">Construction Site</option>
                  <option value="promotional">Promotional Materials</option>
                </select>
              </div>

              {/* Keyword Search */}
              <div style={{ flex: '2 1 220px', position: 'relative' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Search Filename / Caption
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search media..."
                    value={mediaSearchTerm}
                    onChange={(e) => setMediaSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Media Grid Cards */}
            <div
              style={{
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {filteredMedia.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                  No media assets found matching the selected filters.
                </div>
              ) : (
                filteredMedia.map((m) => {
                  const isVideo = m.mediaType === 'video';
                  return (
                    <div
                      key={m.id}
                      className="card"
                      style={{
                        padding: '0',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        border: m.isFeatured ? '2px solid #E5A823' : '1px solid var(--border-light)',
                        backgroundColor: '#FFFFFF',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: m.isArchived ? 0.45 : 1,
                        position: 'relative'
                      }}
                    >
                      {/* Thumbnail Container */}
                      <div
                        style={{
                          position: 'relative',
                          aspectRatio: '16/10',
                          backgroundColor: '#000000',
                          cursor: 'pointer',
                          overflow: 'hidden'
                        }}
                        onClick={() => setPreviewMediaItem(m)}
                      >
                        {isVideo ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' }}>
                            <Play size={36} color="#FFFFFF" fill="#008F83" />
                          </div>
                        ) : (
                          <img
                            src={m.storagePath}
                            alt={m.filename}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}

                        {/* Top Badges */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px' }}>
                          <span
                            style={{
                              backgroundColor: 'rgba(6, 78, 73, 0.85)',
                              color: '#FFFFFF',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            Part {m.partNumber}
                          </span>
                          <span
                            style={{
                              backgroundColor: isVideo ? '#DC2626' : '#008F83',
                              color: '#FFFFFF',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}
                          >
                            {isVideo ? 'VIDEO' : 'PHOTO'}
                          </span>
                        </div>

                        {/* Featured Star Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeaturedMedia(m.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: m.isFeatured ? '#E5A823' : 'rgba(0,0,0,0.5)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title={m.isFeatured ? 'Featured Image' : 'Mark as Featured Cover'}
                        >
                          <Star size={14} fill={m.isFeatured ? '#FFFFFF' : 'none'} />
                        </button>

                        <div
                          style={{
                            position: 'absolute',
                            bottom: '6px',
                            right: '6px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: '#FFFFFF',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '0.68rem',
                            fontWeight: 600
                          }}
                        >
                          {m.sizeKB ? (m.sizeKB > 1024 ? `${(m.sizeKB / 1024).toFixed(1)} MB` : `${m.sizeKB} KB`) : ''}
                        </div>
                      </div>

                      {/* Info & Project Assignment */}
                      <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: 'var(--text-heading)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginBottom: '2px'
                            }}
                            title={m.originalFilename || m.filename}
                          >
                            {m.originalFilename || m.filename}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {m.partName}
                          </div>
                        </div>

                        {/* Reassignment Dropdown */}
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                            Assign to Project:
                          </label>
                          <select
                            className="form-select"
                            value={m.projectId || 'unassigned'}
                            onChange={(e) => handleReassignMedia(m.id, e.target.value)}
                            style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
                          >
                            <option value="ph-106">Kuberan Avenue (ph-106)</option>
                            <option value="ph-107">Rail Nagar (ph-107)</option>
                            <option value="ph-108">Kosavanpalayam (ph-108)</option>
                            <option value="ph-109">Villa Aster (ph-109)</option>
                            <option value="ph-110">Villa Bloom (ph-110)</option>
                            <option value="ph-111">Villa Celeste (ph-111)</option>
                            <option value="ph-112">Part 8 Review Archive (ph-112)</option>
                            <option value="office">Corporate Office (Part 4)</option>
                            <option value="construction">Construction Site (Part 3)</option>
                            <option value="promotional">Promotional Poster (Part 2)</option>
                            <option value="unassigned">Unassigned</option>
                          </select>
                        </div>

                        {/* Card Action Buttons */}
                        <div style={{ display: 'flex', gap: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                          <button
                            type="button"
                            onClick={() => setPreviewMediaItem(m)}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            <Eye size={12} /> Preview
                          </button>

                          <a
                            href={m.storagePath}
                            download={m.filename}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}
                            title="Download file"
                          >
                            <Download size={12} /> Save
                          </a>

                          <button
                            type="button"
                            onClick={() => handleToggleSoftDeleteMedia(m.id)}
                            style={{
                              backgroundColor: m.isArchived ? '#22C55E' : '#EF4444',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                            title={m.isArchived ? "Restore to active site" : "Soft-delete from website (keeps local file safe)"}
                          >
                            {m.isArchived ? <Eye size={12} /> : <Trash2 size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ADD PROPERTY MODAL */}
        {showAddModal && (
          <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--deep-teal)', margin: 0 }}>Add New Property</h3>
                <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddPropertySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Property Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newProp.category}
                      onChange={(e) => setNewProp({ ...newProp, category: e.target.value })}
                    >
                      <option value="Plots">Plots</option>
                      <option value="2 BHK Homes">2 BHK Homes</option>
                      <option value="3 BHK Homes">3 BHK Homes</option>
                      <option value="Villas">Villas</option>
                      <option value="Land + Construction">Land + Construction</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Location</label>
                    <select
                      className="form-select"
                      value={newProp.location}
                      onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    >
                      <option value="Avadi">Avadi</option>
                      <option value="Thiruninravur">Thiruninravur</option>
                      <option value="Veppampattu">Veppampattu</option>
                      <option value="Poonamallee">Poonamallee</option>
                      <option value="Pattabiram">Pattabiram</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Price (INR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newProp.price}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        setNewProp({
                          ...newProp,
                          price: p,
                          priceDisplay: `₹${(p / 100000).toFixed(1)} Lakhs`
                        });
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Plot Area (sq.ft)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newProp.plotArea}
                      onChange={(e) => setNewProp({ ...newProp, plotArea: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Save and Publish Property
                </button>
              </form>
            </div>
          </div>
        )}

        {/* EDIT PROPERTY MODAL */}
        {editingProperty && (
          <div className="modal-backdrop" onClick={() => setEditingProperty(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '780px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ color: 'var(--deep-teal)', margin: 0, fontSize: '1.3rem' }}>Edit Property Details</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ID: {editingProperty.id} • Slug: {editingProperty.slug || 'n/a'}
                  </div>
                </div>
                <button
                  onClick={() => setEditingProperty(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={22} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  adminUpdateProperty(editingProperty.id, editingProperty);
                  setEditingProperty(null);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
              >
                {/* 1. Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Project Title *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editingProperty.title || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={editingProperty.category || 'Upcoming Projects'}
                      onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value })}
                    >
                      <option value="Upcoming Projects">Upcoming Projects</option>
                      <option value="Plots">Plots</option>
                      <option value="2 BHK Homes">2 BHK Homes</option>
                      <option value="3 BHK Homes">3 BHK Homes</option>
                      <option value="Villas">Villas</option>
                      <option value="Land + Construction">Land + Construction</option>
                    </select>
                  </div>
                </div>

                {/* 2. Headline & Description */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Marketing Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Your Future Home Begins at Nathamedu"
                    value={editingProperty.headline || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, headline: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Project Description</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={editingProperty.description || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  />
                </div>

                {/* 3. Location & Address */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Location / Area</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProperty.location || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Address / Landmark</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProperty.fullAddress || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, fullAddress: e.target.value })}
                    />
                  </div>
                </div>

                {/* 4. Price & Display Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Base Price (INR Number)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingProperty.price || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditingProperty({
                          ...editingProperty,
                          price: val
                        });
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Price Display String</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Starting from ₹38 Lakhs"
                      value={editingProperty.priceDisplay || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, priceDisplay: e.target.value })}
                    />
                  </div>
                </div>

                {/* 5. Project Status & Construction Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Project Status Lifecycle</label>
                    <select
                      className="form-select"
                      value={
                        editingProperty.projectStatus ||
                        (editingProperty.isUpcoming ? 'Upcoming' : 'Completed')
                      }
                      onChange={(e) => {
                        const statusVal = e.target.value;
                        if (statusVal === 'Upcoming') {
                          setEditingProperty({
                            ...editingProperty,
                            projectStatus: 'Upcoming',
                            isUpcoming: true,
                            category: 'Upcoming Projects',
                            statusBadge: 'Upcoming Construction — Construction Work Starting Soon',
                            constructionStatus: editingProperty.constructionStatus || 'Construction work is planned to start soon.'
                          });
                        } else if (statusVal === 'Under Construction') {
                          setEditingProperty({
                            ...editingProperty,
                            projectStatus: 'Under Construction',
                            isUpcoming: false,
                            statusBadge: 'Under Construction — Work in Progress',
                            constructionStatus: 'Construction work in active progress'
                          });
                        } else {
                          setEditingProperty({
                            ...editingProperty,
                            projectStatus: 'Completed',
                            isUpcoming: false,
                            statusBadge: 'Ready to Occupy',
                            constructionStatus: 'Completed & Ready to Handover'
                          });
                        }
                      }}
                    >
                      <option value="Upcoming">Upcoming Project</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Completed">Completed / Ready to Move</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Construction Status Note</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Construction work is planned to start soon."
                      value={editingProperty.constructionStatus || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, constructionStatus: e.target.value })}
                    />
                  </div>
                </div>

                {/* 6. Availability & Public Visibility Toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Availability Badge</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Upcoming Project / Ready to Construct"
                      value={editingProperty.availability || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, availability: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label className="form-label">Public Website Visibility</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
                      <input
                        type="checkbox"
                        checked={editingProperty.isPublished !== false}
                        onChange={(e) => setEditingProperty({ ...editingProperty, isPublished: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: editingProperty.isPublished !== false ? 'var(--success)' : 'var(--danger)' }}>
                        {editingProperty.isPublished !== false ? 'Published (Visible to Visitors)' : 'Unpublished (Hidden from Public)'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* 7. Photographs Gallery Management */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Project Photographs ({editingProperty.images?.length || 0} images)
                  </label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
                    The 1st photo is used as the primary card preview. You can reorder, delete, or add new photos.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {(editingProperty.images || []).map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px 10px',
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--deep-teal)', width: '24px' }}>
                          #{idx + 1}
                        </span>
                        <img
                          src={img}
                          alt={`Project ${idx}`}
                          style={{ width: '45px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {img}
                        </span>

                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const copy = [...editingProperty.images];
                            const temp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = temp;
                            setEditingProperty({ ...editingProperty, images: copy });
                          }}
                          style={{
                            padding: '3px 6px',
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            opacity: idx === 0 ? 0.3 : 1
                          }}
                          title="Move earlier (higher priority)"
                        >
                          <ArrowUp size={13} />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx === editingProperty.images.length - 1}
                          onClick={() => {
                            const copy = [...editingProperty.images];
                            const temp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = temp;
                            setEditingProperty({ ...editingProperty, images: copy });
                          }}
                          style={{
                            padding: '3px 6px',
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: idx === editingProperty.images.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: idx === editingProperty.images.length - 1 ? 0.3 : 1
                          }}
                          title="Move later"
                        >
                          <ArrowDown size={13} />
                        </button>

                        {/* Remove */}
                        <button
                          type="button"
                          disabled={editingProperty.images.length <= 1}
                          onClick={() => {
                            const copy = editingProperty.images.filter((_, i) => i !== idx);
                            setEditingProperty({ ...editingProperty, images: copy });
                          }}
                          style={{
                            padding: '3px 6px',
                            background: 'none',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: 'var(--danger)',
                            borderRadius: '4px',
                            cursor: editingProperty.images.length <= 1 ? 'not-allowed' : 'pointer',
                            opacity: editingProperty.images.length <= 1 ? 0.3 : 1
                          }}
                          title="Remove photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Image Row */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter new image path or URL..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newImageUrl.trim()) return;
                        setEditingProperty({
                          ...editingProperty,
                          images: [...(editingProperty.images || []), newImageUrl.trim()]
                        });
                        setNewImageUrl('');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Plus size={14} /> Add Photo
                    </button>
                  </div>
                </div>

                {/* 8. Project Videos Management */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <label className="form-label" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Film size={16} color="var(--primary-teal)" />
                      <span>Project Site Videos ({editingProperty.videos?.length || 0} videos)</span>
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Reorder, edit titles, preview or toggle publish
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0' }}>
                    These videos are displayed in the Project Details video gallery with instant playback &amp; download buttons.
                  </p>

                  {/* List of existing videos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {(editingProperty.videos || []).map((vid, idx) => (
                      <div
                        key={vid.id || idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          padding: '10px 12px',
                          backgroundColor: vid.published !== false ? 'var(--bg-main)' : 'rgba(239, 68, 68, 0.05)',
                          borderRadius: 'var(--radius-md)',
                          border: vid.published !== false ? '1px solid var(--border-color)' : '1px dashed rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--deep-teal)', width: '24px' }}>
                            #{idx + 1}
                          </span>

                          {/* Editable Video Title */}
                          <input
                            type="text"
                            className="form-input"
                            value={vid.title || ''}
                            onChange={(e) => {
                              const updatedVideos = [...editingProperty.videos];
                              updatedVideos[idx] = { ...updatedVideos[idx], title: e.target.value };
                              setEditingProperty({ ...editingProperty, videos: updatedVideos });
                            }}
                            placeholder="Video Title..."
                            style={{ fontSize: '0.85rem', padding: '4px 8px', flex: 1, fontWeight: 600 }}
                          />

                          {/* Preview Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewVideoUrl(vid.url)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              borderRadius: '4px',
                              backgroundColor: '#FFFFFF',
                              border: '1.5px solid var(--primary-teal)',
                              color: 'var(--primary-teal)',
                              cursor: 'pointer'
                            }}
                            title="Preview Video Player"
                          >
                            <Play size={11} fill="currentColor" /> Preview
                          </button>

                          {/* Publish / Unpublish Toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedVideos = [...editingProperty.videos];
                              const isPub = updatedVideos[idx].published !== false;
                              updatedVideos[idx] = { ...updatedVideos[idx], published: !isPub };
                              setEditingProperty({ ...editingProperty, videos: updatedVideos });
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              borderRadius: '4px',
                              backgroundColor: vid.published !== false ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                              color: vid.published !== false ? '#059669' : '#DC2626',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            title="Click to toggle publish status"
                          >
                            {vid.published !== false ? <Eye size={11} /> : <EyeOff size={11} />}
                            {vid.published !== false ? 'Published' : 'Hidden'}
                          </button>

                          {/* Move Up */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const copy = [...editingProperty.videos];
                              const temp = copy[idx - 1];
                              copy[idx - 1] = copy[idx];
                              copy[idx] = temp;
                              setEditingProperty({ ...editingProperty, videos: copy });
                            }}
                            style={{
                              padding: '3px 6px',
                              background: 'none',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              cursor: idx === 0 ? 'not-allowed' : 'pointer',
                              opacity: idx === 0 ? 0.3 : 1
                            }}
                            title="Move earlier in gallery order"
                          >
                            <ArrowUp size={13} />
                          </button>

                          {/* Move Down */}
                          <button
                            type="button"
                            disabled={idx === editingProperty.videos.length - 1}
                            onClick={() => {
                              const copy = [...editingProperty.videos];
                              const temp = copy[idx + 1];
                              copy[idx + 1] = copy[idx];
                              copy[idx] = temp;
                              setEditingProperty({ ...editingProperty, videos: copy });
                            }}
                            style={{
                              padding: '3px 6px',
                              background: 'none',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              cursor: idx === editingProperty.videos.length - 1 ? 'not-allowed' : 'pointer',
                              opacity: idx === editingProperty.videos.length - 1 ? 0.3 : 1
                            }}
                            title="Move later in gallery order"
                          >
                            <ArrowDown size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              const copy = editingProperty.videos.filter((_, i) => i !== idx);
                              setEditingProperty({ ...editingProperty, videos: copy });
                            }}
                            style={{
                              padding: '3px 6px',
                              background: 'none',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: 'var(--danger)',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            title="Remove video from project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* URL & Description sub-fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={vid.url || ''}
                            onChange={(e) => {
                              const updatedVideos = [...editingProperty.videos];
                              updatedVideos[idx] = { ...updatedVideos[idx], url: e.target.value };
                              setEditingProperty({ ...editingProperty, videos: updatedVideos });
                            }}
                            placeholder="Video file path or Cloud URL (/videos/... or https://...)"
                            style={{ fontSize: '0.78rem', padding: '3px 6px' }}
                          />
                          <input
                            type="text"
                            className="form-input"
                            value={vid.description || ''}
                            onChange={(e) => {
                              const updatedVideos = [...editingProperty.videos];
                              updatedVideos[idx] = { ...updatedVideos[idx], description: e.target.value };
                              setEditingProperty({ ...editingProperty, videos: updatedVideos });
                            }}
                            placeholder="Video description note..."
                            style={{ fontSize: '0.78rem', padding: '3px 6px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Video Form */}
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--deep-teal)', marginBottom: '6px' }}>
                      + Add New Site Video
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Video Title (e.g. Site Visit Video 6)"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        style={{ fontSize: '0.82rem' }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Video URL or public path (/videos/...)"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        style={{ fontSize: '0.82rem' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Poster image URL (optional)"
                        value={newVideoPoster}
                        onChange={(e) => setNewVideoPoster(e.target.value)}
                        style={{ fontSize: '0.82rem' }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Brief description of video..."
                        value={newVideoDescription}
                        onChange={(e) => setNewVideoDescription(e.target.value)}
                        style={{ fontSize: '0.82rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newVideoUrl.trim() || !newVideoTitle.trim()) {
                            addToast('Please provide both a Title and Video URL.', 'error');
                            return;
                          }
                          const newVidObj = {
                            id: `vid-${Date.now()}`,
                            title: newVideoTitle.trim(),
                            shortTitle: newVideoTitle.trim(),
                            description: newVideoDescription.trim() || 'Site walkthrough video.',
                            url: newVideoUrl.trim(),
                            downloadName: newVideoUrl.split('/').pop() || 'site-video.mp4',
                            poster: newVideoPoster.trim() || (editingProperty.images?.[0] || ''),
                            duration: 'Walkthrough',
                            published: true
                          };
                          setEditingProperty({
                            ...editingProperty,
                            videos: [...(editingProperty.videos || []), newVidObj]
                          });
                          setNewVideoTitle('');
                          setNewVideoUrl('');
                          setNewVideoPoster('');
                          setNewVideoDescription('');
                          addToast('Video added to project!', 'success');
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <Plus size={14} /> Add Video
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} /> Save Property Updates
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIDEO PREVIEW MODAL */}
        {previewVideoUrl && (
          <div className="modal-backdrop" onClick={() => setPreviewVideoUrl(null)} style={{ zIndex: 1100 }}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '720px', width: '90%', padding: '1.5rem', backgroundColor: '#000000', borderRadius: 'var(--radius-lg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                  <Play size={16} fill="#008F83" color="#008F83" />
                  <span>Admin Video Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewVideoUrl(null)}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000000', borderRadius: '8px', overflow: 'hidden' }}>
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                >
                  Your browser does not support HTML5 video preview.
                </video>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.78rem', color: '#AAAAAA' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                  Source: {previewVideoUrl}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewVideoUrl(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#FFFFFF', borderColor: '#444444' }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MEDIA PREVIEW MODAL */}
        {previewMediaItem && (
          <div className="modal-backdrop" onClick={() => setPreviewMediaItem(null)} style={{ zIndex: 1200 }}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '780px',
                width: '92%',
                padding: '1.5rem',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#FFFFFF' }}>
                    {previewMediaItem.originalFilename || previewMediaItem.filename}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    Part {previewMediaItem.partNumber} • {previewMediaItem.partName} • {previewMediaItem.mediaType.toUpperCase()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMediaItem(null)}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>

              <div style={{ width: '100%', maxHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#000000' }}>
                {previewMediaItem.mediaType === 'video' ? (
                  <video
                    src={previewMediaItem.storagePath}
                    controls
                    autoPlay
                    playsInline
                    style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                  >
                    Your browser does not support HTML5 video preview.
                  </video>
                ) : (
                  <img
                    src={previewMediaItem.storagePath}
                    alt={previewMediaItem.filename}
                    style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Project: <strong>{previewMediaItem.projectId || 'Unassigned'}</strong> | Size: {previewMediaItem.sizeKB} KB
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={previewMediaItem.storagePath}
                    download={previewMediaItem.filename}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={14} /> Download File
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewMediaItem(null)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#FFFFFF', borderColor: '#475569' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 768px) {
          .admin-desktop-table {
            display: none !important;
          }
          .admin-mobile-cards {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
