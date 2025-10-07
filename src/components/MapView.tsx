import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Home, 
  Building2, 
  Maximize2, 
  Filter,
  DollarSign,
  Bed,
  Bath,
  Ruler,
  Star,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Sample properties for demonstration
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
  }
];

const MapView = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain'>('default');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-8 w-8 text-primary" />
                Property Map Explorer
              </h1>
              <p className="text-muted-foreground mt-1">Discover properties on an interactive map</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {sampleProperties.length} Properties
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by location, property name, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-base bg-background border-border"
            />
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-muted/50 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Property Type</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground">
                      <option>All Types</option>
                      <option>Villa</option>
                      <option>Apartment</option>
                      <option>House</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground">
                      <option>All Prices</option>
                      <option>₹50L - ₹1Cr</option>
                      <option>₹1Cr - ₹5Cr</option>
                      <option>₹5Cr+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Bedrooms</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground">
                      <option>Any</option>
                      <option>1+</option>
                      <option>2+</option>
                      <option>3+</option>
                      <option>4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Area</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground">
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
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-250px)] lg:h-[calc(100vh-200px)]">
        {/* Map Container */}
        <div className="flex-1 relative bg-gradient-to-br from-muted/20 via-background to-muted/30 border-r border-border">
          {/* Map Style Selector */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant={mapStyle === 'default' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapStyle('default')}
              className="shadow-lg"
            >
              Default
            </Button>
            <Button
              variant={mapStyle === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapStyle('satellite')}
              className="shadow-lg"
            >
              Satellite
            </Button>
            <Button
              variant={mapStyle === 'terrain' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapStyle('terrain')}
              className="shadow-lg"
            >
              Terrain
            </Button>
          </div>

          {/* Map Controls */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
            <Button variant="outline" size="icon" className="shadow-lg bg-card">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shadow-lg bg-card">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shadow-lg bg-card">
              <Navigation className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shadow-lg bg-card">
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Simulated Map with Property Pins */}
          <div className="w-full h-full relative overflow-hidden">
            {/* Grid pattern for visual effect */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-12 gap-px h-full">
                {[...Array(144)].map((_, i) => (
                  <div key={i} className="border border-border" />
                ))}
              </div>
            </div>

            {/* Property Pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              {sampleProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                    >
                      <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-xl border-4 border-background">
                        <Home className="h-6 w-6" />
                      </div>
                    </motion.div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-primary" />
                    <Badge className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap shadow-lg">
                      {property.price}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Info className="h-4 w-4 text-primary" />
                <span>Click on property pins to view details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property List Sidebar */}
        <div className="w-full lg:w-96 bg-card overflow-y-auto border-l border-border">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Available Properties
            </h2>
          </div>

          <div className="p-4 space-y-4">
            {sampleProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedProperty?.id === property.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {property.type}
                    </Badge>
                    <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-semibold">{property.rating}</span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-2 text-lg">{property.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Ruler className="h-4 w-4" />
                        <span className="text-xs">{property.area}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-primary font-bold text-lg">
                        <DollarSign className="h-5 w-5" />
                        <span>{property.price}</span>
                      </div>
                      <Button size="sm" className="gap-2">
                        View Details
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
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
