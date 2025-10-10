import { useParams, Navigate, Link } from 'react-router-dom';
import { useConstruction } from '@/contexts/ConstructionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConstructionPage from "./ConstructionPage";
import ConstructionChart from "./ConstructionChart";
import MaterialsTab from '@/components/MaterialsTab';
import PaymentsTab from './PaymentTab';
import {
  Building,
  MapPin,
  Calendar,
  IndianRupee,
  User,
  Hammer,
  FileText,
  Camera,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ConstructionDetails = () => {
  const { id } = useParams();
  const { getProject } = useConstruction();
  const { user } = useAuth();

  if (!id) return <Navigate to="/construction" replace />;

  const project = getProject(id);

  if (!project) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Project Not Found</h1>
            <p className="text-muted-foreground">The construction project you're looking for doesn't exist.</p>
            <Link to="/construction">
              <Button className="mt-4">Back to Projects</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseProgress = (phase: string) => {
    const phases = ['planning', 'foundation', 'structure', 'interior', 'finishing', 'completed'];
    const currentIndex = phases.indexOf(phase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/construction" className="text-muted-foreground hover:text-foreground">
              Construction
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{project.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{project.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{project.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(project.status)}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <Badge variant="outline">
                {project.projectType}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Project Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Phase: {project.phase}</span>
                  <span>{Math.round(getPhaseProgress(project.phase))}% Complete</span>
                </div>
                <Progress value={getPhaseProgress(project.phase)} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Current phase: {project.phase.charAt(0).toUpperCase() + project.phase.slice(1)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">₹{project.estimatedCost?.toLocaleString() || '0'}</p>
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-green-600">₹{project.actualCost?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-muted-foreground">Spent So Far</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.startDate && (
                  <div>
                    <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                  </div>
                )}
                {project.endDate && (
                  <div className="mt-4">
                    <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Expected End</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Client Information</h4>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{project.clientName}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.progressImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {project.progressImages.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Progress ${index + 1}`}
                          className="rounded-lg object-cover aspect-square"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No progress images yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>All Projects Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ConstructionPage />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ConstructionChart />
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="team">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {project.contractorName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hammer className="w-5 h-5" />
                      Contractor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{project.contractorName}</p>
                    <Badge className="mt-2" variant="outline">Lead Contractor</Badge>
                  </CardContent>
                </Card>
              )}

              {project.designerName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Designer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{project.designerName}</p>
                    <Badge className="mt-2" variant="outline">Architect/Designer</Badge>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Workers</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.workers.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{project.workers.length} workers assigned</p>
                      <div className="flex flex-wrap gap-1">
                        {project.workers.slice(0, 3).map((worker, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            Worker {index + 1}
                          </Badge>
                        ))}
                        {project.workers.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.workers.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No workers assigned yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Project Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {project.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : task.status === 'in-progress' ? (
                              <Clock className="w-5 h-5 text-blue-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">Assigned to: {task.assigneeName}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            task.priority === 'high' ? 'border-red-500 text-red-500' :
                              task.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                                'border-green-500 text-green-500'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No tasks assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <MaterialsTab
              projectId={project.id}
              materials={project.materials}
            />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentsTab projectId={project.id} />
          </TabsContent>

        </Tabs>
      </div >
    </main >
  );
};

export default ConstructionDetails;