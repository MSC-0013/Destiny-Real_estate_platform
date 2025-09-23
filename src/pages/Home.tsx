import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Search, Shield, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProperty, PropertyFilters } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';

const Home = () => {
  const navigate = useNavigate();
  const { properties, searchProperties } = useProperty();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState(properties);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!hasSearched) {
      setSearchResults(properties.filter(p => p.featured).slice(0, 6));
    }
  }, [properties, hasSearched]);

  const handleSearch = (filters: PropertyFilters) => {
    const results = searchProperties(filters);
    setSearchResults(results);
    setHasSearched(true);
  };

  const stats = [
    { icon: Users, label: 'Happy Clients', value: '10,000+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Shield, label: 'Years Experience', value: '15+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-luxury/20 pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/hero-villa.jpg')] bg-cover bg-center opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <Badge className="mb-6 bg-luxury/20 text-luxury border-luxury/30">
              #1 Real Estate Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Find Your Dream
              <span className="block bg-gradient-to-r from-luxury to-accent bg-clip-text text-transparent">
                Property Today
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Discover the perfect home, apartment, or investment property with our comprehensive 
              real estate platform. Buy, sell, or rent with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-luxury hover:bg-luxury/90 text-luxury-foreground">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {!user && (
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury/10 text-luxury rounded-full mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {hasSearched ? 'Search Results' : 'Featured Properties'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {hasSearched 
                ? `Found ${searchResults.length} properties matching your criteria`
                : 'Discover our handpicked selection of premium properties'
              }
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {searchResults.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}

          {!hasSearched && (
            <div className="text-center">
              <Button onClick={() => navigate('/properties')} size="lg">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-luxury text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join thousands of satisfied customers who found their dream homes with EstateHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                    Sign Up Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Learn More
                  </Button>
                </>
              ) : (
                <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                  Browse Properties
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;