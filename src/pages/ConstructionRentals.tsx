import { useState } from 'react';
import { useConstruction } from '@/contexts/ConstructionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Users, 
  Bed, 
  Bath, 
  Car,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const ConstructionRentals = () => {
  const { projects } = useConstruction();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    propertyType: 'apartment',
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    location: '',
    budget: '',
    description: '',
    features: '',
    timeline: '6months'
  });

  // Filter completed projects that can be rented
  const availableRentals = projects.filter(project => 
    project.status === 'completed' && 
    project.projectType !== 'commercial' &&
    (searchTerm === '' || project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     project.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === 'all' || project.projectType === typeFilter) &&
    (statusFilter === 'all' || project.status === statusFilter)
  );

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would create a request in the admin system
    const requestData = {
      id: Date.now().toString(),
      userId: user?.id,
      userName: user?.name,
      type: 'rental_construction',
      ...requestForm,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Store request for admin review
    const requests = JSON.parse(localStorage.getItem('construction_requests') || '[]');
    requests.push(requestData);
    localStorage.setItem('construction_requests', JSON.stringify(requests));

    toast({
      title: "Request Submitted!",
      description: "Your custom construction request has been sent to our admin team for review.",
    });

    setIsRequestOpen(false);
    setRequestForm({
      propertyType: 'apartment',
      bedrooms: '2',
      bathrooms: '2',
      area: '',
      location: '',
      budget: '',
      description: '',
      features: '',
      timeline: '6months'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Construction Rentals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rent brand new constructed properties or request custom construction for your rental needs
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by location or property name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="house">House</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Request Custom Construction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Request Custom Construction for Rental</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={requestForm.propertyType} onValueChange={(value) => setRequestForm(prev => ({ ...prev, propertyType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={requestForm.bedrooms} onValueChange={(value) => setRequestForm(prev => ({ ...prev, bedrooms: value }))}>
                      <SelectTrigger>
                        <SelectValue />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">Total Area (sq ft)</Label>
                    <Input
                      id="area"
                      value={requestForm.area}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, area: e.target.value }))}
                      placeholder="e.g., 1200"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget (₹)</Label>
                    <Input
                      id="budget"
                      value={requestForm.budget}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="e.g., 5000000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Preferred Location</Label>
                  <Input
                    id="location"
                    value={requestForm.location}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter preferred location"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description & Requirements</Label>
                  <Textarea
                    id="description"
                    value={requestForm.description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your requirements..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">Special Features</Label>
                  <Textarea
                    id="features"
                    value={requestForm.features}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="e.g., Swimming pool, Gym, Parking, Garden..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Expected Timeline</Label>
                  <Select value={requestForm.timeline} onValueChange={(value) => setRequestForm(prev => ({ ...prev, timeline: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="18months">18 Months</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Available Rentals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRentals.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="w-16 h-16 text-primary/30" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-green-500">
                    Available for Rent
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-semibold text-foreground">
                      ₹{(project.estimatedCost * 0.002).toLocaleString()}/month
                    </span>
                    <span className="text-xs">(Estimated rent)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>3 BHK</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>2 Bath</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      <span>Parking</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Completed: {new Date(project.startDate).getFullYear()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    Rent Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {availableRentals.length === 0 && (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rental Properties Available</h3>
            <p className="text-muted-foreground mb-4">
              No completed construction projects are currently available for rent.
            </p>
            <Button onClick={() => setIsRequestOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Request Custom Construction
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ConstructionRentals;