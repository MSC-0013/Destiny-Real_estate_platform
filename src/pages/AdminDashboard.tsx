import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useOrder } from '@/contexts/OrderContext';
import { useConstruction } from '@/contexts/ConstructionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigate, Link } from 'react-router-dom';
import { Users, Home, ShoppingBag, DollarSign, Settings, Plus, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { ConstructionPdf } from '@/components/analytics/Constructionpdf';
import { generateRepairPDF } from "@/components/analytics/Reapairform";
import { OrderPdf } from '@/components/analytics/downloadOrderPDF';
import AnalyticsTab from '@/components/analytics/AdminAnalyics';
import {useJob} from '@/contexts/JobContext';

const AdminDashboard = () => {
  const { user, getAllUsers, updateProfile, logout } = useAuth();
  const { properties } = useProperty();
  const { orders } = useOrder();
  const {
    repairRequests,
    approveRepairRequest,
    rejectRepairRequest,
    constructionRequests,
    approveConstructionRequest,
    rejectConstructionRequest
  } = useConstruction();
  const { workerApplications, approveWorkerApplication, rejectWorkerApplication } = useJob();
  const { approveJob, rejectJob } = useJob();

  


  


  const [activeTab, setActiveTab] = useState<
    'overview' | 'constructionRequests' | 'repairRequests' | 'analytics' | 'users' | 'workers'
  >('overview');

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);
  

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <main className="min-h-screen bg-background pt-20" >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the entire real estate platform</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) =>
            setActiveTab(val as
              'overview' | 'constructionRequests' | 'repairRequests' | 'analytics' | 'users' | 'workers')
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="constructionRequests">Construction Requests</TabsTrigger>
            <TabsTrigger value="repairRequests">Repair Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="workers">Workers / Contractors / Designers</TabsTrigger>

          </TabsList>

          <TabsContent value="overview">
            {/* Overview cards */}
          </TabsContent>
          <TabsContent value="employees">
  <div className="p-6 space-y-6">
    <h2 className="text-2xl font-bold mb-4">Approved Employees</h2>

    {/* Workers / Contractors / Designers */}
    {workerApplications.filter(w => w.status === 'approved').length > 0 ? (
      <>
        <h3 className="text-xl font-semibold">Workers / Contractors</h3>
        <table className="min-w-full table-auto border-collapse border border-gray-200 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Contractor / Worker</th>
              <th className="border px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {workerApplications
              .filter(w => w.status === 'approved' && (w.positionApplied === 'Worker' || w.positionApplied === 'Contractor'))
              .map(w => (
                <tr key={w.id}>
                  <td className="border px-4 py-2">{w.fullName}</td>
                  <td className="border px-4 py-2">{w.positionApplied}</td>
                  <td className="border px-4 py-2">{w.phone}</td>
                </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-xl font-semibold">Designers</h3>
        <table className="min-w-full table-auto border-collapse border border-gray-200 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Contact Number</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {workerApplications
              .filter(w => w.status === 'approved' && w.positionApplied === 'Designer')
              .map(w => (
                <tr key={w.id}>
                  <td className="border px-4 py-2">{w.fullName}</td>
                  <td className="border px-4 py-2">{w.phone}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : (
      <p className="text-gray-500 italic">No approved employees</p>
    )}
  </div>
</TabsContent>

          <TabsContent value="constructionRequests">
            {/* Construction Requests cards */}
          </TabsContent>

          <TabsContent value="repairRequests">
            {/* Repair Requests cards */}
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
            {/* Analytics content */}
          </TabsContent>

          <TabsContent value="users">
            {/* Users content */}
          </TabsContent>

          <TabsContent value="workers">
            {/* Workers content */}
          </TabsContent>
        </Tabs>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{properties.length}</div>
                  <p className="text-xs text-muted-foreground">All listings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">All orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Platform revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        

        {activeTab === 'constructionRequests' && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">🏗 Construction Requests</h2>
              <span className="text-gray-700 font-semibold text-lg bg-gray-200 px-3 py-1 rounded-full shadow">
                Total: {constructionRequests.length}
              </span>
            </div>

            {constructionRequests.length > 0 ? (
              constructionRequests.map((req) => {
                const {
                  id,
                  title,
                  clientName,
                  email,
                  phone,
                  projectType,
                  location,
                  area,
                  bedrooms,
                  bathrooms,
                  floors,
                  budget,
                  timeline,
                  specialRequirements,
                  description,
                  documents,
                  status,
                } = req;

                return (
                  <Card key={id} className="border border-gray-300 rounded-xl shadow-sm bg-white">
                    <CardContent className="p-6 flex flex-col space-y-6">

                      {/* Request Details Table */}
                      <table className="min-w-full border-collapse table-auto text-sm">
                        <tbody className="divide-y divide-gray-300">
                          <tr>
                            <td className="px-4 py-2 font-semibold">🏷 Title</td>
                            <td className="px-4 py-2 text-gray-800">{title}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">👤 Client Name</td>
                            <td className="px-4 py-2 text-gray-800">{clientName}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">✉ Email</td>
                            <td className="px-4 py-2 text-gray-800">{email}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">📞 Phone</td>
                            <td className="px-4 py-2 text-gray-800">{phone}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🏗 Project Type</td>
                            <td className="px-4 py-2 text-gray-800">{projectType}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">📍 Location</td>
                            <td className="px-4 py-2 text-gray-800">{location}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">📐 Area</td>
                            <td className="px-4 py-2 text-gray-800">{area} sq.ft.</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🛏 Bedrooms</td>
                            <td className="px-4 py-2 text-gray-800">{bedrooms}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🛁 Bathrooms</td>
                            <td className="px-4 py-2 text-gray-800">{bathrooms}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🏠 Floors</td>
                            <td className="px-4 py-2 text-gray-800">{floors}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">💰 Budget</td>
                            <td className="px-4 py-2 text-gray-800">{budget}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">⏱ Timeline</td>
                            <td className="px-4 py-2 text-gray-800">{timeline}</td>
                          </tr>
                          {specialRequirements && (
                            <tr>
                              <td className="px-4 py-2 font-semibold">⭐ Special Requirements</td>
                              <td className="px-4 py-2 text-gray-800">{specialRequirements}</td>
                            </tr>
                          )}
                          {description && (
                            <tr>
                              <td className="px-4 py-2 font-semibold">📝 Description</td>
                              <td className="px-4 py-2 text-gray-800">{description}</td>
                            </tr>
                          )}
                          {documents && (
                            <tr>
                              <td className="px-4 py-2 font-semibold">📎 Documents</td>
                              <td className="px-4 py-2">
                                <a
                                  href={documents}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 font-semibold underline"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Bottom Actions */}
                      <div className="flex flex-wrap justify-end gap-3 mt-4">
                        {status === 'pending' ? (
                          <>
                            <Button
  onClick={() => {
    approveConstructionRequest(id);
    // Update local state immediately
    setConstructionRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'approved' } : req))
    );
  }}
  variant="outline"
  className="text-black border-black"
>
  <Check className="w-4 h-4 mr-1" /> Approve
</Button>
<Button
  onClick={() => {
    rejectConstructionRequest(id);
    setConstructionRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'rejected' } : req))
    );
  }}
  variant="outline"
  className="text-black border-black"
>
  <X className="w-4 h-4 mr-1" /> Reject
</Button>

                          </>
                        ) : (
                          <span
                            className={`font-bold px-4 py-2 rounded-full text-sm ${status === 'approved'
                                ? 'bg-gray-200 text-black'
                                : 'bg-gray-300 text-black'
                              }`}
                          >
                            {status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </span>
                        )}

                        <Button
                          onClick={() => ConstructionPdf(req, 'Construction')}
                          variant="outline"
                          className="text-black border-black"
                        >
                          📄 Generate PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-gray-500 italic">No construction requests</p>
            )}
          </div>
        )}

        {activeTab === 'repairRequests' && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">🔧 Repair Requests</h2>
              <span className="text-gray-700 font-semibold text-lg bg-gray-200 px-3 py-1 rounded-full shadow">
                Total: {repairRequests.length}
              </span>
            </div>

            {repairRequests.length > 0 ? (
              repairRequests.map((req) => {
                const {
                  id,
                  title,
                  clientName,
                  email,
                  phone,
                  city,
                  repairTitle,
                  description,
                  address,
                  estimatedCost,
                  projectType,
                  urgency,
                  documents,
                  status,
                } = req;

                return (
                  <Card
                    key={id}
                    className="border border-gray-300 rounded-xl shadow-sm bg-white"
                  >
                    <CardContent className="p-6 flex flex-col space-y-6">

                      {/* Request Details Table */}
                      <table className="w-full table-auto text-sm border-collapse">
                        <tbody className="divide-y divide-gray-300">
                          <tr>
                            <td className="px-4 py-2 font-semibold">🏷 Title</td>
                            <td className="px-4 py-2">{title}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">👤 Client Name</td>
                            <td className="px-4 py-2">{clientName}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">✉ Email</td>
                            <td className="px-4 py-2">{email}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">📞 Phone</td>
                            <td className="px-4 py-2">{phone}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🏙 City/State</td>
                            <td className="px-4 py-2">{city}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🔧 Repair Title</td>
                            <td className="px-4 py-2">{repairTitle}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">📝 Description</td>
                            <td className="px-4 py-2">{description}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🏠 Address</td>
                            <td className="px-4 py-2">{address}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">💰 Estimated Cost</td>
                            <td className="px-4 py-2">{estimatedCost || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">🏗 Project Type</td>
                            <td className="px-4 py-2">{projectType}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-semibold">⚡ Urgency</td>
                            <td className="px-4 py-2">{urgency}</td>
                          </tr>
                          {documents && (
                            <tr>
                              <td className="px-4 py-2 font-semibold">📎 Documents</td>
                              <td className="px-4 py-2">
                                <a
                                  href={documents}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-900 font-medium underline"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Bottom Actions: PDF & Approve/Reject */}
                      <div className="flex justify-end gap-3 mt-4">
                        {status === 'pending' ? (
                          <>
                            <Button
  onClick={() => {
    approveRepairRequest(id);
    setRepairRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  }}
  variant="outline"
  className="text-black border-black"
>
  <Check className="w-4 h-4 mr-1" /> Approve
</Button>
<Button
  onClick={() => {
    rejectRepairRequest(id);
    setRepairRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  }}
  variant="outline"
  className="text-black border-black"
>
  <X className="w-4 h-4 mr-1" /> Reject
</Button>

                          </>
                        ) : (
                          <span
                            className={`font-bold px-4 py-2 rounded-full text-sm ${status === 'approved'
                              ? 'bg-gray-200 text-black'
                              : 'bg-gray-300 text-black'
                              }`}
                          >
                            {status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </span>
                        )}

                        <Button
                          onClick={() => generateRepairPDF(req)}
                          variant="outline"
                          className="text-black border-black"
                        >
                          📄 Generate PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-gray-500 italic">No repair requests</p>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Users Management</h2>
              <span className="text-gray-600 font-medium">
                Total Users: {getAllUsers().length}
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              View, edit, and manage all registered users.
            </p>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Email</th>
                    <th className="border px-4 py-2 text-left">Role</th>
                    <th className="border px-4 py-2 text-left">Phone</th>
                    <th className="border px-4 py-2 text-left">Verified</th>
                    <th className="border px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {getAllUsers().map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{u.name}</td>
                      <td className="border px-4 py-2">{u.email}</td>
                      <td className="border px-4 py-2 capitalize">{u.role}</td>
                      <td className="border px-4 py-2">{u.phone || '-'}</td>
                      <td className="border px-4 py-2">{u.verified ? '✅' : '❌'}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newName = prompt('Enter new name', u.name);
                            if (newName) updateUser(u.id, { name: newName });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


      {activeTab === 'workers' && (
  <div className="p-6 space-y-6">
    <h2 className="text-2xl font-bold mb-4">Workers / Contractors / Designers</h2>
    <p className="text-muted-foreground mb-6">
      Review worker applications and approve or reject them
    </p>

    {workerApplications && workerApplications.length > 0 ? (
  workerApplications.map((worker) => {
    const {
      id,
      fullName,
      email,
      phone,
      positionApplied,
      experienceYears,
      skillsServices = [],
      constructionSkills = [],
      certifications = [],
      description,
      educationLevel,
      fieldOfStudy,
      institutionName,
      status,
    } = worker;

    return (
      <Card key={id} className="border border-gray-300 rounded-xl shadow-sm bg-white">
        <CardContent className="p-6 flex flex-col space-y-4">

          {/* Worker Details */}
          <table className="min-w-full table-auto text-sm border-collapse">
            <tbody className="divide-y divide-gray-300">
              <tr><td className="px-4 py-2 font-semibold">👤 Full Name</td><td>{fullName}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">✉ Email</td><td>{email}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">📞 Phone</td><td>{phone || '-'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">💼 Position Applied</td><td>{positionApplied}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">📝 Description</td><td>{description || '-'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">🎓 Education</td><td>{educationLevel} in {fieldOfStudy} ({institutionName})</td></tr>
              <tr><td className="px-4 py-2 font-semibold">⚡ Experience</td><td>{experienceYears} {experienceYears > 1 ? 'years' : 'year'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">🛠 Construction Skills</td><td>{constructionSkills.length > 0 ? constructionSkills.join(', ') : '-'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">🛠 Other Skills / Services</td><td>{skillsServices.length > 0 ? skillsServices.join(', ') : '-'}</td></tr>
              <tr><td className="px-4 py-2 font-semibold">📜 Certifications</td><td>{certifications.length > 0 ? certifications.join(' | ') : '-'}</td></tr>
            </tbody>
          </table>

          {/* Approve / Reject */}
          <div className="flex justify-end gap-3 mt-4">
            {status === 'pending' ? (
              <>
                <Button
  onClick={() => approveJob(id)}
  variant="outline"
  className="text-black border-black"
>
  <Check className="w-4 h-4 mr-1" /> Approve
</Button>

<Button
  onClick={() => rejectJob(id)}
  variant="outline"
  className="text-red-600 border-red-600"
>
  <X className="w-4 h-4 mr-1" /> Reject
</Button>

              </>
            ) : (
              <span
                className={`font-bold px-4 py-2 rounded-full text-sm ${
                  status === 'approved' ? 'bg-gray-200 text-black' : 'bg-gray-300 text-black'
                }`}
              >
                {status === 'approved' ? '✅ Approved' : '❌ Rejected'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  })
) : (
  <p className="text-gray-500 italic">No worker applications</p>
)}

  </div>
)}


      </div>
    </main >
  );
};

export default AdminDashboard;
