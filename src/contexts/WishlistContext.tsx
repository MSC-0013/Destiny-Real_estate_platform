import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = (propertyId: string) => {
    if (!user || wishlist.includes(propertyId)) return;
    
    const updatedWishlist = [...wishlist, propertyId];
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = (propertyId: string) => {
    if (!user) return;
    
    const updatedWishlist = wishlist.filter(id => id !== propertyId);
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
  };

  const isInWishlist = (propertyId: string) => {
    return wishlist.includes(propertyId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};