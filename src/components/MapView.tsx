import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Filter,
  Bed,
  Bath,
  Ruler,
  Star,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  rating: number;
  position: { lat: number; lng: number };
}

// Sample properties with coordinates
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    price: '₹8,50,00,000',
    location: 'Bangalore, Karnataka',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '3500 sq.ft',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    rating: 4.8,
    position: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '2',
    title: 'Premium Apartment',
    price: '₹1,20,00,000',
    location: 'Mumbai, Maharashtra',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: '1800 sq.ft',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    rating: 4.5,
    position: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: '3',
    title: 'Contemporary House',
    price: '₹95,00,000',
    location: 'Pune, Maharashtra',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: '2200 sq.ft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    rating: 4.6,
    position: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: '4',
    title: 'Waterfront Villa',
    price: '₹12,00,00,000',
    location: 'Goa',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: '4500 sq.ft',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    rating: 4.9,
    position: { lat: 15.2993, lng: 74.1240 }
  }
];

const MapView = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamic import of leaflet
    import('leaflet').then((L) => {
      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map
      const map = L.map(mapRef.current!).setView([15.5, 75.5], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Add markers
      sampleProperties.forEach((property) => {
        const marker = L.marker([property.position.lat, property.position.lng]).addTo(map);
        
        const popupContent = `
          <div style="width: 250px;">
            <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0;" />
            <div style="padding: 12px;">
              <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 14px;">${property.title}</h3>
              <p style="color: #666; font-size: 12px; margin: 4px 0; display: flex; align-items: center; gap: 4px;">
                📍 ${property.location}
              </p>
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #666; margin: 8px 0;">
                <span>🛏️ ${property.bedrooms} Beds</span>
                <span>🚿 ${property.bathrooms} Baths</span>
                <span>📐 ${property.area}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #eee;">
                <p style="font-size: 16px; font-weight: bold; color: hsl(var(--primary)); margin: 0;">${property.price}</p>
                <span style="font-size: 12px;">⭐ ${property.rating}</span>
              </div>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', () => setSelectedProperty(property));
      });

      setMapInstance(map);

      return () => {
        map.remove();
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border p-4 md:p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              Property Map Explorer
            </h1>
            <p className="text-muted-foreground mt-1">Discover your dream property on an interactive map</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              <Home className="h-3 w-3 mr-1" />
              {sampleProperties.length} Properties
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)} 
              className="gap-2 hover:bg-primary/10"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by location, property name, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-base bg-background/50 border-border focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4"
            >
              <div className="p-4 bg-muted/30 backdrop-blur-sm rounded-lg border border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Property Type</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50">
                    <option>All Types</option>
                    <option>Villa</option>
                    <option>Apartment</option>
                    <option>House</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50">
                    <option>All Prices</option>
                    <option>₹50L - ₹1Cr</option>
                    <option>₹1Cr - ₹5Cr</option>
                    <option>₹5Cr+</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Bedrooms</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50">
                    <option>Any</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Area</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50">
                    <option>Any Size</option>
                    <option>1000-2000 sq.ft</option>
                    <option>2000-3000 sq.ft</option>
                    <option>3000+ sq.ft</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Container */}
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-2 border-primary/20">
            <div 
              ref={mapRef}
              className="h-[calc(100vh-280px)] md:h-[600px] w-full z-0"
            />
          </Card>

          {/* Property List Below Map */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sampleProperties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary/50"
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-40 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm">
                      {property.type}
                    </Badge>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{property.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-base line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        {property.area}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-primary pt-2 border-t">{property.price}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
