import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '@/utils/api';

export interface Property {
  id: string;            // local/frontend ID
  _id?: string;          // MongoDB ID
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  type: 'house' | 'apartment' | 'villa' | 'land' | 'commercial';
  category: 'sale' | 'rent';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  amenities: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  featured: boolean;
  available: boolean;
  rentDuration?: '1month' | '6months' | '1year' | 'custom';
  constructionStatus?: 'completed' | 'under-construction' | 'planned';
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface PropertyFilters {
  search?: string;
  location?: string;
  type?: string;
  category?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  amenities?: string[];
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  searchProperties: (filters: PropertyFilters) => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error('useProperty must be used within PropertyProvider');
  return context;
};

// Sample properties for initial load
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Modern Villa',
    description: 'Beautiful 4-bedroom villa with pool and garden in prime location.',
    price: 850000,
    location: 'Beverly Hills',
    address: '123 Sunset Boulevard, Beverly Hills, CA 90210',
    type: 'villa',
    category: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    images: [],
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Security System'],
    sellerId: 'seller-1',
    sellerName: 'John Smith',
    sellerPhone: '+1 555 0123',
    featured: true,
    available: true,
    constructionStatus: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Downtown Luxury Apartment',
    description: 'Spacious 2-bedroom apartment in the heart of downtown.',
    price: 2500,
    location: 'Downtown',
    address: '456 Main Street, Downtown, CA 90001',
    type: 'apartment',
    category: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['/placeholder.svg'],
    amenities: ['Gym', 'Rooftop', 'Concierge', 'Parking'],
    sellerId: 'seller-1',
    sellerName: 'Jane Doe',
    sellerPhone: '+1 555 0124',
    featured: true,
    available: true,
    rentDuration: '1year',
    createdAt: new Date().toISOString(),
  },
];

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await API.get('/properties');

        // Normalize each property to always have an 'id' (fallback to _id)
        const normalized = res.data.map((prop: any) => ({
          ...prop,
          id: prop._id || prop.id,
        }));

        // Normalize each property: ensure numeric price & boolean available
        const cleaned = normalized.map(p => ({
          ...p,
          price: Number(p.price) || 0,
          available: Boolean(p.available),
        }));

        setProperties(cleaned); // update state
        localStorage.setItem('properties', JSON.stringify(cleaned)); // update localStorage

      } catch (err) {
        console.warn('⚠️ Failed to fetch from backend, using localStorage/sample:', err);

        const saved = localStorage.getItem('properties');
        if (saved) {
          const parsed = JSON.parse(saved);
          const normalized = parsed.map((p: any) => ({ ...p, id: p.id || p._id }));
          setProperties(normalized);
        } else {
          setProperties(sampleProperties);
          localStorage.setItem('properties', JSON.stringify(sampleProperties));
        }
      }
    };

    loadProperties();
  }, []);

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    try {
      // Send to backend first (includes Cloudinary upload)
      const res = await API.post('/properties', propertyData);
      
      const newProperty: Property = {
        ...res.data,
        id: res.data._id,
        _id: res.data._id,
      };

      setProperties(prev => {
        const updated = [...prev, newProperty];
        localStorage.setItem('properties', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Error creating property:', err);
      
      // Fallback to local storage
      const newProperty: Property = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      setProperties(prev => {
        const updated = [...prev, newProperty];
        localStorage.setItem('properties', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      // Update backend first (includes Cloudinary upload if images changed)
      const res = await API.put(`/properties/${id}`, updates);
      
      const updatedProperties = properties.map(prop =>
        prop.id === id || prop._id === id ? { ...prop, ...res.data } : prop
      );
      
      setProperties(updatedProperties);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
    } catch (err) {
      console.error('Error updating property:', err);
      
      // Fallback to local update
      const updatedProperties = properties.map(prop =>
        prop.id === id || prop._id === id ? { ...prop, ...updates } : prop
      );
      setProperties(updatedProperties);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
    }
  };

  const deleteProperty = async (id: string) => {
    const updatedProperties = properties.filter(prop => prop.id !== id && prop._id !== id);
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));

    try {
      await API.delete(`/properties/${id}`);
    } catch (err) {
      console.error('Error deleting property in backend:', err);
    }
  };

  const getProperty = (id: string) =>
    properties.find(prop => prop.id === id || prop._id === id);

  const searchProperties = (filters: PropertyFilters) => {
    return properties.filter(prop => {
      if (!prop.available) return false;
      if (filters.search && !prop.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !prop.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.location && prop.location !== filters.location) return false;
      if (filters.type && prop.type !== filters.type) return false;
      if (filters.category && prop.category !== filters.category) return false;
      if (filters.minPrice && prop.price < filters.minPrice) return false;
      if (filters.maxPrice && prop.price > filters.maxPrice) return false;
      if (filters.bedrooms && prop.bedrooms !== filters.bedrooms) return false;
      return true;
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getProperty,
        searchProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
