import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Property {
  id: string;
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
  createdAt: string;
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  searchProperties: (filters: PropertyFilters) => Property[];
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

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

import heroVilla from '@/assets/hero-villa.jpg';

// Sample data
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
    images: [heroVilla],
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
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties));
    } else {
      setProperties(sampleProperties);
      localStorage.setItem('properties', JSON.stringify(sampleProperties));
    }
  }, []);

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedProperties = [...properties, newProperty];
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    const updatedProperties = properties.map(property =>
      property.id === id ? { ...property, ...updates } : property
    );
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
  };

  const deleteProperty = (id: string) => {
    const updatedProperties = properties.filter(property => property.id !== id);
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
  };

  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const searchProperties = (filters: PropertyFilters) => {
    return properties.filter(property => {
      if (filters.search && !property.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !property.location.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.location && property.location !== filters.location) {
        return false;
      }
      if (filters.type && property.type !== filters.type) {
        return false;
      }
      if (filters.category && property.category !== filters.category) {
        return false;
      }
      if (filters.minPrice && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false;
      }
      if (filters.bedrooms && property.bedrooms !== filters.bedrooms) {
        return false;
      }
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