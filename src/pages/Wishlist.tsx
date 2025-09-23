import { useWishlist } from '@/contexts/WishlistContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import { Navigate } from 'react-router-dom';

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
        <h1 className="text-4xl font-bold text-foreground mb-8">My Wishlist</h1>
        
        {wishlistProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Your wishlist is empty</p>
            <p className="text-muted-foreground">Start browsing properties to add them to your wishlist!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;