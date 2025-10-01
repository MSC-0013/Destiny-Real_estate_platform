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


const AdminDashboard = () => {
  const { user } = useAuth();
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
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="constructionRequests">Construction Requests</TabsTrigger>
            <TabsTrigger value="repairRequests">Repair Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="workers">Workers / Contractors / Designers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Overview cards */}
          </TabsContent>

          <TabsContent value="constructionRequests">
            {/* Construction Requests cards */}
          </TabsContent>

          <TabsContent value="repairRequests">
            {/* Repair Requests cards */}
          </TabsContent>

          <TabsContent value="analytics">
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
            {/* Header with count */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-800 animate-fadeIn">
                Construction Requests
              </h2>
              <span className="text-gray-600 font-medium">
                Total: {constructionRequests.length}
              </span>
            </div>

            {constructionRequests.length > 0 ? (
              constructionRequests.map(req => {
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
                  <motion.div
                    key={id}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 rounded-xl">
                      <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">

                        {/* Left side: Request details */}
                        <div className="flex-1 space-y-6">

                          {/* Title */}
                          <p className="text-2xl md:text-3xl font-bold text-gray-900">{title}</p>

                          {/* Personal Summary */}
                          <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-2">👤 Personal Summary</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p><span className="font-medium">Full Name:</span> {clientName}</p>
                              <p><span className="font-medium">Email:</span> {email}</p>
                              <p><span className="font-medium">Phone:</span> {phone}</p>
                            </div>
                          </div>

                          {/* Project Details */}
                          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-2">🏗 Project Details</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p><span className="font-medium">Type:</span> {projectType}</p>
                              <p><span className="font-medium">Location:</span> {location}</p>
                              <p><span className="font-medium">Area:</span> {area} sq. ft.</p>
                              <p><span className="font-medium">Bedrooms:</span> {bedrooms}</p>
                              <p><span className="font-medium">Bathrooms:</span> {bathrooms}</p>
                              <p><span className="font-medium">Floors:</span> {floors}</p>
                            </div>
                          </div>

                          {/* Budget & Timeline */}
                          <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-2">💰 Budget & Timeline</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p><span className="font-medium">Budget:</span> {budget}</p>
                              <p><span className="font-medium">Timeline:</span> {timeline}</p>
                            </div>
                          </div>

                          {/* Special Requirements */}
                          {specialRequirements && (
                            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                              <h3 className="font-bold text-gray-800 mb-2">⭐ Special Requirements</h3>
                              <p className="text-sm text-gray-700">{specialRequirements}</p>
                            </div>
                          )}

                          {/* Project Description */}
                          {description && (
                            <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                              <h3 className="font-bold text-gray-800 mb-2">📝 Project Description</h3>
                              <p className="text-sm text-gray-700">{description}</p>
                            </div>
                          )}

                          {/* Documents */}
                          {documents && (
                            <div className="mt-2">
                              <a
                                href={documents}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
                              >
                                📎 Download Documents
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Right side: Action buttons */}
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3 mt-3 md:mt-0">

                          {status === 'pending' ? (
                            <>
                              <Button
                                onClick={() => approveConstructionRequest(id)}
                                variant="outline"
                                className="text-green-600 hover:bg-green-50 transition-all"
                              >
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button
                                onClick={() => rejectConstructionRequest(id)}
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 transition-all"
                              >
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </>
                          ) : (
                            <span
                              className={`font-bold px-4 py-2 rounded-lg text-sm ${status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          )}

                          {/* PDF Generation Button */}
                          <Button
                            onClick={() => ConstructionPdf(req, 'Construction')}
                            variant="outline"
                            className="text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            📄 Generate PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-500 italic">No construction requests</p>
            )}
          </div>
        )}

        {activeTab === 'repairRequests' && (
          <div className="p-6 space-y-6">
            {/* Header with count */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-800 animate-fadeIn">
                Repair Requests
              </h2>
              <span className="text-gray-600 font-medium">
                Total: {repairRequests.length}
              </span>
            </div>

            {repairRequests.length > 0 ? (
              repairRequests.map(req => {
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
                  <motion.div
                    key={id}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 rounded-xl">
                      <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">

                        {/* Left side: Request details */}
                        <div className="flex-1 space-y-6">

                          {/* Title */}
                          <p className="text-2xl md:text-3xl font-bold text-gray-900">Title: {title}</p>

                          {/* Personal Summary */}
                          <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-2">👤 Personal Summary</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p><span className="font-medium">Full Name:</span> {clientName}</p>
                              <p><span className="font-medium">Email:</span> {email}</p>
                              <p><span className="font-medium">Phone:</span> {phone}</p>
                              <p><span className="font-medium">City/State:</span> {city}</p>
                            </div>
                          </div>

                          {/* Repair Details */}
                          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-2">🔧 Repair Details</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p><span className="font-medium">Repair Title:</span> {repairTitle}</p>
                              <p><span className="font-medium">Description:</span> {description}</p>
                              <p><span className="font-medium">Address:</span> {address}</p>
                              <p><span className="font-medium">Estimated Cost:</span> {estimatedCost || 'N/A'}</p>
                              <p><span className="font-medium">Project Type:</span> {projectType}</p>
                              <p><span className="font-medium">Urgency:</span> {urgency}</p>
                            </div>
                          </div>

                          {/* Documents */}
                          {documents && (
                            <div className="mt-2">
                              <a
                                href={documents}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
                              >
                                📎 Download Documents
                              </a>
                            </div>
                          )}

                        </div>

                        {/* Right side: Action buttons */}
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3 mt-3 md:mt-0">
                          {status === 'pending' ? (
                            <>
                              <Button
                                onClick={() => approveRepairRequest(id)}
                                variant="outline"
                                className="text-green-600 hover:bg-green-50 transition-all"
                              >
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button
                                onClick={() => rejectRepairRequest(id)}
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 transition-all"
                              >
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </>
                          ) : (
                            <span
                              className={`font-bold px-4 py-2 rounded-lg text-sm ${status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          )}

                          {/* PDF Generation Button */}
                          <Button
                            onClick={() => generateRepairPDF(req)}
                            variant="outline"
                            className="text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            📄 Generate PDF
                          </Button>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-500 italic">No repair requests</p>
            )}
          </div>
        )}



        {activeTab === 'analytics' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <p className="text-muted-foreground">Charts and statistics go here</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <p className="text-muted-foreground">Details of all users go here</p>
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Workers / Contractors / Designers</h2>
            <p className="text-muted-foreground">Details and forms for workers, contractors, and designers</p>
          </div>
        )}
      </div>
    </main >
  );
};

export default AdminDashboard;
