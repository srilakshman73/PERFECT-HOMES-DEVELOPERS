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
import Logo from './components/Logo';
import ErrorBoundary from './components/ErrorBoundary';

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

  // Public authentication routes
  const AUTH_FLOW_PAGES = ['login', 'register', 'forgot-password'];

  // Parse initial route from window.location.pathname
  const getInitialRouteInfo = () => {
    try {
      const path = window.location.pathname;
      if (path === '/register') return { page: 'register', isAuthFlow: true };
      if (path === '/forgot-password') return { page: 'forgot-password', isAuthFlow: true };
      if (path === '/login') return { page: 'login', isAuthFlow: true };
      if (path.startsWith('/properties/')) {
        const slug = path.replace('/properties/', '').replace(/\/$/, '');
        return { page: 'property-details', slug, isAuthFlow: false };
      }
      if (path === '/listing' || path === '/properties') return { page: 'listing', isAuthFlow: false };
      if (path === '/about') return { page: 'about', isAuthFlow: false };
      if (path === '/contact') return { page: 'contact', isAuthFlow: false };
      if (path === '/locations') return { page: 'locations', isAuthFlow: false };
      if (path === '/profile') return { page: 'profile', isAuthFlow: false };
      if (path === '/wishlist') return { page: 'wishlist', isAuthFlow: false };
      if (path === '/enquiries') return { page: 'enquiries', isAuthFlow: false };
      if (path === '/admin') return { page: 'admin', isAuthFlow: false };
    } catch {
      // fallback
    }
    return { page: 'home', isAuthFlow: false };
  };

  const [authParams, setAuthParams] = useState(null);

  // Default entry flow: unauthenticated users ALWAYS see login first
  const [currentPage, setCurrentPage] = useState(() => {
    const init = getInitialRouteInfo();
    if (init.page === 'register' || init.page === 'forgot-password') {
      return init.page;
    }
    return 'login';
  });

  const [redirectTarget, setRedirectTarget] = useState(() => {
    const init = getInitialRouteInfo();
    if (init.page === 'property-details' && init.slug) {
      return { page: 'property-details', slug: init.slug };
    }
    return init.isAuthFlow ? 'home' : (init.page || 'home');
  });

  const [selectedProperty, setSelectedProperty] = useState(() => {
    const init = getInitialRouteInfo();
    if (init.slug) {
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

  // Sync browser back/forward buttons and initial property slug
  useEffect(() => {
    const init = getInitialRouteInfo();
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) setPropertyInitialTab(tabParam);

    if (init.page === 'property-details' && init.slug) {
      const match = properties.find((p) => p.slug === init.slug || p.id === init.slug);
      if (match) setSelectedProperty(match);
    }

    const handlePopState = () => {
      const r = getInitialRouteInfo();
      const p = new URLSearchParams(window.location.search);
      const t = p.get('tab');
      if (t) setPropertyInitialTab(t);

      if (!isAuthenticated) {
        if (r.page === 'register' || r.page === 'forgot-password') {
          setCurrentPage(r.page);
        } else {
          if (r.page === 'property-details' && r.slug) {
            setRedirectTarget({ page: 'property-details', slug: r.slug });
          } else {
            setRedirectTarget(r.page || 'home');
          }
          setCurrentPage('login');
        }
      } else {
        if (r.page === 'property-details' && r.slug) {
          const match = properties.find((prop) => prop.slug === r.slug || prop.id === r.slug);
          if (match) setSelectedProperty(match);
          setCurrentPage('property-details');
        } else {
          setCurrentPage(r.page || 'home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [properties, isAuthenticated]);

  // Synchronize route when authentication status updates
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        if (!AUTH_FLOW_PAGES.includes(currentPage)) {
          setRedirectTarget(currentPage);
          setCurrentPage('login');
          try {
            window.history.replaceState({}, '', '/login');
          } catch {}
        }
      } else {
        // Authenticated visitor: redirect away from auth flow into complete website or intended page
        if (AUTH_FLOW_PAGES.includes(currentPage)) {
          const target = redirectTarget || 'home';
          if (target && typeof target === 'object' && target.page === 'property-details') {
            const match = properties.find((p) => p.slug === target.slug || p.id === target.slug);
            if (match) setSelectedProperty(match);
            setCurrentPage('property-details');
            try {
              window.history.replaceState({}, '', `/properties/${target.slug}`);
            } catch {}
          } else {
            const pageDest = (typeof target === 'string' && target) || 'home';
            setCurrentPage(pageDest);
            try {
              window.history.replaceState({}, '', pageDest === 'home' ? '/' : `/${pageDest}`);
            } catch {}
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, currentPage, redirectTarget, properties]);

  // Router navigation handler
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
      if (params.registrationSuccess || params.email) {
        setAuthParams(params);
      }
    }

    // Protect all website pages if visitor is not signed in
    if (!isAuthenticated && !AUTH_FLOW_PAGES.includes(page)) {
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
      } else if (['listing', 'about', 'contact', 'locations', 'admin', 'profile', 'wishlist', 'enquiries', 'login', 'register', 'forgot-password'].includes(page)) {
        window.history.pushState({}, '', `/${page}`);
      }
    } catch {}
  };

  // View property details (with authentication guard)
  const handleViewProperty = (prop, options = null) => {
    setSelectedProperty(prop);
    const targetTab = options?.tab || null;
    setPropertyInitialTab(targetTab);

    if (!isAuthenticated) {
      setRedirectTarget({ page: 'property-details', slug: prop.slug || prop.id });
      setCurrentPage('login');
      try {
        window.history.pushState({}, '', '/login');
      } catch {}
      return;
    }

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

  // =========================================================================
  // 1. LOADING SCREEN DURING TOKEN VERIFICATION
  // =========================================================================
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
        <Logo variant="teal" size="lg" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.95rem' }}>
          <div style={{ width: '22px', height: '22px', border: '3px solid rgba(0, 143, 131, 0.2)', borderTopColor: 'var(--primary-teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span>Verifying secure access...</span>
        </div>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // =========================================================================
  // 2. UNAUTHENTICATED EXPERIENCE: STRICT LOGIN-FIRST ACCESS
  //    No property listings, homepage, or private features leaked before sign in.
  // =========================================================================
  if (!isAuthenticated) {
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
            registrationSuccess={authParams?.registrationSuccess}
            registeredEmail={authParams?.email}
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
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <PropertyProvider>
            <AppContent />
          </PropertyProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
