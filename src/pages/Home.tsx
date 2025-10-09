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
import heroRealEstate from '@/assets/hero-real-estate.jpg';
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
    if (!hasSearched && properties.length > 0) {
      // Show all available properties
      setSearchResults(properties.filter(p => p.available));
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
      {/* Hero Section - Modern Black & White Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url(${heroRealEstate})`
          }}
        />

        {/* Subtle Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 md:w-32 md:h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 md:w-40 md:h-40 bg-white/3 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            India's Premier Real Estate Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-tight">
            Find Your Perfect
            <span className="block text-white drop-shadow-2xl">
              Dream Home
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover premium properties, custom construction services, and interior design solutions
            all in one place. Your journey to the perfect home starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl"
              onClick={() => navigate('/properties')}
            >
              Browse Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 text-black hover:bg-white hover:text-black px-10 py-4 text-lg font-semibold backdrop-blur-sm"
              onClick={() => navigate('/construction')}
            >
              Start Building
              <Hammer className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section - Black & White Theme */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-black text-white">Our Services</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-8">
              Complete Real Estate Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From finding your dream property to building it from scratch, we provide end-to-end solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 bg-white hover:bg-gray-50">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex p-6 rounded-full bg-black mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-black mb-4">{service.title}</CardTitle>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-black mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3"
                    onClick={() => navigate(service.link)}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Refined Black & White */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-3">{stat.value}</div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-black text-white">Property Search</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Find Your Dream Property
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Use our advanced search to filter properties by location, price, type, and more
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-black text-white">
              {hasSearched ? 'Search Results' : 'Featured Properties'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              {hasSearched ? `Found ${searchResults.length} Properties` : 'Premium Properties'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {hasSearched
                ? 'Properties matching your search criteria'
                : 'Handpicked premium properties in prime locations across India'
              }
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((property) => (
                <PropertyCard key={property._id || property.id} property={property} />
              ))}

            </div>
          ) : (
            <div className="text-center py-16">
              <Building className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                {hasSearched ? 'No properties found' : 'No featured properties'}
              </h3>
              <p className="text-gray-500 mb-8">
                {hasSearched
                  ? 'Try adjusting your search criteria to find more properties'
                  : 'Check back later for featured properties'
                }
              </p>
              <Button
                onClick={() => navigate('/properties')}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3"
              >
                View All Properties
              </Button>
            </div>
          )}

          {!hasSearched && searchResults.length > 0 && (
            <div className="text-center mt-12">
              <Button
                onClick={() => navigate('/properties')}
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-3"
              >
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Enhanced Black & White */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-6 bg-white/10 text-white border-white/20">Get Started Today</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join thousands of satisfied customers who have found their dream properties with us.
            Whether you're buying, renting, or building, we're here to help.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-full inline-flex mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-300">All properties are thoroughly verified for authenticity</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-full inline-flex mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-300">Professional guidance throughout your property journey</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-full inline-flex mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-300">Competitive pricing with transparent fee structure</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl"
              onClick={() => navigate('/properties')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 text-black hover:bg-white hover:text-black px-10 py-4 text-lg font-semibold backdrop-blur-sm"
              onClick={() => navigate('/help')}
            >
              Need Help?
              <Search className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;