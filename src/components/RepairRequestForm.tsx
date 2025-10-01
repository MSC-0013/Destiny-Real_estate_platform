// RepairRequestForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useConstruction } from '@/contexts/ConstructionContext';
import { Home, MapPin, IndianRupee, FileText, Building, Calendar, AlertTriangle } from 'lucide-react';

interface RepairRequestFormData {
  clientName: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  location: string;
  address: string;
  estimatedCost?: number;
  projectType: 'residential' | 'commercial' | 'renovation' | 'interior';
  urgency: 'low' | 'medium' | 'high';
  attachments?: File[];
}

const RepairRequestForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addRepairRequest } = useConstruction();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RepairRequestFormData>({
    clientName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    title: '',
    description: '',
    location: '',
    address: '',
    estimatedCost: undefined,
    projectType: 'residential',
    urgency: 'medium',
    attachments: [],
  });

  const handleInputChange = (field: keyof RepairRequestFormData, value: string | number | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      addRepairRequest({
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        address: formData.address,
        estimatedCost: formData.estimatedCost,
        status: 'pending',
        adminId: undefined,
      });

      toast({
        title: 'Repair Request Submitted!',
        description: 'Your repair request has been sent. Our team will contact you soon.',
      });

      // Reset form
      setFormData({
        clientName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        title: '',
        description: '',
        location: '',
        address: '',
        estimatedCost: undefined,
        projectType: 'residential',
        urgency: 'medium',
        attachments: [],
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
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
          Repair Request
        </CardTitle>
        <p className="text-gray-200 mt-1">
          Fill in the details below to request a repair. Include all necessary information for faster processing.
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Full Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                required
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City/State *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Repair Details */}
          <div className="space-y-2">
            <Label htmlFor="title">Repair Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Kitchen Plumbing Issue"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the issue in detail"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street, House No."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost (Optional)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={formData.estimatedCost ?? ''}
                onChange={(e) => handleInputChange('estimatedCost', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => handleInputChange('projectType', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Renovation</option>
                <option value="interior">Interior</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency *</Label>
              <select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              onChange={(e) => handleInputChange('attachments', e.target.files ? Array.from(e.target.files) : [])}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting} className="bg-black hover:bg-gray-800 text-white px-6 py-2">
              {isSubmitting ? 'Submitting...' : 'Submit Repair Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RepairRequestForm;
