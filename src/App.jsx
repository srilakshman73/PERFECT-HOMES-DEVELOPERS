/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - ROOT APP & CLIENT ROUTER
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
  const { isAuthenticated, user } = useAuth();
  const { properties, setFilters } = useProperties();

  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [initialProfileTab, setInitialProfileTab] = useState('personal');

  // Modals state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [brochureProperty, setBrochureProperty] = useState(null);
  const [scheduleProperty, setScheduleProperty] = useState(null);

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

    setCurrentPage(page);
  };

  // View property details
  const handleViewProperty = (prop) => {
    setSelectedProperty(prop);
    navigate('property-details');
  };

  // Open brochure modal
  const handleOpenBrochure = (prop) => {
    setBrochureProperty(prop);
  };

  // Open schedule visit modal
  const handleOpenScheduleVisit = (prop = null) => {
    setScheduleProperty(prop);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global Responsive Navigation Header */}
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
            onOpenBrochure={handleOpenBrochure}
            onOpenScheduleVisit={handleOpenScheduleVisit}
            onViewProperty={handleViewProperty}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            navigate={navigate}
            redirectAfterLogin="home"
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            navigate={navigate}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordPage
            navigate={navigate}
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

      {/* Global Footer */}
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
