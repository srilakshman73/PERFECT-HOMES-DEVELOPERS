/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - PROPERTY, WISHLIST & ENQUIRY STORE
   ========================================================================== */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROPERTIES_DATA } from '../data/propertiesData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const PropertyContext = createContext(null);

const STORAGE_PROPERTIES_KEY = 'ph_properties_db_v1';
const STORAGE_ENQUIRIES_KEY = 'ph_enquiries_db_v1';
const WISHLIST_PREFIX = 'ph_wishlist_';

const DEFAULT_ENQUIRIES = [
  {
    id: 'enq_1001',
    userId: 'usr_prakash_101',
    propertyId: 'ph-101',
    propertyTitle: 'Grand Emerald Luxury 3 BHK Villa',
    propertyLocation: 'Avadi',
    propertyPrice: '₹68.5 Lakhs',
    propertyImg: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    date: '2026-10-02',
    name: 'Prakash Kumar',
    email: 'prakash@example.com',
    phone: '+91 98410 54321',
    message: 'Interested in booking a weekend site visit with family for this 3 BHK villa.',
    visitDate: '2026-10-12',
    status: 'In Progress',
    salesNotes: 'Site visit confirmed with sales manager Mr. Ramesh for Saturday 11:00 AM.'
  },
  {
    id: 'enq_1002',
    userId: 'usr_prakash_101',
    propertyId: 'ph-102',
    propertyTitle: 'Greenfield Palms Premium Residential Plots',
    propertyLocation: 'Thiruninravur',
    propertyPrice: '₹24.0 Lakhs',
    propertyImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    date: '2026-09-24',
    name: 'Prakash Kumar',
    email: 'prakash@example.com',
    phone: '+91 98410 54321',
    message: 'Requested CMDA layout copy and SBI bank loan pre-approval estimate for 1200 sq.ft plot.',
    visitDate: '',
    status: 'Contacted',
    salesNotes: 'Layout approval papers & SBI loan eligibility sheet sent via WhatsApp.'
  }
];

