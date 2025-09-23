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
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/contexts/PropertyContext';

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
    images: [],
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
      images: ['/placeholder.svg'],
      amenities: formData.amenities,
      sellerId: user.id,
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
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Add New Property</h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Property Type</Label>
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
              <Label>Category</Label>
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
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </div>
          
          <Button type="submit" className="w-full">Add Property</Button>
        </form>
      </div>
    </main>
  );
};

export default AddProperty;