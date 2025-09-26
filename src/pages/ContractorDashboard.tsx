import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConstruction } from '@/contexts/ConstructionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Hammer,
  FileText,
  MapPin
} from 'lucide-react';

const ContractorDashboard = () => {
  const { user } = useAuth();
  const { projects, getProjectsByRole } = useConstruction();
  
  const myProjects = getProjectsByRole(user?.id || '', 'contractor');
  const activeProjects = myProjects.filter(p => p.status === 'in-progress');
  const completedProjects = myProjects.filter(p => p.status === 'completed');
  const pendingProjects = myProjects.filter(p => p.status === 'approved');

  const totalEarnings = myProjects.reduce((sum, p) => sum + (p.actualCost || 0), 0);
  const totalValue = myProjects.reduce((sum, p) => sum + p.estimatedCost, 0);

  const stats = [
    { icon: Building, label: 'Total Projects', value: myProjects.length, color: 'text-blue-600' },
    { icon: Clock, label: 'Active Projects', value: activeProjects.length, color: 'text-green-600' },
    { icon: CheckCircle, label: 'Completed', value: completedProjects.length, color: 'text-emerald-600' },
    { icon: DollarSign, label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, color: 'text-luxury' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'in-progress': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
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

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Contractor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Manage your construction projects and track progress.</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
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
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{getPhaseProgress(project.phase)}%</span>
                        </div>
                        <Progress value={getPhaseProgress(project.phase)} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Current Phase: {project.phase.replace('-', ' ')}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Client</p>
                            <p className="font-medium">{project.clientName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">${project.estimatedCost.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">View Details</Button>
                          <Button size="sm" variant="outline">Update Progress</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Hammer className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Projects</h3>
                  <p className="text-muted-foreground">You don't have any active construction projects at the moment.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingProjects.map((project) => (
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
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">${project.estimatedCost.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">Accept Project</Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pending Projects</h3>
                  <p className="text-muted-foreground">You don't have any pending project assignments.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedProjects.map((project) => (
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
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Progress value={100} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Completed</p>
                            <p className="font-medium">
                              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Final Cost</p>
                            <p className="font-medium">${project.actualCost.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">View Project</Button>
                          <Button size="sm" variant="outline">
                            <FileText className="mr-1 h-4 w-4" />
                            Report
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
                  <p className="text-muted-foreground">You haven't completed any projects yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Projects Completed</span>
                      <span className="font-semibold">{completedProjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-semibold">
                        {myProjects.length > 0 ? Math.round((completedProjects.length / myProjects.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-semibold">${totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Project Value</span>
                      <span className="font-semibold">
                        ${myProjects.length > 0 ? Math.round(totalValue / myProjects.length).toLocaleString() : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProjects.slice(0, 5).map((project, index) => (
                      <div key={project.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Status: {project.status} • Phase: {project.phase}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default ContractorDashboard;