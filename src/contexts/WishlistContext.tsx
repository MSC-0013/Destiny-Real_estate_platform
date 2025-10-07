import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from '@/utils/api';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (propertyId: string) => void;
  removeFromWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // Load wishlist from backend or localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) return setWishlist([]);

      try {
        const res = await API.get(`/wishlist/${user._id}`);
        if (res.data?.wishlist) {
          setWishlist(res.data.wishlist);
          localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(res.data.wishlist));
        } else {
          const savedWishlist = localStorage.getItem(`wishlist_${user._id}`);
          if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        }
      } catch (err) {
        console.warn('Failed to fetch wishlist from backend, using localStorage', err);
        const savedWishlist = localStorage.getItem(`wishlist_${user._id}`);
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      }
    };
    loadWishlist();
  }, [user]);

  const addToWishlist = async (propertyId: string) => {
    if (!user || wishlist.includes(propertyId)) return;

    const updatedWishlist = [...wishlist, propertyId];
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(updatedWishlist));

    try {
      await API.post(`/wishlist/${user._id}/add`, { propertyId });
    } catch (err) {
      console.error('Failed to sync wishlist add with backend:', err);
    }
  };

  const removeFromWishlist = async (propertyId: string) => {
    if (!user) return;

    const updatedWishlist = wishlist.filter(id => id !== propertyId);
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(updatedWishlist));

    try {
      await API.post(`/wishlist/${user._id}/remove`, { propertyId });
    } catch (err) {
      console.error('Failed to sync wishlist remove with backend:', err);
    }
  };

  const isInWishlist = (propertyId: string) => wishlist.includes(propertyId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
