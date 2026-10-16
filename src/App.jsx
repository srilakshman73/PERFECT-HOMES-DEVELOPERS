/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - ROOT APP & LOGIN-FIRST ROUTER
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import QuickSearchModal from './components/QuickSearchModal';
import ComparisonModal from './components/ComparisonModal';
import BrochureModal from './components/BrochureModal';
import ScheduleVisitModal from './components/ScheduleVisitModal';
import FirstTimePasswordModal from './components/FirstTimePasswordModal';

// Pages
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import EnquiriesPage from './pages/EnquiriesPage';
import AboutUsPage from './pages/AboutUsPage';
import LocationsPage from './pages/LocationsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { properties, setFilters } = useProperties();

  // Pages requiring user authentication
  const PROTECTED_PAGES = ['profile', 'wishlist', 'enquiries', 'admin'];
  const AUTH_FLOW_PAGES = ['login', 'register', 'forgot-password'];

  // Parse initial route from window.location.pathname
  const getInitialRouteInfo = () => {
    try {
      const path = window.location.pathname;
      if (path.startsWith('/properties/')) {
        const slug = path.replace('/properties/', '').replace(/\/$/, '');
        return { page: 'property-details', slug };
      }
      if (path === '/listing' || path === '/properties') return { page: 'listing' };
      if (path === '/about') return { page: 'about' };
      if (path === '/contact') return { page: 'contact' };
      if (path === '/locations') return { page: 'locations' };
      if (path === '/login') return { page: 'login' };
      if (path === '/register') return { page: 'register' };
      if (path === '/forgot-password') return { page: 'forgot-password' };
      if (path === '/profile') return { page: 'profile' };
      if (path === '/wishlist') return { page: 'wishlist' };
      if (path === '/enquiries') return { page: 'enquiries' };
      if (path === '/admin') return { page: 'admin' };
    } catch {
      // fallback
    }
    return { page: 'home' };
  };

  const [currentPage, setCurrentPage] = useState(() => {
    const init = getInitialRouteInfo();
    return init.page || 'home';
  });

  const [redirectTarget, setRedirectTarget] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(() => {
    const init = getInitialRouteInfo();
    if (init.page === 'property-details' && init.slug) {
      return (
        properties.find((p) => p.slug === init.slug || p.id === init.slug) ||
        properties.find((p) => p.slug === 'nathamedu-niranjan-nagar-upcoming-project') ||
        properties[0]
      );
    }
    return properties.find((p) => p.slug === 'nathamedu-niranjan-nagar-upcoming-project') || properties[0];
  });
  const [initialProfileTab, setInitialProfileTab] = useState('personal');
  const [propertyInitialTab, setPropertyInitialTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || null;
  });

  // Modals state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [brochureProperty, setBrochureProperty] = useState(null);
  const [scheduleProperty, setScheduleProperty] = useState(null);

  // Sync initial URL slug and browser back/forward buttons
  useEffect(() => {
    const init = getInitialRouteInfo();
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) setPropertyInitialTab(tabParam);

    if (init.page === 'property-details' && init.slug) {
      const match = properties.find((p) => p.slug === init.slug || p.id === init.slug);
      if (match) setSelectedProperty(match);
      setCurrentPage('property-details');
    }

    const handlePopState = () => {
      const r = getInitialRouteInfo();
      const p = new URLSearchParams(window.location.search);
      const t = p.get('tab');
      if (t) setPropertyInitialTab(t);

      if (r.page === 'property-details' && r.slug) {
        const match = properties.find((prop) => prop.slug === r.slug || prop.id === r.slug);
        if (match) setSelectedProperty(match);
        setCurrentPage('property-details');
      } else {
        setCurrentPage(r.page || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [properties]);

  // Synchronize route if auth state changes
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && PROTECTED_PAGES.includes(currentPage)) {
        setRedirectTarget(currentPage);
        setCurrentPage('login');
      } else if (isAuthenticated && AUTH_FLOW_PAGES.includes(currentPage)) {
        setCurrentPage(redirectTarget || 'home');
      }
    }
  }, [isAuthenticated, isLoading, currentPage]);

  // Router handler
  const navigate = (page, params = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (params) {
      if (params.category || params.location || params.sortBy) {
        setFilters((prev) => ({
          ...prev,
          ...(params.category ? { category: params.category } : {}),
          ...(params.location ? { location: params.location } : {}),
          ...(params.sortBy ? { sortBy: params.sortBy } : {})
        }));
      }
      if (params.tab) {
        setInitialProfileTab(params.tab);
      }
    }

    // Protect member-only pages
    if (!isAuthenticated && PROTECTED_PAGES.includes(page)) {
      setRedirectTarget(page);
      setCurrentPage('login');
      try {
        window.history.pushState({}, '', '/login');
      } catch {}
      return;
    }

    setCurrentPage(page);

    try {
      if (page === 'home') {
        window.history.pushState({}, '', '/');
      } else if (page === 'property-details' && selectedProperty?.slug) {
        window.history.pushState({}, '', `/properties/${selectedProperty.slug}`);
      } else if (['listing', 'about', 'contact', 'locations', 'admin', 'profile', 'wishlist', 'enquiries', 'login', 'register'].includes(page)) {
        window.history.pushState({}, '', `/${page}`);
      }
    } catch {}
  };

  // View property details
  const handleViewProperty = (prop, options = null) => {
    setSelectedProperty(prop);
    const targetTab = options?.tab || null;
    setPropertyInitialTab(targetTab);
    setCurrentPage('property-details');
    try {
      const tabQuery = targetTab ? `?tab=${targetTab}` : '';
      const hashStr = targetTab === 'videos' ? '#video-gallery' : '';
      window.history.pushState({}, '', `/properties/${prop.slug || prop.id}${tabQuery}${hashStr}`);
    } catch {}
  };

  // Open brochure modal
  const handleOpenBrochure = (prop) => {
    setBrochureProperty(prop);
  };

  // Open schedule visit modal
  const handleOpenScheduleVisit = (prop = null) => {
    setScheduleProperty(prop);
  };

  // Dedicated auth screen if visitor explicitly requests login/register
  if (AUTH_FLOW_PAGES.includes(currentPage) && !isAuthenticated) {
    return (
      <div className="auth-first-wrapper" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        {currentPage === 'register' ? (
          <RegisterPage navigate={navigate} />
        ) : currentPage === 'forgot-password' ? (
          <ForgotPasswordPage navigate={navigate} />
        ) : (
          <LoginPage
            navigate={navigate}
            redirectAfterLogin={redirectTarget || 'home'}
          />
        )}
        <FirstTimePasswordModal />
      </div>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED EXPERIENCE: COMPLETE WEBSITE AFTER LOGIN
  // =========================================================================
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global Responsive Navigation Header with "Hi, [Name]" */}
      <Navbar
        currentPage={currentPage}
        navigate={navigate}
        onOpenAI={() => setAiAssistantOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenCompare={() => setCompareModalOpen(true)}
      />

      {/* Main Page Viewport */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            navigate={navigate}
            onViewProperty={handleViewProperty}
            onOpenBrochure={handleOpenBrochure}
            onOpenScheduleVisit={handleOpenScheduleVisit}
          />
        )}

        {currentPage === 'listing' && (
          <ListingPage
            navigate={navigate}
            onViewProperty={handleViewProperty}
            onOpenBrochure={handleOpenBrochure}
            onOpenAI={() => setAiAssistantOpen(true)}
          />
        )}

        {currentPage === 'property-details' && (
          <PropertyDetailsPage
            property={selectedProperty || properties[0]}
            navigate={navigate}
            initialTab={propertyInitialTab}
            onOpenBrochure={handleOpenBrochure}
            onOpenScheduleVisit={handleOpenScheduleVisit}
            onViewProperty={handleViewProperty}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            navigate={navigate}
            initialTab={initialProfileTab}
          />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage
            navigate={navigate}
            onViewProperty={handleViewProperty}
            onOpenBrochure={handleOpenBrochure}
            onOpenCompare={() => setCompareModalOpen(true)}
          />
        )}

        {currentPage === 'enquiries' && (
          <EnquiriesPage
            navigate={navigate}
            onViewProperty={handleViewProperty}
          />
        )}

        {currentPage === 'about' && (
          <AboutUsPage
            navigate={navigate}
            onOpenScheduleVisit={handleOpenScheduleVisit}
          />
        )}

        {currentPage === 'locations' && (
          <LocationsPage
            navigate={navigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onOpenScheduleVisit={handleOpenScheduleVisit}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            navigate={navigate}
          />
        )}
      </main>

      {/* Global Footer on All Authenticated Pages */}
      <Footer
        navigate={navigate}
        onOpenAI={() => setAiAssistantOpen(true)}
      />

      {/* Floating AI Property Assistant Widget */}
      <AIAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onViewProperty={handleViewProperty}
        onFilterCatalog={() => {
          setAiAssistantOpen(false);
          navigate('listing');
        }}
      />

      {/* Global Quick Search Overlay Modal (Ctrl+K) */}
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProperty={handleViewProperty}
        onSearchQuery={(q) => {
          setFilters((prev) => ({ ...prev, keyword: q }));
          navigate('listing');
        }}
      />

      {/* Side-by-Side Property Comparison Matrix Modal */}
      <ComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onViewDetails={handleViewProperty}
      />

      {/* Official Brochure Download & OTP Verification Modal */}
      <BrochureModal
        property={brochureProperty}
        isOpen={!!brochureProperty}
        onClose={() => setBrochureProperty(null)}
      />

      {/* Free Doorstep Site Visit Booking Modal */}
      <ScheduleVisitModal
        property={scheduleProperty}
        isOpen={!!scheduleProperty}
        onClose={() => setScheduleProperty(null)}
      />

      {/* Mandatory First-Time Password Change Modal */}
      <FirstTimePasswordModal />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PropertyProvider>
          <AppContent />
        </PropertyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
