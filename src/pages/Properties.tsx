import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty } from '@/contexts/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { PropertyFilters } from '@/contexts/PropertyContext';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const { properties, searchProperties } = useProperty();
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [filters, setFilters] = useState<PropertyFilters>({});

  useEffect(() => {
    const category = searchParams.get('category') as 'sale' | 'rent' | null;
    const initialFilters: PropertyFilters = {};
    
    if (category) {
      initialFilters.category = category;
    }
    
    setFilters(initialFilters);
    const results = searchProperties(initialFilters);
    setFilteredProperties(results);
  }, [searchParams, properties, searchProperties]);

  const handleSearch = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    const results = searchProperties(newFilters);
    setFilteredProperties(results);
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Properties</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        <div className="mt-8">
          <p className="text-muted-foreground mb-6">
            {filteredProperties.length} properties found
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No properties match your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Properties;