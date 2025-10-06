import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConstruction } from '@/contexts/ConstructionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobApplicationForm from '@/components/JobApplicationForm';

import {
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  Building,
  Timer,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { projects, getProjectsByRole } = useConstruction();

  const myProjects = getProjectsByRole(user?.id || '', 'worker');
  const activeProjects = myProjects.filter(p => p.status === 'in-progress');

  // Get all tasks assigned to this worker
  const allTasks = myProjects.flatMap(p => p.tasks.filter(t => t.assignedTo === user?.id));
  const pendingTasks = allTasks.filter(t => t.status === 'pending');
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');
  const completedTasks = allTasks.filter(t => t.status === 'completed');

  const stats = [
    { icon: Building, label: 'Active Projects', value: activeProjects.length, color: 'text-blue-600' },
    { icon: Target, label: 'Pending Tasks', value: pendingTasks.length, color: 'text-orange-600' },
    { icon: Timer, label: 'In Progress', value: inProgressTasks.length, color: 'text-green-600' },
    { icon: CheckCircle, label: 'Completed Tasks', value: completedTasks.length, color: 'text-emerald-600' },
  ];

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Worker Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Track your tasks and project assignments.</p>
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

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="apply-job">Apply for Jobs</TabsTrigger>

          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Pending Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-orange-600" />
                    Pending Tasks ({pendingTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingTasks.slice(0, 5).map((task) => {
                    const project = myProjects.find(p => p.id === task.projectId);
                    return (
                      <div key={task.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge className={getTaskPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <Building className="mr-1 h-3 w-3" />
                          {project?.title}
                        </div>
                        <Button size="sm" className="w-full">Start Task</Button>
                      </div>
                    );
                  })}
                  {pendingTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No pending tasks</p>
                  )}
                </CardContent>
              </Card>

              {/* In Progress Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-blue-600" />
                    In Progress ({inProgressTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inProgressTasks.slice(0, 5).map((task) => {
                    const project = myProjects.find(p => p.id === task.projectId);
                    return (
                      <div key={task.id} className="p-3 border rounded-lg bg-blue-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge className={getTaskPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <Building className="mr-1 h-3 w-3" />
                          {project?.title}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" className="flex-1">Update</Button>
                          <Button size="sm" variant="outline">Complete</Button>
                        </div>
                      </div>
                    );
                  })}
                  {inProgressTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No tasks in progress</p>
                  )}
                </CardContent>
              </Card>

              {/* Completed Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    Completed ({completedTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {completedTasks.slice(0, 5).map((task) => {
                    const project = myProjects.find(p => p.id === task.projectId);
                    return (
                      <div key={task.id} className="p-3 border rounded-lg bg-green-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge className="bg-green-500/20 text-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Done
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Building className="mr-1 h-3 w-3" />
                          {project?.title}
                        </div>
                        {task.completedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Completed: {new Date(task.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {completedTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No completed tasks</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
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
                        <Badge className="bg-blue-500/20 text-blue-700">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">My Tasks</span>
                          <span className="text-sm font-medium">
                            {project.tasks.filter(t => t.assignedTo === user?.id).length} assigned
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Contractor</p>
                            <p className="font-medium">{project.contractorName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phase</p>
                            <p className="font-medium capitalize">{project.phase.replace('-', ' ')}</p>
                          </div>
                        </div>

                        <Button size="sm" className="w-full">View Project Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Projects</h3>
                  <p className="text-muted-foreground">You are not assigned to any active projects at the moment.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inProgressTasks.concat(pendingTasks).slice(0, 8).map((task, index) => {
                    const project = myProjects.find(p => p.id === task.projectId);
                    return (
                      <div key={task.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <p className="text-xs text-muted-foreground">{project?.title}</p>
                        </div>
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    );
                  })}
                  {(inProgressTasks.length + pendingTasks.length) === 0 && (
                    <p className="text-center text-muted-foreground py-8">No tasks scheduled for today</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Tasks Completed</span>
                      <span className="font-semibold">{completedTasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-semibold">
                        {allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Projects</span>
                      <span className="font-semibold">{activeProjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Priority Tasks</span>
                      <span className="font-semibold">{allTasks.filter(t => t.priority === 'high').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allTasks.slice(0, 6).map((task, index) => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-blue-500' : 'bg-orange-500'
                          }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.status} • Priority: {task.priority}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                />              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </main>
  );
};

export default WorkerDashboard;