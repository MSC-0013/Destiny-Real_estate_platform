import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useConstruction } from "@/contexts/ConstructionContext";
import { useJob } from "@/contexts/JobContext";
import { useProperty } from "@/contexts/PropertyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import JobDashboard from "@/components/JobsDashboard";
import {
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  BarChart3,
  FileText,
  MapPin,
  Home,
} from "lucide-react";
import AnalyticsTab from "@/components/analytics/AdminAnalyics";

const AdminDashboard = () => {
  const { getAllUsers, deleteUser } = useAuth();
  const {
    repairRequests,
    constructionRequests,
    projects,
    approveRepairRequest,
    rejectRepairRequest,
    approveConstructionRequest,
    rejectConstructionRequest,
  } = useConstruction();
  const {
    workerApplications,
    contractorApplications,
    designerApplications,
    approveJob,
    rejectJob,
    assignJob,
  } = useJob();
  const { properties } = useProperty();
  const { toast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  React.useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
  }, [getAllUsers]);

  const handleApproveRepair = async (id: string) => {
    await approveRepairRequest(id);
    toast({ title: "Repair request approved" });
  };

  const handleRejectRepair = async (id: string) => {
    await rejectRepairRequest(id);
    toast({ title: "Repair request rejected", variant: "destructive" });
  };

  const handleApproveConstruction = async (id: string) => {
    await approveConstructionRequest(id);
    toast({ title: "Construction request approved" });
  };

  const handleRejectConstruction = async (id: string) => {
    await rejectConstructionRequest(id);
    toast({ title: "Construction request rejected", variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage platform operations and monitor activities
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Home className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Construction Projects
              </CardTitle>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Job Applications
              </CardTitle>
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workerApplications.length +
                  contractorApplications.length +
                  designerApplications.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList
            className="
      flex w-full overflow-x-auto gap-2 p-2 
      sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 
      scrollbar-hide
    "
          >
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>

            <TabsTrigger value="users" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>

            <TabsTrigger value="properties" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Properties</span>
            </TabsTrigger>

            <TabsTrigger value="repair" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Repairs</span>
            </TabsTrigger>

            <TabsTrigger value="construction" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Construction</span>
            </TabsTrigger>

            <TabsTrigger value="employees" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Employees</span>
            </TabsTrigger>

            <TabsTrigger value="jobApplications" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Job Applications</span>
            </TabsTrigger>

            <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>


          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Repair Requests</span>
                    <Badge variant="secondary">
                      {repairRequests.filter((r) => r.status === "pending").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Construction Requests</span>
                    <Badge variant="secondary">
                      {
                        constructionRequests.filter((r) => r.status === "pending")
                          .length
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Job Applications</span>
                    <Badge variant="secondary">
                      {[
                        ...workerApplications,
                        ...contractorApplications,
                        ...designerApplications,
                      ].filter((j) => j.status === "pending").length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Properties</span>
                    <Badge>
                      {properties.filter((p) => p.available).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ongoing Projects</span>
                    <Badge>
                      {projects.filter((p) => p.status === "in-progress").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approved Workers</span>
                    <Badge>
                      {
                        workerApplications.filter((e) => e.status === "approved")
                          .length
                      }
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium">Name</th>
                        <th className="text-left p-3 text-sm font-medium">Email</th>
                        <th className="text-left p-3 text-sm font-medium">Role</th>
                        <th className="text-left p-3 text-sm font-medium">Phone</th>
                        <th className="text-left p-3 text-sm font-medium">Verified</th>
                        <th className="text-left p-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-muted-foreground">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u._id} className="border-b hover:bg-muted/50">
                            <td className="p-3 text-sm">{u.name}</td>
                            <td className="p-3 text-sm">{u.email}</td>
                            <td className="p-3 text-sm">
                              <Badge variant="outline" className="capitalize">
                                {u.role}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">{u.phone || "-"}</td>
                            <td className="p-3 text-sm">{u.verified ? "✅" : "❌"}</td>
                            <td className="p-3 text-sm space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  console.log("Edit user:", u._id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={async () => {
                                  if (confirm(`Delete user ${u.name}?`)) {
                                    await deleteUser(u._id);
                                    setUsers(users.filter((user) => user._id !== u._id));
                                    toast({
                                      title: "User deleted",
                                      description: `${u.name} has been removed`,
                                    });
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>All Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.map((prop) => (
                    <Card key={prop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {prop.images[0] && (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{prop.title}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {prop.location}
                          </p>
                          <p className="font-semibold text-primary text-lg">
                            ${prop.price.toLocaleString()}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={prop.available ? "default" : "secondary"}>
                              {prop.available ? "Available" : "Sold"}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {prop.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repair Requests Tab */}
          <TabsContent value="repair">
            <Card>
              <CardHeader>
                <CardTitle>Repair Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repairRequests.map((req) => (
                    <Card key={req.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{req.propertyTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {req.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant={
                                req.status === "approved"
                                  ? "default"
                                  : req.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {req.status}
                            </Badge>
                            <Badge variant="outline">Priority: {req.priority}</Badge>
                          </div>
                        </div>
                        {req.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRepair(req.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectRepair(req.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Construction Requests Tab */}
          <TabsContent value="construction">
            <Card>
              <CardHeader>
                <CardTitle>Construction Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {constructionRequests.map((req) => (
                    <Card key={req.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{req.projectType}</h3>
                          <p className="text-sm text-muted-foreground">
                            {req.description}
                          </p>
                          <p className="text-sm">
                            Budget: ${req.budget.toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant={
                                req.status === "approved"
                                  ? "default"
                                  : req.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {req.status}
                            </Badge>
                            <Badge variant="outline">
                              Timeline: {req.timeline}
                            </Badge>
                          </div>
                        </div>
                        {req.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveConstruction(req.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectConstruction(req.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="employees" className="space-y-6">
            {/* Workers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Workers</span>
                  <Badge variant="secondary">
                    {workerApplications.filter((e) => e.status === "approved").length}{" "}
                    Approved
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workerApplications
                    .filter((emp) => emp.status === "approved")
                    .map((emp) => (
                      <Card key={emp.id} className="p-4">
                        <h4 className="font-semibold text-lg mb-2">
                          {emp.applicantName}
                        </h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>📞 {emp.phone}</p>
                          <p>📧 {emp.email}</p>
                          <p>🎓 {emp.educationLevel}</p>
                          <p>💼 {emp.experienceYears} years</p>
                          <p>🏠 {emp.address || "N/A"}</p>
                          <p>🛠 {emp.constructionSkills?.join(", ")}</p>
                        </div>
                        <Button
                          className="w-full mt-3"
                          size="sm"
                          onClick={() => assignJob(emp.id, "CONSTRUCTION_PROJECT_ID")}
                        >
                          Assign to Project
                        </Button>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Contractors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Contractors</span>
                  <Badge variant="secondary">
                    {
                      contractorApplications.filter((e) => e.status === "approved")
                        .length
                    }{" "}
                    Approved
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contractorApplications
                    .filter((emp) => emp.status === "approved")
                    .map((emp) => (
                      <Card key={emp.id} className="p-4">
                        <h4 className="font-semibold text-lg mb-2">
                          {emp.applicantName}
                        </h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>🏢 {emp.companyName}</p>
                          <p>📞 {emp.phone}</p>
                          <p>📧 {emp.email}</p>
                          <p>🛠 {emp.areasOfExpertise?.join(", ")}</p>
                          <p>👥 Team: {emp.teamSize}</p>
                        </div>
                        <Button
                          className="w-full mt-3"
                          size="sm"
                          onClick={() => assignJob(emp.id, "CONSTRUCTION_PROJECT_ID")}
                        >
                          Assign to Project
                        </Button>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Designers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Designers</span>
                  <Badge variant="secondary">
                    {
                      designerApplications.filter((e) => e.status === "approved")
                        .length
                    }{" "}
                    Approved
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designerApplications
                    .filter((emp) => emp.status === "approved")
                    .map((emp) => (
                      <Card key={emp.id} className="p-4">
                        <h4 className="font-semibold text-lg mb-2">
                          {emp.applicantName}
                        </h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>📧 {emp.email}</p>
                          <p>📞 {emp.phone}</p>
                          <p>🎓 {emp.educationLevelDesigner}</p>
                          <p>🛠 {emp.designSkills?.join(", ")}</p>
                          <p>🎨 {emp.tools?.join(", ")}</p>
                        </div>
                        <Button
                          className="w-full mt-3"
                          size="sm"
                          onClick={() => assignJob(emp.id, "CONSTRUCTION_PROJECT_ID")}
                        >
                          Assign to Project
                        </Button>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Job Applications Tab */}
          <TabsContent value="jobApplications">
            <JobDashboard />
          </TabsContent>


          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
};

export default AdminDashboard;
