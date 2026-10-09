/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - PROPERTY COMPARISON MODAL & TABLE
   ========================================================================== */

import React from 'react';
import { useProperties } from '../context/PropertyContext';
import {
  Scale,
  X,
  Trash2,
  Eye,
  CheckCircle2,
  ExternalLink,
  MapPin,
  IndianRupee,
  BedDouble,
  Maximize2,
  Compass,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function ComparisonModal({ isOpen, onClose, onViewDetails }) {
  const { compareList, toggleCompare, clearCompare } = useProperties();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1100px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E49 0%, #008F83 100%)',
            color: '#FFFFFF',
            padding: '1.2rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Scale size={20} color="#31D6C5" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                Compare Properties ({compareList.length} of 4)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Side-by-side technical &amp; pricing breakdown
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(255,255,255,0.12)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}
            <button
              onClick={onClose}
              style={{ color: '#FFFFFF', padding: '4px', borderRadius: '4px' }}
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, backgroundColor: '#F8FBFA' }}>
          {compareList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Scale size={48} color="var(--primary-teal)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--deep-teal)', marginBottom: '0.5rem' }}>No Properties Selected for Comparison</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
                Click the scale icon (<Scale size={14} style={{ display: 'inline' }} />) on any property card to add it to this side-by-side comparison table.
              </p>
              <button onClick={onClose} className="btn btn-primary">
                Browse Properties
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        backgroundColor: '#EAF2F0',
                        color: 'var(--deep-teal)',
                        width: '200px',
                        fontSize: '0.9rem',
                        borderBottom: '2px solid var(--border-color)'
                      }}
                    >
                      Feature
                    </th>
                    {compareList.map((p) => (
                      <th
                        key={p.id}
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          backgroundColor: '#FFFFFF',
                          borderBottom: '2px solid var(--border-color)',
                          minWidth: '220px',
                          verticalAlign: 'top'
                        }}
                      >
                        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            style={{
                              width: '100%',
                              height: '130px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginBottom: '0.5rem'
                            }}
                          />
                          <button
                            onClick={() => toggleCompare(p)}
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              color: '#FFFFFF',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <h4
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--text-heading)',
                            marginBottom: '4px',
                            lineHeight: 1.3
                          }}
                        >
                          {p.title}
                        </h4>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-teal)' }}>
                          {p.priceDisplay}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Location */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Location</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        <MapPin size={14} color="var(--primary-teal)" style={{ display: 'inline', marginRight: '4px' }} />
                        {p.location}
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Category</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        <span className="badge badge-teal">{p.category}</span>
                      </td>
                    ))}
                  </tr>

                  {/* BHK */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Bedrooms (BHK)</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        {p.bhk > 0 ? `${p.bhk} BHK` : 'N/A (Plotted Land)'}
                      </td>
                    ))}
                  </tr>

                  {/* Built-up Area */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Built-up Area</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        {p.builtUpArea > 0 ? `${p.builtUpArea} sq.ft` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Plot Area */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Plot Area</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        {p.plotArea} sq.ft
                      </td>
                    ))}
                  </tr>

                  {/* Facing */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Facing Direction</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        {p.facing || 'East'} Facing
                      </td>
                    ))}
                  </tr>

                  {/* Government Approval */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Government Approval</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> {p.approval}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Bank Loan */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Bank Loan Facility</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        {p.bankLoan}
                      </td>
                    ))}
                  </tr>

                  {/* Possession */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Possession Status</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        <span className="badge badge-success">{p.availability}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Road Width */}
                  <tr style={rowStyle}>
                    <td style={featureLabelStyle}>Access Road Width</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={cellStyle}>
                        {p.roadWidth || '30 Feet Tar Road'}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr style={{ backgroundColor: '#FFFFFF' }}>
                    <td style={featureLabelStyle}>Actions</td>
                    {compareList.map((p) => (
                      <td key={p.id} style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => {
                            onClose();
                            onViewDetails(p);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%' }}
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const rowStyle = {
  borderBottom: '1px solid var(--border-light)',
  backgroundColor: '#FFFFFF'
};

const featureLabelStyle = {
  padding: '0.85rem 1rem',
  fontWeight: 600,
  color: 'var(--text-heading)',
  fontSize: '0.85rem',
  backgroundColor: '#F7FBFA',
  borderRight: '1px solid var(--border-light)'
};

const cellStyle = {
  padding: '0.85rem 1rem',
  fontSize: '0.88rem',
  color: 'var(--text-secondary)',
  verticalAlign: 'middle'
};
