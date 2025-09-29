import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConstruction } from '@/contexts/ConstructionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConstructionRequestForm from '@/components/ConstructionRequestForm';
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  Search,
  Filter,
  Plus,
  Hammer,
  Wrench,
  HardHat,
  TrendingUp,
  MessageSquare,
  Star
} from 'lucide-react';

const Construction = () => {
  const navigate = useNavigate();
  const { projects } = useConstruction();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'in-progress': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPhaseProgress = (phase: string) => {
    switch (phase) {
      case 'planning': return 15;
      case 'foundation': return 30;
      case 'structure': return 50;
      case 'interior': return 75;
      case 'finishing': return 90;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const stats = [
    { icon: Building, label: 'Total Projects', value: projects.length.toString(), color: 'text-blue-600' },
    { icon: TrendingUp, label: 'In Progress', value: projects.filter(p => p.status === 'in-progress').length.toString(), color: 'text-green-600' },
    { icon: Hammer, label: 'Completed', value: projects.filter(p => p.status === 'completed').length.toString(), color: 'text-emerald-600' },
    { icon: DollarSign, label: 'Total Value', value: `₹${(projects.reduce((sum, p) => sum + p.estimatedCost, 0) / 10000000).toFixed(1)}Cr`, color: 'text-luxury' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-black text-white border-black">
            <Hammer className="mr-2 h-4 w-4" />
            Construction Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent mb-4">
            Build Your Dreams
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional construction services from planning to completion. Transform your vision into reality with our expert team of contractors, workers, and designers.
          </p>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="projects" className="text-lg py-3">
              <Building className="mr-2 h-4 w-4" />
              View Projects
            </TabsTrigger>
            <TabsTrigger value="request" className="text-lg py-3">
              <MessageSquare className="mr-2 h-4 w-4" />
              Request Construction
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            {user?.role === 'admin' && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => navigate('/add-construction')} 
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Start New Project
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className="p-3 bg-black/5 rounded-full">
                          <IconComponent className="h-6 w-6 text-black" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="interior">Interior</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg">
                    <div className="relative">
                      {project.progressImages.length > 0 ? (
                        <img 
                          src={project.progressImages[0]} 
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                          <Building className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <Badge className={`absolute top-4 left-4 ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-black transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          {project.location}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-2 h-4 w-4" />
                          {project.clientName}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="mr-2 h-4 w-4" />
                          ₹{project.estimatedCost.toLocaleString()}
                        </div>

                        {project.startDate && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            Started {new Date(project.startDate).toLocaleDateString()}
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{getPhaseProgress(project.phase)}%</span>
                          </div>
                          <Progress value={getPhaseProgress(project.phase)} className="h-2" />
                          <p className="text-xs text-muted-foreground capitalize">
                            Current Phase: {project.phase.replace('-', ' ')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-black hover:bg-gray-800"
                          onClick={() => navigate(`/construction/${project.id}`)}
                        >
                          View Details
                        </Button>
                        {user?.role === 'admin' && (
                          <Button size="sm" variant="outline">
                            <Wrench className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 border-0 shadow-lg">
                <CardContent>
                  <HardHat className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Construction Projects</h3>
                  <p className="text-muted-foreground mb-6">
                    {user?.role === 'admin' 
                      ? "Start building dreams by creating your first construction project."
                      : "No construction projects available at the moment."
                    }
                  </p>
                  {user?.role === 'admin' && (
                    <Button onClick={() => navigate('/add-construction')} className="bg-black hover:bg-gray-800">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Why Choose Us Section */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold mb-8">Why Choose Destiny Construction?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black/10 text-black rounded-full mb-4">
                    <HardHat className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Professional contractors, skilled workers, and creative designers working together.
                  </p>
                </div>
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black/10 text-black rounded-full mb-4">
                    <Hammer className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quality Work</h3>
                  <p className="text-muted-foreground">
                    Using the finest materials and latest construction techniques for lasting results.
                  </p>
                </div>
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black/10 text-black rounded-full mb-4">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">On-Time Delivery</h3>
                  <p className="text-muted-foreground">
                    Project management excellence ensuring timely completion within budget.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Request Construction Tab */}
          <TabsContent value="request" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Request Custom Construction</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have a specific vision? Let our expert team bring your dream property to life. 
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <ConstructionRequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Construction;