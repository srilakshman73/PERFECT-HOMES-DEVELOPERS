/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - PROPERTY LISTING PAGE (COMPREHENSIVE FILTERS)
   ========================================================================== */

import React, { useState, useMemo } from 'react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import { LOCATIONS_DATA } from '../data/locationsData';
import { PROPERTY_CATEGORIES } from '../data/propertiesData';
import {
  Filter,
  Search,
  SlidersHorizontal,
  Grid,
  List,
  ChevronRight,
  X,
  RotateCcw,
  Sparkles,
  Bot,
  Landmark,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

export default function ListingPage({
  navigate,
  onViewProperty,
  onOpenBrochure,
  onOpenAI
}) {
  const { properties, filters, setFilters, resetFilters } = useProperties();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;

  // Filter application
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Keyword
      if (filters.keyword.trim()) {
        const q = filters.keyword.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.approval.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Location
      if (filters.location && filters.location !== 'all') {
        if (p.location.toLowerCase() !== filters.location.toLowerCase()) return false;
      }

      // Category
      if (filters.category && filters.category !== 'all') {
        if (!p.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
      }

      // BHK
      if (filters.bhk && filters.bhk !== 'all') {
        const bhkVal = parseInt(filters.bhk, 10);
        if (p.bhk !== bhkVal && p.category !== 'Plots') return false;
      }

      // Price
      if (filters.minPrice > 0 && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;

      // Facing
      if (filters.facing && filters.facing !== 'all') {
        if (!p.facing || !p.facing.toLowerCase().includes(filters.facing.toLowerCase())) return false;
      }

      // Availability
      if (filters.availability && filters.availability !== 'all') {
        if (p.availability !== filters.availability) return false;
      }

      // Approval
      if (filters.approval && filters.approval !== 'all') {
        if (!p.approval.toLowerCase().includes(filters.approval.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'area_desc') return (b.builtUpArea || b.plotArea) - (a.builtUpArea || a.plotArea);
      if (filters.sortBy === 'newest') return b.id.localeCompare(a.id);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // default featured
    });
  }, [properties, filters]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedList = filteredProperties.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setCurrentPageNum(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatLakhs = (amt) => {
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)} Cr`;
    return `₹${(amt / 100000).toFixed(0)} Lakhs`;
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* ==========================================================
          1. LISTING HERO & BREADCRUMBS BANNER
          ========================================================== */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
          color: '#FFFFFF',
          padding: '2.5rem 0 3rem',
          position: 'relative'
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '1rem'
            }}
          >
            <button
              onClick={() => navigate('home')}
              style={{ color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500 }}
            >
              Home
            </button>
            <ChevronRight size={13} color="rgba(49, 214, 197, 0.9)" />
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Properties</span>
            {filters.location !== 'all' && (
              <>
                <ChevronRight size={13} color="rgba(49, 214, 197, 0.9)" />
                <span style={{ color: 'var(--turquoise)', fontWeight: 700 }}>{filters.location}</span>
              </>
            )}
            {filters.category !== 'all' && (
              <>
                <ChevronRight size={13} color="rgba(49, 214, 197, 0.9)" />
                <span style={{ color: 'var(--turquoise)', fontWeight: 700 }}>{filters.category}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', marginBottom: '0.35rem' }}>
                Explore Verified Properties in Chennai West
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', margin: 0 }}>
                100% CMDA &amp; DTCP Approved Plots, Ready-to-Move Houses &amp; Gated Villas with Bank Loan Approvals
              </p>
            </div>

            {/* AI Assistant Quick Pill */}
            <button
              onClick={onOpenAI}
              className="btn btn-turquoise btn-sm"
              style={{ padding: '0.6rem 1.1rem' }}
            >
              <Bot size={16} />
              <span>Ask AI Property Finder</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================================
          2. MAIN CONTENT LAYOUT: SIDEBAR + PROPERTY GRID
          ========================================================== */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="listing-layout-grid">
          {/* ========================================================
              LEFT FILTER SIDEBAR (DESKTOP)
              ======================================================== */}
          <aside
            className="card listing-filter-sidebar"
            style={{
              padding: '1.5rem',
              backgroundColor: '#FFFFFF',
              position: 'sticky',
              top: '90px',
              maxHeight: 'calc(100vh - 110px)',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--deep-teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal size={18} color="var(--primary-teal)" />
                <span>Filters</span>
              </h3>
              <button
                onClick={resetFilters}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--primary-teal)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="form-group">
              <label className="form-label">Search Keyword</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Paruthipattu, Duplex..."
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Location Select */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="all">All Locations</option>
                {LOCATIONS_DATA.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.propertyCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Property Category */}
            <div className="form-group">
              <label className="form-label">Property Category</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="all">All Categories</option>
                <option value="Plots">Residential Plots</option>
                <option value="2 BHK Homes">2 BHK Homes</option>
                <option value="3 BHK Homes">3 BHK Homes</option>
                <option value="Villas">Luxury Villas</option>
                <option value="Land + Construction">Land + Construction</option>
              </select>
            </div>

            {/* Bedrooms (BHK) */}
            <div className="form-group">
              <label className="form-label">Bedrooms (BHK)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                {[
                  { label: 'All', val: 'all' },
                  { label: 'Plots', val: '0' },
                  { label: '2 BHK', val: '2' },
                  { label: '3 BHK', val: '3' }
                ].map((b) => (
                  <button
                    key={b.val}
                    type="button"
                    onClick={() => handleFilterChange('bhk', b.val)}
                    style={{
                      padding: '0.45rem 0',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: filters.bhk === b.val ? 'var(--primary-teal)' : '#FFFFFF',
                      color: filters.bhk === b.val ? '#FFFFFF' : 'var(--text-heading)'
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Max Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Max Budget</label>
                <strong style={{ color: 'var(--primary-teal)', fontSize: '0.88rem' }}>
                  {formatLakhs(filters.maxPrice || 15000000)}
                </strong>
              </div>
              <input
                type="range"
                min="1500000"
                max="15000000"
                step="500000"
                value={filters.maxPrice || 15000000}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-teal)', marginTop: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>₹15 Lakhs</span>
                <span>₹75 Lakhs</span>
                <span>₹1.5 Cr+</span>
              </div>
            </div>

            {/* Facing Direction */}
            <div className="form-group">
              <label className="form-label">Facing Direction</label>
              <select
                className="form-select"
                value={filters.facing}
                onChange={(e) => handleFilterChange('facing', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="all">Any Facing</option>
                <option value="North">North Facing</option>
                <option value="East">East Facing</option>
                <option value="West">West Facing</option>
                <option value="South">South Facing</option>
                <option value="North-East">North-East Facing</option>
              </select>
            </div>

            {/* Approval Status */}
            <div className="form-group">
              <label className="form-label">Government Approval</label>
              <select
                className="form-select"
                value={filters.approval}
                onChange={(e) => handleFilterChange('approval', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="all">All Approvals</option>
                <option value="CMDA">CMDA Approved</option>
                <option value="DTCP">DTCP Approved</option>
                <option value="RERA">RERA Registered</option>
              </select>
            </div>

            {/* Availability */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Possession Status</label>
              <select
                className="form-select"
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="all">All Status</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Immediate Possession">Immediate Possession</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>
          </aside>

          {/* ========================================================
              RIGHT PROPERTY RESULTS LISTING
              ======================================================== */}
          <main>
            {/* Controls Bar: Results Count + Sort + View Mode + Mobile Filter Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: '#FFFFFF',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  Showing <strong style={{ color: 'var(--primary-teal)' }}>{filteredProperties.length}</strong> Properties
                </span>
                {filters.location !== 'all' && (
                  <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                    {filters.location}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Mobile Filter Drawer Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="show-mobile-filter-btn btn btn-secondary btn-sm"
                  style={{ display: 'none' }}
                >
                  <Filter size={15} /> Filters
                </button>

                {/* Sort By Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }} className="hide-mobile">Sort:</span>
                  <select
                    className="form-select"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
                  >
                    <option value="featured">Featured First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="area_desc">Size: Largest First</option>
                    <option value="newest">Newest Launches</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: viewMode === 'grid' ? 'var(--turquoise-light)' : '#FFFFFF',
                      color: viewMode === 'grid' ? 'var(--primary-teal)' : 'var(--text-muted)'
                    }}
                    title="Grid View"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: viewMode === 'list' ? 'var(--turquoise-light)' : '#FFFFFF',
                      color: viewMode === 'list' ? 'var(--primary-teal)' : 'var(--text-muted)'
                    }}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid / Empty State */}
            {filteredProperties.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <Search size={48} color="var(--primary-teal)" style={{ opacity: 0.4, marginBottom: '1rem' }} />
                <h3 style={{ color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>
                  No Properties Matched Your Criteria
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                  Try relaxing your price filters or searching in a different location like Avadi or Thiruninravur.
                </p>
                <button onClick={resetFilters} className="btn btn-primary">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
                  gap: '1.75rem'
                }}
              >
                {paginatedList.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onViewDetails={onViewProperty}
                    onOpenBrochure={onOpenBrochure}
                    layout={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '3rem'
                }}
              >
                <button
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: currentPageNum === 1 ? 0.5 : 1 }}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPageNum(i + 1)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: '1px solid var(--border-color)',
                      backgroundColor: currentPageNum === i + 1 ? 'var(--primary-teal)' : '#FFFFFF',
                      color: currentPageNum === i + 1 ? '#FFFFFF' : 'var(--text-heading)'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPageNum === totalPages}
                  onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: currentPageNum === totalPages ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            )}

            {/* Bottom Loan Assistance Banner */}
            <div
              style={{
                marginTop: '3rem',
                padding: '2rem',
                background: 'linear-gradient(135deg, #E6FAF7 0%, #F5FAF9 100%)',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-teal)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Landmark size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--deep-teal)', fontSize: '1.15rem', marginBottom: '2px' }}>
                    Need Pre-Approved Home Loan at Lowest Interest?
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Our dedicated banking desk coordinates directly with SBI, HDFC, ICICI, and Canara Bank for fast approvals.
                  </p>
                </div>
              </div>

              <a
                href="tel:+919840123456"
                className="btn btn-primary"
                style={{ fontSize: '0.9rem' }}
              >
                <PhoneCall size={16} /> Speak to Loan Officer
              </a>
            </div>
          </main>
        </div>
      </div>

      {/* ========================================================
          MOBILE FILTER DRAWER MODAL
          ======================================================== */}
      {mobileFilterOpen && (
        <div className="modal-backdrop" onClick={() => setMobileFilterOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', padding: '1.5rem', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: 'var(--deep-teal)', margin: 0 }}>Property Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile filter fields */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="all">All Locations</option>
                {LOCATIONS_DATA.map((loc) => (
                  <option key={loc.id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Plots">Plots</option>
                <option value="2 BHK Homes">2 BHK</option>
                <option value="3 BHK Homes">3 BHK</option>
                <option value="Villas">Villas</option>
                <option value="Land + Construction">Land + Construction</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Budget: {formatLakhs(filters.maxPrice || 15000000)}</label>
              <input
                type="range"
                min="1500000"
                max="15000000"
                step="500000"
                value={filters.maxPrice || 15000000}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-teal)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={resetFilters}
                className="btn btn-secondary"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn btn-primary"
              >
                Apply ({filteredProperties.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive CSS for filter sidebar */}
      <style>{`
        @media (max-width: 900px) {
          .listing-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .listing-filter-sidebar {
            display: none !important;
          }
          .show-mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
