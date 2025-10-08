import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Home, 
  Maximize2, 
  Filter,
  DollarSign,
  Bed,
  Bath,
  Ruler,
  Star,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

// Sample properties
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              Property Map Explorer
            </h1>
            <p className="text-muted-foreground mt-1">Discover properties on an interactive map</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-sm">{sampleProperties.length} Properties</Badge>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by location, property name, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-base bg-background border-border"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4">
              <div className="p-4 bg-muted/50 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Map */}
      <div className="flex-1 h-[calc(100vh-200px)] w-full">
        <MapContainer center={[12.9716, 77.5946]} zoom={4} className="w-full h-full rounded-lg shadow-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {sampleProperties.map((property) => (
            <Marker key={property.id} position={[property.position.lat, property.position.lng]}>
              <Popup>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold">{property.title}</h3>
                  <p>{property.location}</p>
                  <p>{property.price}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
  