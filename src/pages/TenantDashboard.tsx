import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useOrder } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, Settings, PieChart, Mail, Phone, Camera, Edit3, Save, X, Shield, MapPin, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { OrderPdf } from '@/components/analytics/downloadOrderPDF';
import jsPDF from 'jspdf';
import type { Order } from '@/contexts/OrderContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';



const TenantDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { wishlist } = useWishlist();
  const { getUserOrders } = useOrder();
  const { toast } = useToast();
  const navigate = useNavigate();


  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'tenant',
    address: user?.address || '',
    occupation: user?.occupation || '',
  });


  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'tenant') return <Navigate to="/" replace />;

  const userOrders = getUserOrders(user._id);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.amount, 0);
  const activeRentals = userOrders.filter(order => order.type === 'rental' && order.status === 'confirmed').length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ ...formData, profileImage });
    setIsEditing(false);
    toast({ title: 'Success', description: 'Profile updated successfully!' });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || '',
      occupation: user.occupation || '',
    });
    setProfileImage(null);
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-200';
      case 'seller': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contractor': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'designer': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'worker': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mb-6">Manage your rentals, wishlist, and personal settings</p>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 border-b">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* --- Orders Tab --- */}
          <TabsContent value="orders">
            {/* Top Summary Cards with actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
              {/* Total Orders Card */}
              <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 group">
                <CardHeader className="flex justify-between items-center pb-2">
                  <CardTitle className="text-sm font-bold tracking-wide">📦 Total Orders</CardTitle>
                  <ShoppingBag className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold">{userOrders.length}</div>
                  <p className="text-xs opacity-80">All orders made so far</p>
                  <button
                    className="mt-3 bg-white text-purple-600 font-semibold px-3 py-1 rounded-full hover:scale-105 transition-transform shadow hover:shadow-lg flex items-center space-x-1"
                    onClick={() => navigate('/orders')}
                  // navigate to my orders page
                  >
                    <span>➡️</span>
                    <span>View My Orders</span>
                  </button>
                </CardContent>
              </Card>

              {/* Active Rentals Card */}
              <Card className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 group">
                <CardHeader className="flex justify-between items-center pb-2">
                  <CardTitle className="text-sm font-bold tracking-wide">🏠 Active Rentals</CardTitle>
                  <User className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold">{activeRentals}</div>
                  <p className="text-xs opacity-80">Current rentals</p>
                  <button
                    className="mt-3 bg-white text-green-600 font-semibold px-3 py-1 rounded-full hover:scale-105 transition-transform shadow hover:shadow-lg flex items-center space-x-1"
                    onClick={() => setActiveTab('analytics')} // switch to analytics tab
                  >
                    <span>📊</span>
                    <span>View Analytics</span>
                  </button>
                </CardContent>
              </Card>

              {/* Wishlist Items Card */}
              <Card className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 group">
                <CardHeader className="flex justify-between items-center pb-2">
                  <CardTitle className="text-sm font-bold tracking-wide">💖 Wishlist Items</CardTitle>
                  <Heart className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold">{wishlist.length}</div>
                  <p className="text-xs opacity-80">Saved properties for later</p>
                  <button
                    className="mt-3 bg-white text-red-500 font-semibold px-3 py-1 rounded-full hover:scale-105 transition-transform shadow hover:shadow-lg flex items-center space-x-1"
                    onClick={() => navigate('/wishlist')}
                  // navigate to wishlist page
                  >
                    <span>💌</span>
                    <span>Go to Wishlist</span>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders List */}
            <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden animate-fadeInUp">
              <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                <CardTitle className="text-lg font-bold flex items-center space-x-2">
                  <span>📝 Recent Orders</span>
                  <span className="text-sm opacity-80 ml-2">Latest 5 orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                {userOrders.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No orders yet 😢</p>
                ) : (
                  <div className="space-y-4">
                    {userOrders.slice(0, 5).map(order => (
                      <div
                        key={order._id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-gray-50 to-gray-100 group relative"
                      >
                        {/* Order Info */}
                        <div>
                          <p className="font-semibold text-lg">{order.property?.title || 'Property Not Available'} 🏡</p>
                          <p className="text-sm text-gray-500 capitalize">{order.type}</p>
                          <p className={`mt-1 text-sm font-medium ${order.status === 'confirmed' ? 'text-green-600' :
                            order.status === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                            Status: {order.status} {order.status === 'confirmed' ? '✅' : order.status === 'pending' ? '⏳' : '❌'}
                          </p>
                        </div>

                        {/* Amount & PDF Download */}
                        <div className="mt-3 md:mt-0 flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-700">₹{order.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Total Paid</p>
                          </div>

                          {/* PDF Download Button */}
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 transition-all duration-300 shadow-lg transform hover:scale-110"
                            onClick={() => OrderPdf(order)}
                          >
                            <span>📄</span>
                            <span className="text-sm font-medium">PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="profile">
            <Card className="border-0 shadow-2xl overflow-hidden rounded-2xl">
              {/* Profile Header */}
              <div className="relative h-56 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                <div className="absolute bottom-4 left-6 flex items-end space-x-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden transition-transform hover:scale-105">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <User className="w-20 h-20 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="text-white pb-4">
                    <h2 className="text-4xl font-extrabold drop-shadow-lg">{user.name}</h2>
                    <div className="flex items-center space-x-3 mt-2">
                      <Shield className="h-4 w-4" />
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)} bg-white/20 backdrop-blur-sm`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center mt-3 space-x-2 text-sm font-medium">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="absolute top-4 right-4">
                  <Link to="/profile">
                    <Button className="bg-white/20 text-white hover:bg-white hover:text-black backdrop-blur-sm border border-white/30 shadow-lg">
                      <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Profile Details */}
              <CardContent className="p-8 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: user.phone || '-' },
                    { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
                    { label: 'Address', value: user.address || '-' },
                    { label: 'Occupation', value: user.occupation || '-' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <Label className="text-gray-600 font-medium">{item.label}</Label>
                      <Input value={item.value} disabled className="border-gray-300 bg-white/80 text-gray-700 font-medium shadow-sm rounded-lg" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* --- Expenses Tab --- */}
          <TabsContent value="expenses">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100 shadow-xl hover:scale-105 transition-transform">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">₹{totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-purple-800 mt-1">All orders combined</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-tr from-green-100 via-teal-100 to-blue-100 shadow-xl hover:scale-105 transition-transform">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Active Rentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{activeRentals}</div>
                  <p className="text-xs text-green-800 mt-1">Currently rented properties</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-tr from-pink-100 via-red-100 to-orange-100 shadow-xl hover:scale-105 transition-transform">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-pink-700">Orders Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-900">{userOrders.length}</div>
                  <p className="text-xs text-pink-800 mt-1">Total orders placed</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">All Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {userOrders.length === 0 ? (
                  <p className="text-muted-foreground">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map(order => (
                      <div
                        key={order._id}
                        className="flex justify-between items-center p-3 border rounded hover:shadow-md transition"
                      >
                        <div>
                          {/* Safe access to property title */}
                          <p className="font-medium">{order.property?.title || 'Property Not Available'}</p>
                          <p className="text-sm text-muted-foreground">{order.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-700">
                            ₹{order.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Analytics Tab --- */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 shadow-xl hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-indigo-700">Active Rentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-900">{activeRentals}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-tr from-green-100 via-teal-100 to-cyan-100 shadow-xl hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-green-700">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{userOrders.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-tr from-yellow-100 via-orange-100 to-red-100 shadow-xl hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-red-700">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">₹{totalSpent.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Section */}
            <Card className="shadow-lg mt-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Spending Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userOrders.map((order, index) => ({
                    name: `Order ${index + 1}`,
                    amount: order.amount,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </main>
  );
};

export default TenantDashboard;
