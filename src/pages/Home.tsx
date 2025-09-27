import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Search, 
  Shield, 
  Award, 
  Users,
  Home as HomeIcon,
  Building,
  Hammer,
  Palette,
  IndianRupee,
  CheckCircle,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProperty, PropertyFilters } from '@/contexts/PropertyContext';
import { useConstruction } from '@/contexts/ConstructionContext';
import { useAuth } from '@/contexts/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';

const Home = () => {
  const navigate = useNavigate();
  const { properties, searchProperties } = useProperty();
  const { projects } = useConstruction();
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
    { icon: Users, label: 'Happy Clients', value: '10,000+', color: 'text-blue-600' },
    { icon: Building, label: 'Properties Sold', value: '2,500+', color: 'text-green-600' },
    { icon: Hammer, label: 'Projects Built', value: '500+', color: 'text-purple-600' },
    { icon: Award, label: 'Years Experience', value: '15+', color: 'text-yellow-600' },
  ];

  const services = [
    {
      icon: HomeIcon,
      title: 'Premium Properties',
      description: 'Luxury homes, apartments, and commercial spaces in prime locations',
      features: ['Verified Properties', 'Virtual Tours', 'Price Transparency', 'Legal Support'],
      color: 'from-blue-500 to-blue-700',
      link: '/properties'
    },
    {
      icon: Hammer,
      title: 'Custom Construction',
      description: 'Build your dream home from ground up with our expert team',
      features: ['Expert Contractors', 'Quality Materials', 'Timeline Management', 'Cost Control'],
      color: 'from-purple-500 to-purple-700',
      link: '/construction'
    },
    {
      icon: Palette,
      title: 'Interior Design',
      description: 'Professional interior design services to transform your space',
      features: ['3D Visualization', 'Custom Furniture', 'Space Planning', 'Style Consultation'],
      color: 'from-pink-500 to-pink-700',
      link: '/construction'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(59, 130, 246, 0.3)), url('/src/assets/hero-villa.jpg')`
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-2000" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 mb-4 px-6 py-2 text-lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Welcome to Destiny
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
              Destiny
            </span>
            <span className="block text-4xl md:text-5xl mt-4 text-gray-100">
              Where Dreams Meet Reality
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Premium real estate • Custom construction • Interior design
            <br className="hidden md:block" />
            Your complete home solution partner
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <HomeIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Premium Properties</h3>
              <p className="text-gray-300 text-sm">Luxury homes in prime locations</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Hammer className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Custom Construction</h3>
              <p className="text-gray-300 text-sm">Build your dream home from scratch</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Palette className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Interior Design</h3>
              <p className="text-gray-300 text-sm">Professional design services</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/properties')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              <Search className="mr-3 h-5 w-5" />
              Explore Properties
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              onClick={() => navigate('/construction')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              <Building className="mr-3 h-5 w-5" />
              Start Construction
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Premium Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From finding your perfect property to building your dream home, we provide end-to-end solutions 
              with unmatched quality and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <CardHeader className="relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => navigate(service.link)}
                      className="w-full mt-6 group-hover:scale-105 transition-transform"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground">Numbers that speak for our excellence</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
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

      {/* Search Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Property</h2>
            <p className="text-muted-foreground">Search through thousands of verified properties</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
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
    </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)"/%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-2 text-lg">
              <Star className="mr-2 h-4 w-4" />
              Start Your Journey Today
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Build Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Dream Future?
              </span>
            </h2>
            
            <p className="text-xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who found their dream homes and built their perfect properties with Destiny. 
              Your journey to the perfect home starts here.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <IndianRupee className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-bold mb-2">Best Prices</h3>
                <p className="text-sm text-white/80">Competitive pricing with no hidden costs</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-300" />
                <h3 className="font-bold mb-2">100% Secure</h3>
                <p className="text-sm text-white/80">All transactions are safe and verified</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Clock className="h-8 w-8 mx-auto mb-3 text-blue-300" />
                <h3 className="font-bold mb-2">Quick Process</h3>
                <p className="text-sm text-white/80">Fast approval and instant processing</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/properties' : '/signup')}
                className="bg-white text-primary hover:bg-white/90 px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all"
              >
                <HomeIcon className="mr-3 h-5 w-5" />
                {user ? 'Browse Properties' : 'Get Started'}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                onClick={() => navigate('/construction')}
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all"
              >
                <Hammer className="mr-3 h-5 w-5" />
                Start Building
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;