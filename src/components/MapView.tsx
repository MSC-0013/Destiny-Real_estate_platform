import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProperty } from '@/contexts/PropertyContext';
import { 
  MapPin, 
  Search, 
  Filter,
  Bed,
  Bath,
  Ruler,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const { properties } = useProperty();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Filter properties that have coordinates
  const propertiesWithCoords = properties.filter(
    p => p.latitude && p.longitude
  );

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

      // Create map - center on India
      const map = L.map(mapRef.current!).setView([20.5937, 78.9629], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for properties with coordinates
      propertiesWithCoords.forEach((property) => {
        const marker = L.marker([property.latitude!, property.longitude!]).addTo(map);
        
        const popupContent = `
          <div style="width: 250px;">
            ${property.images[0] ? `<img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0;" />` : ''}
            <div style="padding: 12px;">
              <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 14px;">${property.title}</h3>
              <p style="color: #666; font-size: 12px; margin: 4px 0; display: flex; align-items: center; gap: 4px;">
                📍 ${property.location}
              </p>
              ${property.bedrooms ? `
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #666; margin: 8px 0;">
                <span>🛏️ ${property.bedrooms} Beds</span>
                <span>🚿 ${property.bathrooms} Baths</span>
                <span>📐 ${property.area} sq.ft</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #eee;">
                <p style="font-size: 16px; font-weight: bold; color: hsl(var(--primary)); margin: 0;">₹${property.price.toLocaleString()}</p>
                <span style="font-size: 12px; background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">${property.type}</span>
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
  }, [propertiesWithCoords.length]);

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
              {propertiesWithCoords.length} Properties
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
          {propertiesWithCoords.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Properties on Map ({propertiesWithCoords.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {propertiesWithCoords.map((property) => (
                  <motion.div
                    key={property.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary/50 h-full flex flex-col"
                      onClick={() => {
                        setSelectedProperty(property);
                        if (mapInstance && property.latitude && property.longitude) {
                          mapInstance.setView([property.latitude, property.longitude], 13);
                        }
                      }}
                    >
                      <div className="relative">
                        {property.images[0] ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-40 object-cover"
                          />
                        ) : (
                          <div className="w-full h-40 bg-muted flex items-center justify-center">
                            <Home className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm capitalize">
                          {property.type}
                        </Badge>
                        {property.featured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col">
                        <h3 className="font-semibold text-base line-clamp-1">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{property.location}</span>
                        </p>
                        {property.bedrooms && (
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
                              {property.area} sq.ft
                            </span>
                          </div>
                        )}
                        <div className="flex-1"></div>
                        <div className="pt-2 border-t flex items-center justify-between">
                          <p className="text-lg font-bold text-primary">₹{property.price.toLocaleString()}</p>
                          <Badge variant="outline" className="capitalize text-xs">
                            {property.category}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
              <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Properties with Location Data</h3>
              <p className="text-muted-foreground">
                Properties need latitude and longitude coordinates to appear on the map.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;