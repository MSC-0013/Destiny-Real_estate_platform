import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty, Property, PropertyFilters } from '@/contexts/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, Grid3x3, List, SlidersHorizontal, TrendingUp, MapPin, Map as MapIcon, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const { properties, searchProperties } = useProperty();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Filter properties that have coordinates
  const propertiesWithCoords = filteredProperties.filter(
    p => p.latitude && p.longitude
  );

  useEffect(() => {
    if (properties.length === 0) return;

    const category = searchParams.get('category') as 'sale' | 'rent' | null;
    const initialFilters: PropertyFilters = {};
    if (category) initialFilters.category = category;

    setFilters(initialFilters);
    const results = searchProperties(initialFilters);
    setFilteredProperties(results);
    setIsLoading(false);
  }, [searchParams, properties, searchProperties]);

  const handleSearch = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    const results = searchProperties(newFilters);
    setFilteredProperties(results);
  };

  // Initialize map
  useEffect(() => {
    if (!showMap || typeof window === 'undefined' || !mapRef.current) return;

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!).setView([20.5937, 78.9629], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      propertiesWithCoords.forEach((property) => {
        const marker = L.marker([property.latitude!, property.longitude!]).addTo(map);
        
        const popupContent = `
          <div style="width: 250px;">
            ${property.images[0] ? `<img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0;" />` : ''}
            <div style="padding: 12px;">
              <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 14px;">${property.title}</h3>
              <p style="color: #666; font-size: 12px; margin: 4px 0;">📍 ${property.location}</p>
              ${property.bedrooms ? `
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #666; margin: 8px 0;">
                <span>🛏️ ${property.bedrooms}</span>
                <span>🚿 ${property.bathrooms}</span>
                <span>📐 ${property.area} sq.ft</span>
              </div>` : ''}
              <div style="padding-top: 8px; border-top: 1px solid #eee;">
                <p style="font-size: 16px; font-weight: bold; color: hsl(var(--primary)); margin: 0;">₹${property.price.toLocaleString()}</p>
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
  }, [showMap, propertiesWithCoords.length]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background pt-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Premium Listings
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Your Dream Property
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Explore premium properties across India with verified listings and transparent pricing
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-2xl border border-border p-4 md:p-6 mb-6"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        {/* Map Section - Always Visible at Top */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="overflow-hidden shadow-xl border-2 border-primary/20">
                <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b">
                  <div className="flex items-center gap-3">
                    <MapIcon className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-lg">Property Map View</h2>
                    <Badge variant="secondary" className="text-xs">
                      {propertiesWithCoords.length} properties with location
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMap(false)}
                    className="gap-2"
                  >
                    <ChevronUp className="h-4 w-4" />
                    Hide Map
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Map */}
                  <div className="lg:col-span-2 relative">
                    <div 
                      ref={mapRef}
                      className="h-[400px] md:h-[500px] w-full"
                    />
                    {propertiesWithCoords.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
                        <div className="text-center p-6">
                          <MapIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">No properties with location data to display on map</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property List Sidebar */}
                  <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l bg-muted/30">
                    <div className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        All Properties ({filteredProperties.length})
                      </h3>
                      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredProperties.length > 0 ? (
                          filteredProperties.map((property) => (
                            <motion.div
                              key={property.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                setSelectedProperty(property);
                                if (mapInstance && property.latitude && property.longitude) {
                                  mapInstance.setView([property.latitude, property.longitude], 13);
                                }
                              }}
                            >
                              <Card className={`overflow-hidden cursor-pointer transition-all border-2 ${
                                selectedProperty?.id === property.id ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'
                              }`}>
                                <div className="flex gap-3 p-3">
                                  {property.images[0] ? (
                                    <img 
                                      src={property.images[0]} 
                                      alt={property.title}
                                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-lg flex-shrink-0">
                                      <Home className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm line-clamp-1">{property.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                      <MapPin className="h-3 w-3 inline mr-1" />
                                      {property.location}
                                    </p>
                                    <p className="text-sm font-bold text-primary mt-1">₹{property.price.toLocaleString()}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs capitalize">{property.type}</Badge>
                                      {!property.latitude && (
                                        <span className="text-xs text-muted-foreground">No map data</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No properties found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show Map Button (when hidden) */}
        {!showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Button
              variant="outline"
              onClick={() => setShowMap(true)}
              className="w-full gap-2 border-2 border-dashed hover:border-primary"
            >
              <MapIcon className="h-4 w-4" />
              Show Map View
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-base md:text-lg px-3 md:px-4 py-2">
              <Building2 className="h-4 w-4 mr-2" />
              {filteredProperties.length} Properties
            </Badge>
            {filters.category && (
              <Badge className="text-sm md:text-base px-3 md:px-4 py-2 bg-primary/10 text-primary">
                <MapPin className="h-3 w-3 mr-1" />
                {filters.category === 'sale' ? 'For Sale' : 'For Rent'}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>

        {/* Properties Grid/List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <motion.div
            className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              : "flex flex-col gap-6"
            }
          >
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No Properties Found
            </h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. Try adjusting your filters.
            </p>
            <Button onClick={() => handleSearch({})} size="lg">
              Clear All Filters
            </Button>
          </motion.div>
        )}

        {/* Load More */}
        {filteredProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 mb-8"
          >
            <Button size="lg" variant="outline" className="gap-2">
              Load More Properties
              <TrendingUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.8);
        }
      `}</style>
    </main>
  );
};

export default Properties;