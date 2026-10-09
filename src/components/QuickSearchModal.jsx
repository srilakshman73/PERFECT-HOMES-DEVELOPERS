/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - QUICK SEARCH OVERLAY MODAL (CTRL+K)
   ========================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Search, X, MapPin, ChevronRight, BedDouble, IndianRupee } from 'lucide-react';

export default function QuickSearchModal({ isOpen, onClose, onSelectProperty, onSearchQuery }) {
  const { properties } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSearchQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSearchQuery]);

  if (!isOpen) return null;

  const filtered = properties.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.approval.toLowerCase().includes(term) ||
      (p.tagline && p.tagline.toLowerCase().includes(term))
    );
  });

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '8vh' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '650px', padding: 0, overflow: 'hidden' }}
      >
        {/* Search Bar Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Search size={22} color="var(--primary-teal)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by project name, location (Avadi, Veppampattu...), or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--text-heading)',
              fontFamily: 'inherit'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ color: 'var(--text-muted)', padding: '4px' }}
            >
              <X size={18} />
            </button>
          )}
          <span
            style={{
              fontSize: '0.75rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              padding: '3px 8px',
              borderRadius: '4px',
              color: 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            ESC
          </span>
        </div>

        {/* Quick Filter Tag Buttons */}
        <div
          style={{
            padding: '0.75rem 1.4rem',
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Quick Filters:</span>
          {['Plots', '2 BHK', '3 BHK', 'Villas', 'Avadi', 'Thiruninravur', 'Veppampattu'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              style={{
                fontSize: '0.78rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-color)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Live Search Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.75rem 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No properties matched &quot;{searchTerm}&quot;. Try searching for &quot;Avadi&quot; or &quot;Plots&quot;.
            </div>
          ) : (
            filtered.map((prop) => (
              <div
                key={prop.id}
                onClick={() => {
                  onClose();
                  onSelectProperty(prop);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1.4rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-light)',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--turquoise-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-heading)' }}>
                    {prop.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={12} color="var(--primary-teal)" /> {prop.location}
                    </span>
                    <span>•</span>
                    <span>{prop.category}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--primary-teal)', fontWeight: 700 }}>{prop.priceDisplay}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
