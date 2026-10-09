/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - ADMIN MANAGEMENT DASHBOARD (PROTECTED)
   ========================================================================== */

import React, { useState, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';

export default function AdminPage({ navigate }) {
  const { user, getRegisteredUsersForAdmin } = useAuth();
  const { properties, enquiries, adminAddProperty, adminUpdateProperty, adminDeleteProperty, updateEnquiryStatus } = useProperties();
  const { addToast } = useToast();

  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'properties' | 'enquiries'
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Fetch sanitized registered users (passwords and hashes strictly excluded)
  const registeredUsers = useMemo(() => {
    try {
      if (user?.role === 'admin') {
        return getRegisteredUsersForAdmin();
      }
      return [];
    } catch {
      return [];
    }
  }, [user, getRegisteredUsersForAdmin]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return registeredUsers;
    const term = userSearchTerm.toLowerCase();
    return registeredUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.phone.includes(term) ||
        u.role.toLowerCase().includes(term)
    );
  }, [registeredUsers, userSearchTerm]);

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
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-teal">Administrator Portal</span>
              <span className="badge badge-gold">Active: {user.email}</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', color: 'var(--text-heading)' }}>
              Perfect Homes &amp; Developers Admin Management
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Property
            </button>
            <button onClick={() => navigate('home')} className="btn btn-secondary">
              View Website
            </button>
          </div>
        </div>

        {/* Analytics Top Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Registered Users</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--deep-teal)', marginTop: '4px' }}>
              {registeredUsers.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Properties Active</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-teal)', marginTop: '4px' }}>
              {properties.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Customer Enquiries</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--deep-teal)', marginTop: '4px' }}>
              {enquiries.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>New Leads Pending</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
              {enquiries.filter((e) => e.status === 'New').length}
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`btn ${activeAdminTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} /> Registered Users ({registeredUsers.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('properties')}
            className={`btn ${activeAdminTab === 'properties' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Building size={16} /> Property Inventory ({properties.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('enquiries')}
            className={`btn ${activeAdminTab === 'enquiries' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={16} /> Customer Enquiries ({enquiries.length})
          </button>
        </div>

        {/* TAB 1: REGISTERED USERS MANAGEMENT (PROTECTED & SANITIZED) */}
        {activeAdminTab === 'users' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', margin: 0 }}>Registered User Accounts</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Secure access list • Passwords &amp; hashes strictly protected</span>
              </div>

              <div style={{ position: 'relative', minWidth: '260px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search user by name, email, phone..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>User Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Phone Number</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Registration Date</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Account Status</th>
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
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-heading)' }}>{u.email}</td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{u.phone}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-teal'}`}>
                            {u.role === 'admin' ? 'Administrator' : 'Buyer'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
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
          </div>
        )}

        {/* TAB 2: PROPERTIES MANAGEMENT */}
        {activeAdminTab === 'properties' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', margin: 0 }}>Property Inventory</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live database updates</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Property</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Approval</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={p.images[0]} alt={p.title} style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-teal">{p.category}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-heading)' }}>{p.location}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{p.priceDisplay}</td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.approval}</td>
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => adminDeleteProperty(p.id)}
                          style={{ color: 'var(--danger)', padding: '6px', borderRadius: '4px' }}
                          title="Delete Property"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ENQUIRIES MANAGEMENT */}
        {activeAdminTab === 'enquiries' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-teal)', margin: 0 }}>Customer Leads &amp; Site Visit Log</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
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

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add executive update note..."
                      defaultValue={enq.salesNotes || ''}
                      onBlur={(e) => updateEnquiryStatus(enq.id, enq.status, e.target.value)}
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem' }}
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
      </div>
    </div>
  );
}