export function PropertyProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [properties, setProperties] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROPERTIES_KEY);
      return saved ? JSON.parse(saved) : PROPERTIES_DATA;
    } catch {
      return PROPERTIES_DATA;
    }
  });

  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ENQUIRIES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ENQUIRIES;
    } catch {
      return DEFAULT_ENQUIRIES;
    }
  });

  // User-specific wishlist
  const [wishlist, setWishlist] = useState([]);
  // Comparison list (temporary per session)
  const [compareList, setCompareList] = useState([]);

  // Active filter state
  const [filters, setFilters] = useState({
    keyword: '',
    location: 'all',
    category: 'all',
    bhk: 'all',
    minPrice: 0,
    maxPrice: 15000000,
    facing: 'all',
    availability: 'all',
    approval: 'all',
    sortBy: 'featured'
  });

  // Load wishlist when user changes
  useEffect(() => {
    const userKey = user ? `${WISHLIST_PREFIX}${user.id}` : `${WISHLIST_PREFIX}guest`;
    try {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        setWishlist(JSON.parse(saved));
      } else {
        // default 2 wishlist items for demo user Prakash
        if (user && user.id === 'usr_prakash_101') {
          const initialWishlist = ['ph-101', 'ph-104'];
          setWishlist(initialWishlist);
          localStorage.setItem(userKey, JSON.stringify(initialWishlist));
        } else {
          setWishlist([]);
        }
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  }, [user]);

  // Save wishlist to localStorage
  const saveWishlist = (newList) => {
    setWishlist(newList);
    const userKey = user ? `${WISHLIST_PREFIX}${user.id}` : `${WISHLIST_PREFIX}guest`;
    try {
      localStorage.setItem(userKey, JSON.stringify(newList));
    } catch (err) {
      console.error('Failed to save wishlist:', err);
    }
  };

  // Toggle wishlist
  const toggleWishlist = (propertyId) => {
    const exists = wishlist.includes(propertyId);
    let updated;
    const prop = properties.find((p) => p.id === propertyId);
    const propTitle = prop ? prop.title : 'Property';

    if (exists) {
      updated = wishlist.filter((id) => id !== propertyId);
      addToast(`Removed "${propTitle}" from your wishlist.`, 'info');
    } else {
      updated = [...wishlist, propertyId];
      addToast(`Saved "${propTitle}" to your wishlist!`, 'success');
    }
    saveWishlist(updated);
  };

  const isWishlisted = (propertyId) => wishlist.includes(propertyId);

  const getWishlistProperties = () => {
    return properties.filter((p) => wishlist.includes(p.id));
  };

  // Compare handlers
  const toggleCompare = (property) => {
    const exists = compareList.some((p) => p.id === property.id);
    if (exists) {
      setCompareList((prev) => prev.filter((p) => p.id !== property.id));
      addToast(`Removed "${property.title}" from comparison.`, 'info');
    } else {
      if (compareList.length >= 4) {
        addToast('You can compare a maximum of 4 properties at a time.', 'error');
        return;
      }
      setCompareList((prev) => [...prev, property]);
      addToast(`Added "${property.title}" to compare table.`, 'success');
    }
  };

  const isCompared = (propertyId) => compareList.some((p) => p.id === propertyId);
  const clearCompare = () => setCompareList([]);

  // Submit Enquiry
  const submitEnquiry = async (enquiryData) => {
    const prop = properties.find((p) => p.id === enquiryData.propertyId);
    const newEnq = {
      id: 'enq_' + Date.now(),
      userId: user ? user.id : 'guest_' + Date.now(),
      propertyId: enquiryData.propertyId || '',
      propertyTitle: prop ? prop.title : (enquiryData.propertyTitle || 'General Enquiry'),
      propertyLocation: prop ? prop.location : 'Chennai',
      propertyPrice: prop ? prop.priceDisplay : '',
      propertyImg: prop ? prop.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      date: new Date().toISOString().split('T')[0],
      name: enquiryData.name,
      email: enquiryData.email,
      phone: enquiryData.phone,
      message: enquiryData.message || 'Customer requested detailed property consultation.',
      visitDate: enquiryData.visitDate || '',
      status: 'New',
      salesNotes: 'Enquiry received. Priority sales representative assigned.'
    };

    const updated = [newEnq, ...enquiries];
    setEnquiries(updated);
    try {
      localStorage.setItem(STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    addToast('Your enquiry has been successfully registered! Our property specialist will call you shortly.', 'success');
    return newEnq;
  };

  // Get user's enquiries
  const getUserEnquiries = () => {
    if (!user) return [];
    if (user.role === 'admin') return enquiries;
    return enquiries.filter((e) => e.userId === user.id || (user.email && e.email === user.email));
  };

  // Admin update enquiry status
  const updateEnquiryStatus = (id, newStatus, newNotes) => {
    const updated = enquiries.map((enq) => {
      if (enq.id === id) {
        return {
          ...enq,
          status: newStatus,
          salesNotes: newNotes !== undefined ? newNotes : enq.salesNotes
        };
      }
      return enq;
    });
    setEnquiries(updated);
    localStorage.setItem(STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
    addToast('Enquiry status updated.', 'success');
  };

  // Admin property management
  const adminAddProperty = (newProperty) => {
    const updated = [newProperty, ...properties];
    setProperties(updated);
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(updated));
    addToast('Property added successfully to catalog!', 'success');
  };

  const adminUpdateProperty = (id, updatedFields) => {
    const updated = properties.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProperties(updated);
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(updated));
    addToast('Property updated successfully!', 'success');
  };

  const adminDeleteProperty = (id) => {
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(updated));
    addToast('Property removed from catalog.', 'info');
  };

  // Reset search filters
  const resetFilters = () => {
    setFilters({
      keyword: '',
      location: 'all',
      category: 'all',
      bhk: 'all',
      minPrice: 0,
      maxPrice: 15000000,
      facing: 'all',
      availability: 'all',
      approval: 'all',
      sortBy: 'featured'
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isWishlisted,
        getWishlistProperties,
        compareList,
        toggleCompare,
        isCompared,
        clearCompare,
        enquiries,
        submitEnquiry,
        getUserEnquiries,
        updateEnquiryStatus,
        adminAddProperty,
        adminUpdateProperty,
        adminDeleteProperty,
        filters,
        setFilters,
        resetFilters
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
