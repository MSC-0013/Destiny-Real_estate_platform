import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Home, 
  IndianRupee, 
  Calendar, 
  User, 
  FileText, 
  Upload,
  Plus,
  X,
  Building
} from 'lucide-react';

interface ConstructionRequest {
  clientName: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  floors: string;
  budget: string;
  timeline: string;
  description: string;
  requirements: string[];
  designImages: string[];
}

const ConstructionRequestForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');
  
  const [formData, setFormData] = useState<ConstructionRequest>({
    clientName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    projectType: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floors: '1',
    budget: '',
    timeline: '',
    description: '',
    requirements: [],
    designImages: []
  });

  const handleInputChange = (field: keyof ConstructionRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you'd upload these to a server
      // For now, we'll just show placeholders
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        designImages: [...prev.designImages, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      designImages: prev.designImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would be sent to your backend
      const requestData = {
        ...formData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user?._id
      };

      // Save to localStorage for demo purposes
      const existingRequests = JSON.parse(localStorage.getItem('constructionRequests') || '[]');
      existingRequests.push(requestData);
      localStorage.setItem('constructionRequests', JSON.stringify(existingRequests));

      toast({
        title: 'Request Submitted Successfully!',
        description: 'Your construction request has been sent to our admin team for review. We\'ll contact you within 24 hours.',
      });

      // Reset form
      setFormData({
        clientName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        projectType: '',
        location: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        floors: '1',
        budget: '',
        timeline: '',
        description: '',
        requirements: [],
        designImages: []
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-black to-gray-800 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Building className="mr-3 h-6 w-6" />
          Custom Construction Request
        </CardTitle>
        <p className="text-gray-200">
          Tell us about your dream property and we'll make it a reality
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-black" />
              <h3 className="text-lg font-semibold text-black">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Full Name *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-5 w-5 text-black" />
              <h3 className="text-lg font-semibold text-black">Project Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type *</Label>
                <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential-house">Residential House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial Building</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="interior">Interior Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Total Area (sq ft) *</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="e.g., 2000"
                  required
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4 BHK</SelectItem>
                    <SelectItem value="5">5+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="floors">Floors</Label>
                <Select value={formData.floors} onValueChange={(value) => handleInputChange('floors', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Floor</SelectItem>
                    <SelectItem value="2">2 Floors</SelectItem>
                    <SelectItem value="3">3 Floors</SelectItem>
                    <SelectItem value="4">4+ Floors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <IndianRupee className="h-5 w-5 text-black" />
              <h3 className="text-lg font-semibold text-black">Budget & Timeline</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range (₹) *</Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-25">₹10L - ₹25L</SelectItem>
                    <SelectItem value="25-50">₹25L - ₹50L</SelectItem>
                    <SelectItem value="50-1cr">₹50L - ₹1Cr</SelectItem>
                    <SelectItem value="1-2cr">₹1Cr - ₹2Cr</SelectItem>
                    <SelectItem value="2cr+">₹2Cr+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeline">Expected Timeline *</Label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-6">3-6 months</SelectItem>
                    <SelectItem value="6-12">6-12 months</SelectItem>
                    <SelectItem value="12-18">12-18 months</SelectItem>
                    <SelectItem value="18+">18+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-black" />
              <h3 className="text-lg font-semibold text-black">Special Requirements</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a special requirement..."
                  className="border-gray-300"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((req, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your vision, style preferences, and any additional details..."
              rows={4}
              className="border-gray-300"
            />
          </div>

          {/* Design Images */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="h-5 w-5 text-black" />
              <h3 className="text-lg font-semibold text-black">Design References (Optional)</h3>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="design-images"
                />
                <label htmlFor="design-images" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload design references</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB each</p>
                </label>
              </div>
              
              {formData.designImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.designImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Design ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConstructionRequestForm;