import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConstruction } from '@/contexts/ConstructionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobApplicationForm from '@/components/JobApplicationForm';
import {
  Palette,
  FileImage,
  Calendar,
  Users,
  Lightbulb,
  Ruler,
  Eye,
  Download,
  Upload,
  MapPin,
  Building,
  Clock,
  CheckCircle,
  Star,
  Award
} from 'lucide-react';

const DesignerDashboard = () => {
  const { user } = useAuth();
  const { projects, getProjectsByRole } = useConstruction();

  const myProjects = getProjectsByRole(user?._id || '', 'designer');
  const activeProjects = myProjects.filter(p => p.status === 'in-progress' || p.status === 'approved');
  const completedProjects = myProjects.filter(p => p.status === 'completed');
  const pendingApproval = myProjects.filter(p => p.status === 'pending');

  const stats = [
    { icon: Building, label: 'Total Projects', value: myProjects.length, color: 'text-blue-600' },
    { icon: Palette, label: 'Active Designs', value: activeProjects.length, color: 'text-purple-600' },
    { icon: CheckCircle, label: 'Completed', value: completedProjects.length, color: 'text-green-600' },
    { icon: FileImage, label: 'Blueprints', value: myProjects.reduce((sum, p) => sum + p.blueprints.length, 0), color: 'text-orange-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'in-progress': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Designer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Create beautiful designs and manage your projects.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="apply-job">Apply for Job</TabsTrigger>

          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="mr-1 h-4 w-4" />
                            {project.location}
                          </p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Client</p>
                            <p className="font-medium">{project.clientName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium capitalize">{project.projectType}</p>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileImage className="mr-2 h-4 w-4" />
                          {project.blueprints.length} blueprints uploaded
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="mr-1 h-4 w-4" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="mr-1 h-4 w-4" />
                            Upload Design
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Palette className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Projects</h3>
                  <p className="text-muted-foreground">You don't have any active design projects at the moment.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingApproval.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingApproval.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="mr-1 h-4 w-4" />
                            {project.location}
                          </p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          <Clock className="mr-1 h-3 w-3" />
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Client</p>
                            <p className="font-medium">{project.clientName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">₹{project.estimatedCost?.toLocaleString() || '0'}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            Start Design
                          </Button>
                          <Button size="sm" variant="outline">
                            <Lightbulb className="mr-1 h-4 w-4" />
                            Proposal
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pending Projects</h3>
                  <p className="text-muted-foreground">You don't have any projects waiting for approval.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow border-green-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="mr-1 h-4 w-4" />
                            {project.location}
                          </p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">Excellent</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Completed</p>
                            <p className="font-medium">
                              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Blueprints</p>
                            <p className="font-medium">{project.blueprints.length} files</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="mr-1 h-4 w-4" />
                            View Portfolio
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Completed Projects</h3>
                  <p className="text-muted-foreground">You haven't completed any design projects yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Design Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Projects Completed</span>
                      <span className="font-semibold">{completedProjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Blueprints</span>
                      <span className="font-semibold">{myProjects.reduce((sum, p) => sum + p.blueprints.length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Residential Projects</span>
                      <span className="font-semibold">{myProjects.filter(p => p.projectType === 'residential').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commercial Projects</span>
                      <span className="font-semibold">{myProjects.filter(p => p.projectType === 'commercial').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Ruler className="mr-2 h-5 w-5" />
                    Design Tools & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>3D Modeling</span>
                      <Badge variant="secondary">Expert</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Interior Design</span>
                      <Badge variant="secondary">Advanced</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>AutoCAD</span>
                      <Badge variant="secondary">Expert</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rendering</span>
                      <Badge variant="secondary">Advanced</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Work Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileImage className="mr-2 h-5 w-5" />
                  Recent Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {myProjects.slice(0, 8).map((project, index) => (
                    <div key={project.id} className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="text-center">
                        <Building className="h-8 w-8 mx-auto text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {project.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="apply-job" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apply for a Job</CardTitle>
              </CardHeader>
              <CardContent>
                <JobApplicationForm
                  applicantId={user._id}          // automatically linked to logged-in user
                  applicantName={user.name}   // shows who applied
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default DesignerDashboard;