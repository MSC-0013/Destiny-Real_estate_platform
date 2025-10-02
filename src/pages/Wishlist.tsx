import { useWishlist } from '@/contexts/WishlistContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import { Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { properties } = useProperty();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const wishlistProperties = properties.filter(property =>
    wishlist.includes(property.id)
  );

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header with item count */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" /> My Wishlist
          </h1>
          {wishlistProperties.length > 0 && (
            <span className="bg-primary text-white text-sm px-4 py-2 rounded-full shadow">
              {wishlistProperties.length} {wishlistProperties.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* Wishlist items */}
        {wishlistProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-16 bg-muted rounded-xl shadow-inner">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</p>
            <p className="text-muted-foreground">
              Start browsing properties and add them to your wishlist!
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
