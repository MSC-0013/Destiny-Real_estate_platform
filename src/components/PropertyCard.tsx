import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import { Property } from '@/contexts/PropertyContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, className }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property.id);
    }
  };

  const formatPrice = (price: number, category: string) => {
    if (category === 'rent') {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <Card className={cn("group overflow-hidden transition-all hover:shadow-lg", className)}>
      <Link to={`/property/${property.id}`}>
        <div className="relative">
          <img
            src={property.images[0] || '/placeholder.svg'}
            alt={property.title}
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge 
              variant={property.category === 'sale' ? 'default' : 'secondary'}
              className="bg-background/90 text-foreground"
            >
              {property.category === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
            {property.featured && (
              <Badge className="bg-luxury text-luxury-foreground">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWishlistToggle}
              className={cn(
                "absolute top-3 right-3 h-8 w-8 bg-background/90 hover:bg-background",
                isInWishlist(property.id) ? "text-red-500" : "text-muted-foreground"
              )}
            >
              <Heart 
                className={cn(
                  "h-4 w-4",
                  isInWishlist(property.id) && "fill-current"
                )} 
              />
            </Button>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight">{property.title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-luxury">
                {formatPrice(property.price, property.category)}
              </div>
            </div>

            {property.type !== 'land' && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms}
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms}
                  </div>
                )}
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {property.area} sq ft
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PropertyCard;