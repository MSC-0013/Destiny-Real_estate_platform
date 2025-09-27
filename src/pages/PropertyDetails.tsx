import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useProperty } from '@/contexts/PropertyContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MapPin, Home, Bath, Square, Calendar, IndianRupee, ShoppingCart, Key } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProperty } = useProperty();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  if (!id) return <Navigate to="/properties" replace />;
  
  const property = getProperty(id);
  
  if (!property) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Property Not Found</h1>
            <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
          </div>
        </div>
      </main>
    );
  }

  const handleWishlistToggle = () => {
    if (!user) return;
    
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property.id);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Images */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={property.images[0] || '/placeholder.svg'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {property.images.slice(1, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    className="aspect-video rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Property Details */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.address}</span>
                </div>
              </div>
              {user && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlistToggle}
                  className="shrink-0"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(property.id) ? 'fill-current text-red-500' : ''}`} />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant={property.category === 'sale' ? 'default' : 'secondary'}>
                {property.category === 'sale' ? 'For Sale' : 'For Rent'}
              </Badge>
              <Badge variant="outline">{property.type}</Badge>
              {property.available && <Badge className="bg-green-500">Available</Badge>}
            </div>
            
            <div className="text-3xl font-bold text-primary flex items-center gap-1">
              <IndianRupee className="w-8 h-8" />
              {property.price.toLocaleString()}
              {property.category === 'rent' && <span className="text-lg text-muted-foreground">/month</span>}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-muted-foreground" />
                  <span>{property.bedrooms} beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-muted-foreground" />
                  <span>{property.bathrooms} baths</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-muted-foreground" />
                <span>{property.area} sq ft</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>
            
            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Contact Seller</h3>
              <p className="text-muted-foreground mb-1">{property.sellerName}</p>
              <p className="text-muted-foreground">{property.sellerPhone}</p>
            </div>
            
            {/* Purchase/Rent Actions */}
            {property.available && user ? (
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {property.category === 'sale' ? 'Purchase This Property' : 'Rent This Property'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      size="lg" 
                      className="flex items-center gap-2 h-12"
                      onClick={() => navigate(`/contract/${id}/${property.category === 'sale' ? 'buy' : 'rent'}`)}
                    >
                      {property.category === 'sale' ? (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Buy Now
                        </>
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          Rent Now
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex items-center gap-2 h-12"
                      onClick={() => {
                        // Contact seller functionality
                        window.open(`tel:${property.sellerPhone}`, '_self');
                      }}
                    >
                      <MapPin className="w-5 h-5" />
                      Contact Seller
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Secure transaction • Digital contract • Instant processing
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : !property.available ? (
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-red-800 mb-2">
                    {property.category === 'sale' ? 'Property Sold' : 'Property Rented'}
                  </h3>
                  <p className="text-red-600">
                    This property is no longer available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center">
                <Button onClick={() => navigate('/login')} size="lg">
                  Login to {property.category === 'sale' ? 'Purchase' : 'Rent'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetails;