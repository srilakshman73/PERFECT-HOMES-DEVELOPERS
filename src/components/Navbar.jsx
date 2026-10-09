/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - GLOBAL RESPONSIVE NAVBAR
   Responsive mobile drawer + Admin access + Contact bar
   ========================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import Logo from './Logo';
import {
  Heart,
  Search,
  Bot,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings,
  KeyRound,
  FileText,
  BookmarkCheck,
  Scale,
  Clock,
  MapPin,
  Home,
  PhoneCall,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { LOCATIONS_DATA, COMPANY_CONTACT_INFO } from '../data/locationsData';
import { PROPERTY_CATEGORIES } from '../data/propertiesData';

export default function Navbar({
  currentPage,
  navigate,
  onOpenAI,
  onOpenSearch,
  onOpenCompare
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount, compareList } = useProperties();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const [locationsDropdownOpen, setLocationsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const profileRef = useRef(null);
  const propRef = useRef(null);
  const locRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (propRef.current && !propRef.current.contains(e.target)) {
        setPropertiesDropdownOpen(false);
      }
      if (locRef.current && !locRef.current.contains(e.target)) {
        setLocationsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (page, params = null) => {
    setMobileMenuOpen(false);
    setPropertiesDropdownOpen(false);
    setLocationsDropdownOpen(false);
    setProfileDropdownOpen(false);
    navigate(page, params);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: isScrolled ? '0 4px 20px rgba(6, 78, 73, 0.08)' : 'none',
        transition: 'all var(--transition-normal)'
      }}
    >
      {/* ========================================================
          1. TOP INFORMATION BAR (SLIM DEEP-TEAL)
          ======================================================== */}
      <div
        style={{
          background: '#064E49',
          color: '#FFFFFF',
          fontSize: '0.8rem',
          padding: '0.4rem 0',
          fontWeight: 500,
          borderBottom: '1px solid rgba(49, 214, 197, 0.15)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          {/* Office Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} color="#31D6C5" />
            <span style={{ opacity: 0.95 }}>{COMPANY_CONTACT_INFO.shortAddress}</span>
          </div>

          {/* Right Contacts & Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Phone */}
            <a
              href={`tel:${COMPANY_CONTACT_INFO.phone}`}
              style={{ color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <PhoneCall size={12} color="#31D6C5" />
              <span>{COMPANY_CONTACT_INFO.phoneDisplay}</span>
            </a>

            <span className="hide-mobile" style={{ opacity: 0.4 }}>|</span>

            {/* Email */}
            <a
              href={`mailto:${COMPANY_CONTACT_INFO.email}`}
              className="hide-mobile"
              style={{ color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Mail size={12} color="#31D6C5" />
              <span>{COMPANY_CONTACT_INFO.email}</span>
            </a>

            <span className="hide-mobile" style={{ opacity: 0.4 }}>|</span>

            {/* Social Icons */}
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Facebook */}
              <a
                href={COMPANY_CONTACT_INFO.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#1877F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
                title="Facebook"
              >
                f
              </a>

              {/* Instagram */}
              <a
                href={COMPANY_CONTACT_INFO.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
                title="Instagram"
              >
                <div style={{ width: '10px', height: '10px', border: '1.5px solid #FFFFFF', borderRadius: '3px' }} />
              </a>

              {/* YouTube */}
              <a
                href={COMPANY_CONTACT_INFO.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#FF0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.65rem'
                }}
                title="YouTube"
              >
                ▶
              </a>
            </div>

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ShieldAlert size={12} color="#31D6C5" /> Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MAIN WHITE NAVIGATION BAR
          ======================================================== */}
      <div className="container" style={{ padding: '0.65rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Logo
              size="md"
              onClick={() => handleNav('home')}
              className="navbar-logo"
            />
          </div>

          {/* Desktop Nav Links */}
          <nav
            className="hide-mobile-tablet"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.6rem',
              fontWeight: 600,
              fontSize: '0.94rem'
            }}
          >
            {/* Home */}
            <button
              onClick={() => handleNav('home')}
              style={{
                color: currentPage === 'home' ? '#008F83' : '#17313D',
                fontWeight: currentPage === 'home' ? 700 : 600,
                position: 'relative',
                padding: '0.4rem 0'
              }}
            >
              Home
              {currentPage === 'home' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2.5px',
                    backgroundColor: '#008F83',
                    borderRadius: '2px'
                  }}
                />
              )}
            </button>

            {/* Properties Dropdown */}
            <div ref={propRef} style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setPropertiesDropdownOpen(!propertiesDropdownOpen);
                  setLocationsDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: currentPage === 'listing' ? '#008F83' : '#17313D',
                  fontWeight: currentPage === 'listing' ? 700 : 600,
                  padding: '0.4rem 0'
                }}
              >
                Properties <ChevronDown size={14} />
              </button>

              {propertiesDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    left: '-20px',
                    width: '270px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem 0',
                    zIndex: 1100,
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <button
                    onClick={() => handleNav('listing', { category: 'all' })}
                    style={dropdownItemStyle}
                  >
                    <Home size={16} color="var(--primary-teal)" />
                    <div>
                      <div>All Properties</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Explore full catalog</div>
                    </div>
                  </button>

                  {PROPERTY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleNav('listing', { category: cat.categoryFilter })}
                      style={dropdownItemStyle}
                    >
                      <span>{cat.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cat.subtitle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Locations Dropdown */}
            <div ref={locRef} style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setLocationsDropdownOpen(!locationsDropdownOpen);
                  setPropertiesDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: currentPage === 'locations' ? '#008F83' : '#17313D',
                  fontWeight: currentPage === 'locations' ? 700 : 600,
                  padding: '0.4rem 0'
                }}
              >
                Locations <ChevronDown size={14} />
              </button>

              {locationsDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    left: '-20px',
                    width: '250px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem 0',
                    zIndex: 1100,
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <button
                    onClick={() => handleNav('locations')}
                    style={dropdownItemStyle}
                  >
                    <MapPin size={16} color="var(--primary-teal)" />
                    <div>All Locations Guide</div>
                  </button>

                  {LOCATIONS_DATA.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleNav('listing', { location: loc.name })}
                      style={dropdownItemStyle}
                    >
                      <span>{loc.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{loc.propertyCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About Us */}
            <button
              onClick={() => handleNav('about')}
              style={{
                color: currentPage === 'about' ? '#008F83' : '#17313D',
                fontWeight: currentPage === 'about' ? 700 : 600
              }}
            >
              About Us
            </button>

            {/* AI Assistant */}
            <button
              onClick={onOpenAI}
              style={{
                color: '#17313D',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              AI Assistant
            </button>

            {/* Contact */}
            <button
              onClick={() => handleNav('contact')}
              style={{
                color: currentPage === 'contact' ? '#008F83' : '#17313D',
                fontWeight: currentPage === 'contact' ? 700 : 600
              }}
            >
              Contact
            </button>
          </nav>

          {/* Right Header Controls (Search, Wishlist, Login / Register or Profile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              style={{
                color: '#17313D',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Search Properties"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* Wishlist Icon with label */}
            <button
              onClick={() => handleNav('wishlist')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#17313D',
                fontWeight: 600,
                fontSize: '0.9rem',
                position: 'relative'
              }}
              title="My Wishlist"
            >
              <Heart size={18} fill={wishlistCount > 0 ? '#008F83' : 'none'} color={wishlistCount > 0 ? '#008F83' : '#17313D'} />
              <span className="hide-mobile">Wishlist</span>
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '10px',
                    backgroundColor: '#008F83',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* AUTHENTICATION STATE */}
            {isAuthenticated && user ? (
              /* Authenticated user button with dynamic name */
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    backgroundColor: 'var(--bg-main)',
                    border: '1.5px solid var(--border-color)',
                    padding: '0.35rem 0.8rem 0.35rem 0.4rem',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid var(--primary-teal)'
                    }}
                  />
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Welcome,</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                      Hi, {user.firstName || 'User'}
                    </div>
                  </div>
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: '260px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-color)',
                      padding: '0.75rem 0',
                      zIndex: 1100,
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                  >
                    <div style={{ padding: '0.4rem 1.2rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-heading)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>

                    <div style={{ padding: '0.35rem 0' }}>
                      <button onClick={() => handleNav('profile', { tab: 'personal' })} style={profileMenuItemStyle}>
                        <User size={15} color="var(--primary-teal)" />
                        <span>My Profile</span>
                      </button>
                      <button onClick={() => handleNav('wishlist')} style={profileMenuItemStyle}>
                        <Heart size={15} color="var(--primary-teal)" />
                        <span>My Wishlist ({wishlistCount})</span>
                      </button>
                      <button onClick={() => { setProfileDropdownOpen(false); onOpenCompare(); }} style={profileMenuItemStyle}>
                        <Scale size={15} color="var(--primary-teal)" />
                        <span>Compared Properties ({compareList.length})</span>
                      </button>
                      <button onClick={() => handleNav('enquiries')} style={profileMenuItemStyle}>
                        <FileText size={15} color="var(--primary-teal)" />
                        <span>My Enquiries</span>
                      </button>
                      <button onClick={() => handleNav('profile', { tab: 'settings' })} style={profileMenuItemStyle}>
                        <Settings size={15} color="var(--primary-teal)" />
                        <span>Account Settings</span>
                      </button>
                      <button onClick={() => handleNav('profile', { tab: 'password' })} style={profileMenuItemStyle}>
                        <KeyRound size={15} color="var(--primary-teal)" />
                        <span>Change Password</span>
                      </button>
                      {user.role === 'admin' && (
                        <button onClick={() => handleNav('admin')} style={{ ...profileMenuItemStyle, color: 'var(--primary-teal)', fontWeight: 700 }}>
                          <ShieldAlert size={15} color="var(--primary-teal)" />
                          <span>Admin Portal</span>
                        </button>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.35rem' }}>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('home');
                        }}
                        style={{ ...profileMenuItemStyle, color: 'var(--danger)' }}
                      >
                        <LogOut size={15} color="var(--danger)" />
                        <span style={{ fontWeight: 600 }}>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest State: Login & Register */
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleNav('login')}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #008F83',
                    backgroundColor: '#FFFFFF',
                    color: '#064E49',
                    fontWeight: 600,
                    fontSize: '0.88rem'
                  }}
                >
                  Login
                </button>

                <button
                  onClick={() => handleNav('register')}
                  style={{
                    padding: '0.45rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#008F83',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    boxShadow: '0 2px 8px rgba(0, 143, 131, 0.25)'
                  }}
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="show-mobile-tablet btn-icon"
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-heading)'
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE DRAWER MENU (RESPONSIVE OVERLAY)
          ======================================================== */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: '65px',
            backgroundColor: '#FFFFFF',
            zIndex: 9999,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          {isAuthenticated && user ? (
            <div style={{ backgroundColor: 'var(--turquoise-light)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-teal)' }} />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--deep-teal)', fontSize: '1.05rem' }}>Hi, {user.firstName || user.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{user.email}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button onClick={() => handleNav('login')} className="btn btn-secondary">Login</button>
              <button onClick={() => handleNav('register')} className="btn btn-primary">Register</button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
            <button onClick={() => handleNav('home')} style={mobileBtnStyle}><Home size={18} color="var(--primary-teal)" /> Home</button>
            <button onClick={() => handleNav('listing')} style={mobileBtnStyle}><FileText size={18} color="var(--primary-teal)" /> All Properties</button>
            <button onClick={() => handleNav('locations')} style={mobileBtnStyle}><MapPin size={18} color="var(--primary-teal)" /> Locations Guide</button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenAI(); }} style={mobileBtnStyle}><Bot size={18} color="var(--primary-teal)" /> AI Assistant</button>
            <button onClick={() => handleNav('about')} style={mobileBtnStyle}><User size={18} color="var(--primary-teal)" /> About Us</button>
            <button onClick={() => handleNav('contact')} style={mobileBtnStyle}><PhoneCall size={18} color="var(--primary-teal)" /> Contact</button>

            {isAuthenticated && user && (
              <>
                <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                  <button onClick={() => handleNav('profile', { tab: 'personal' })} style={mobileBtnStyle}><User size={18} color="var(--primary-teal)" /> My Profile</button>
                  <button onClick={() => handleNav('wishlist')} style={mobileBtnStyle}><Heart size={18} color="var(--primary-teal)" /> My Wishlist ({wishlistCount})</button>
                  <button onClick={() => handleNav('enquiries')} style={mobileBtnStyle}><FileText size={18} color="var(--primary-teal)" /> My Enquiries</button>
                  {user.role === 'admin' && (
                    <button onClick={() => handleNav('admin')} style={{ ...mobileBtnStyle, color: 'var(--primary-teal)', fontWeight: 700 }}>
                      <ShieldAlert size={18} color="var(--primary-teal)" /> Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('home');
                    }}
                    style={{ ...mobileBtnStyle, color: 'var(--danger)', marginTop: '0.25rem' }}
                  >
                    <LogOut size={18} color="var(--danger)" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0.55rem 1.2rem',
  textAlign: 'left',
  color: 'var(--text-heading)',
  fontSize: '0.88rem',
  fontWeight: 500,
  transition: 'background-color 0.15s'
};

const profileMenuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%',
  padding: '0.55rem 1.2rem',
  textAlign: 'left',
  color: 'var(--text-heading)',
  fontSize: '0.86rem',
  fontWeight: 500
};

const mobileBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%',
  padding: '0.75rem 1rem',
  textAlign: 'left',
  color: 'var(--text-heading)',
  fontSize: '0.95rem',
  fontWeight: 600,
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--bg-main)'
};
