import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConstruction } from '@/contexts/ConstructionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';
import { Briefcase, DollarSign, TrendingUp, CheckCircle, Clock, Award } from 'lucide-react';
import IncomeExpenseChart from '@/components/analytics/IncomeExpenseChart';

const WorkerDesignerContractorDashboard = () => {
  const { user } = useAuth();
  const { projects } = useConstruction();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'worker' && user.role !== 'designer' && user.role !== 'contractor') {
    return <Navigate to="/" replace />;
  }

  // Mock data for demonstration
  const appliedJobs = 5;
  const acceptedJobs = 3;
  const completedJobs = user.completedJobs || 12;
  const totalEarnings = user.earnings || 150000;
  const pendingPayments = 25000;
  const rating = user.rating || 4.8;

  const monthlyEarnings = [
    { month: 'Jan', income: 15000, expenses: 3000 },
    { month: 'Feb', income: 20000, expenses: 4000 },
    { month: 'Mar', income: 18000, expenses: 3500 },
    { month: 'Apr', income: 25000, expenses: 5000 },
    { month: 'May', income: 22000, expenses: 4500 },
    { month: 'Jun', income: 30000, expenses: 6000 },
  ];

  // Mock jobs data
  const availableJobs = [
    { id: '1', title: 'Villa Construction - Phase 2', location: 'Bhatbhateni', budget: 250000, deadline: '2025-12-01', type: 'construction' },
    { id: '2', title: 'Apartment Renovation', location: 'Lazimpat', budget: 150000, deadline: '2025-11-15', type: 'repair' },
    { id: '3', title: 'Office Interior Design', location: 'Durbar Marg', budget: 200000, deadline: '2025-11-30', type: 'design' },
  ];

  const myJobs = [
    { id: '1', title: 'Residential Construction', status: 'in-progress', payment: 180000, deadline: '2025-10-20' },
    { id: '2', title: 'Kitchen Repair', status: 'accepted', payment: 45000, deadline: '2025-10-15' },
    { id: '3', title: 'Living Room Design', status: 'completed', payment: 80000, deadline: '2025-09-30' },
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {user.role === 'worker' ? 'Worker' : user.role === 'designer' ? 'Designer' : 'Contractor'} Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Manage your projects and earnings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedJobs}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptedJobs}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Award className="h-4 w-4 text-luxury" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rating} ⭐</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-luxury">Rs. {pendingPayments.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Expected soon</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">Rs. {monthlyEarnings[5].income.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">June earnings</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Applied Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{appliedJobs}</div>
              <p className="text-sm text-muted-foreground mt-2">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Analytics */}
        <div className="mb-8">
          <IncomeExpenseChart data={monthlyEarnings} title="Monthly Earnings & Expenses" />
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available">Available Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Available Jobs */}
          <TabsContent value="available">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Available Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableJobs.map(job => (
                    <Card key={job.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        </div>
                        <Badge className="bg-luxury text-luxury-foreground">{job.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-semibold">Rs. {job.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="font-semibold">{new Date(job.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button className="w-full">Apply for Job</Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Jobs */}
          <TabsContent value="my-jobs">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>My Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myJobs.map(job => (
                    <Card key={job.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          job.status === 'completed' ? 'default' : 
                          job.status === 'in-progress' ? 'secondary' : 'outline'
                        }>
                          {job.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Payment</p>
                          <p className="text-lg font-bold text-success">Rs. {job.payment.toLocaleString()}</p>
                        </div>
                        {job.status === 'in-progress' && (
                          <Button>Update Progress</Button>
                        )}
                        {job.status === 'completed' && (
                          <Button variant="outline">View Details</Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>My Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                {user.portfolio && user.portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.portfolio.map((item, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-full h-48 object-cover"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          {item.completedDate && (
                            <p className="text-xs text-muted-foreground">
                              Completed: {new Date(item.completedDate).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No portfolio items yet</p>
                    <Button>Add Portfolio Item</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-lg font-bold text-success">95%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-lg font-bold text-success">92%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Client Satisfaction</span>
                      <span className="text-lg font-bold text-luxury">{rating}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Total Projects</span>
                      <span className="text-lg font-bold text-primary">{completedJobs}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Living Room Design</p>
                        <p className="text-xs text-muted-foreground">Paid on Sep 30</p>
                      </div>
                      <span className="font-bold text-success">Rs. 80,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Villa Construction</p>
                        <p className="text-xs text-muted-foreground">Paid on Sep 15</p>
                      </div>
                      <span className="font-bold text-success">Rs. 120,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg bg-muted">
                      <div>
                        <p className="font-medium">Apartment Renovation</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <span className="font-bold text-luxury">Rs. 65,000</span>
                    </div>
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

export default WorkerDesignerContractorDashboard;