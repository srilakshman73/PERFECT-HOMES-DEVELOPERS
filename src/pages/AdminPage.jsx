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
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Layers,
  MapPin,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function AdminPage({ navigate }) {
  const { user, getRegisteredUsersForAdmin, syncUsers } = useAuth();
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [dbUsers, setDbUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
                              ID: {p.id} • {p.images?.length || 0} photos
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
