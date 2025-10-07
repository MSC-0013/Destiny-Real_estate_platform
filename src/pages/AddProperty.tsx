import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/contexts/PropertyContext';
import ImageUpload from '@/components/ImageUpload';
import { Building, Home, MapPin, DollarSign, Calendar, Users } from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = useProperty();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    type: 'house' as Property['type'],
    category: 'sale' as Property['category'],
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: [] as string[],
    amenities: [] as string[],
    featured: false,
    available: true,
    rentDuration: '1year' as Property['rentDuration'],
    constructionStatus: 'completed' as Property['constructionStatus'],
  });

  const amenitiesList = [
    'Swimming Pool', 'Garden', 'Garage', 'Security System', 'Gym', 
    'Rooftop', 'Concierge', 'Parking', 'Balcony', 'Fireplace'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to add a property' });
      return;
    }

    const propertyData: Omit<Property, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      location: formData.location,
      address: formData.address,
      type: formData.type,
      category: formData.category,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
      area: parseFloat(formData.area),
      images: formData.images.length > 0 ? formData.images : ['/placeholder.svg'],
      amenities: formData.amenities,
      sellerId: user._id,
      sellerName: user.name,
      sellerPhone: user.phone,
      featured: formData.featured,
      available: formData.available,
      rentDuration: formData.category === 'rent' ? formData.rentDuration : undefined,
      constructionStatus: formData.constructionStatus,
    };

    addProperty(propertyData);
    toast({ title: 'Success', description: 'Property added successfully!' });
    navigate('/properties');
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
    } else {
      setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You must be logged in to add a property.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-luxury/20 text-luxury border-luxury/30">
              <Building className="mr-2 h-4 w-4" />
              Property Management
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-luxury bg-clip-text text-transparent mb-4">
              Add New Property
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              List your property with detailed information and high-quality images to attract potential buyers or tenants.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Luxury Modern Villa"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      <DollarSign className="inline mr-1 h-4 w-4" />
                      Price *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 850000"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">City/Area *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Beverly Hills"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 Sunset Boulevard"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Property Type *</Label>
                    <Select value={formData.type} onValueChange={(value: Property['type']) => 
                      setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(value: Property['category']) => 
                      setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq ft) *</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="e.g., 3200"
                      value={formData.area}
                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">
                      <Users className="inline mr-1 h-4 w-4" />
                      Bedrooms
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="e.g., 4"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    />
                  </div>
                </div>

                {formData.category === 'rent' && (
                  <div className="space-y-2">
                    <Label>
                      <Calendar className="inline mr-1 h-4 w-4" />
                      Rent Duration
                    </Label>
                    <Select value={formData.rentDuration} onValueChange={(value: Property['rentDuration']) => 
                      setFormData(prev => ({ ...prev, rentDuration: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={15}
                  label="Upload Property Images (Max 15)"
                />
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                      />
                      <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/properties')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-luxury hover:opacity-90">
                Add Property
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddProperty;