import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty, Property, PropertyFilters } from '@/contexts/PropertyContext';
import MapView from "@/components/MapView";
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Grid3x3, List, SlidersHorizontal, TrendingUp, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const { properties, searchProperties } = useProperty();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Wait until properties are loaded
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background pt-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Your Dream Property
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Explore premium properties across India with verified listings and transparent pricing
            </p>
          </motion.div>
        </div>
      </div>

      {/* Map View */}
      <div className="mb-8">
        <MapView />
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-2xl border border-border p-6 mb-8"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Building2 className="h-4 w-4 mr-2" />
              {filteredProperties.length} Properties
            </Badge>
            {filters.category && (
              <Badge className="text-base px-4 py-2 bg-primary/10 text-primary">
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
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="text-center py-20">Loading properties...</div>
        ) : filteredProperties.length > 0 ? (
          <motion.div
            className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "flex flex-col gap-6"
            }
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
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
              We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
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
    </main>
  );
};

export default Properties;