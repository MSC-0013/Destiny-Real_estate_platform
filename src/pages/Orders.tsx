import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Download, 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  FileText, 
  User, 
  Home,
  Building,
  CheckCircle,
  Timer,
  XCircle,
  AlertCircle,
  Receipt,
  Eye,
  Star
} from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const { getUserOrders } = useOrder();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userOrders = getUserOrders(user.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': 
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          border: 'border-emerald-200',
          icon: CheckCircle 
        };
      case 'confirmed': 
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-700', 
          border: 'border-blue-200',
          icon: Timer 
        };
      case 'pending': 
        return { 
          bg: 'bg-yellow-50', 
          text: 'text-yellow-700', 
          border: 'border-yellow-200',
          icon: AlertCircle 
        };
      case 'cancelled': 
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-700', 
          border: 'border-red-200',
          icon: XCircle 
        };
      default: 
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-700', 
          border: 'border-gray-200',
          icon: Clock 
        };
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const downloadInvoice = (order: any) => {
    // Create invoice content
    const invoiceContent = `
DESTINY REAL ESTATE - INVOICE
==============================

Invoice #: INV-${order.id}
Date: ${format(new Date(order.createdAt), 'MMM dd, yyyy')}

BILL TO:
${user.name}
Email: ${user.email}
Phone: ${user.phone}

PROPERTY DETAILS:
${order.property.title}
${order.property.location}
Type: ${order.type === 'rental' ? 'Rental' : 'Purchase'}

PAYMENT DETAILS:
Amount: ₹${order.amount.toLocaleString()}
Status: ${order.status.toUpperCase()}

${order.type === 'rental' && order.startDate ? `
RENTAL PERIOD:
Start: ${format(new Date(order.startDate), 'MMM dd, yyyy')}
End: ${format(new Date(order.endDate), 'MMM dd, yyyy')}
Duration: ${order.duration}
` : ''}

Thank you for choosing Destiny Real Estate!
Contact: support@destiny.com | +91 1800-123-4567
    `;

    // Create and download file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const orderStats = {
    total: userOrders.length,
    completed: userOrders.filter(o => o.status === 'completed').length,
    pending: userOrders.filter(o => o.status === 'pending').length,
    totalAmount: userOrders.reduce((sum, o) => sum + o.amount, 0)
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-black text-white">
            <Receipt className="mr-2 h-4 w-4" />
            Order Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent mb-4">
            My Orders
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your property purchases and rentals with detailed order information
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-black">{orderStats.total}</p>
                </div>
                <div className="p-3 bg-black/5 rounded-full">
                  <FileText className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-3xl font-bold text-emerald-600">{orderStats.completed}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-full">
                  <Timer className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-black">₹{orderStats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-black/5 rounded-full">
                  <IndianRupee className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {userOrders.length > 0 ? (
          <div className="space-y-8">
            {userOrders.map((order) => {
              const statusInfo = getStatusColor(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={order.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Property Image Header */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-700">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-6 left-6">
                      <Badge className={`${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                        <StatusIcon className="mr-2 h-4 w-4" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-2xl font-bold mb-2">{order.property.title}</h2>
                      <div className="flex items-center text-gray-200">
                        <MapPin className="mr-2 h-4 w-4" />
                        {order.property.location}
                      </div>
                    </div>
                    <div className="absolute top-6 right-6">
                      <Button
                        onClick={() => downloadInvoice(order)}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Invoice
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Order Progress</span>
                        <span className="text-sm font-bold text-black">{getProgressValue(order.status)}%</span>
                      </div>
                      <Progress value={getProgressValue(order.status)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Placed</span>
                        <span>Confirmed</span>
                        <span>Completed</span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order Type</p>
                          <p className="font-semibold text-black capitalize">{order.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <IndianRupee className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-semibold text-black">₹{order.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="font-semibold text-black">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-semibold text-black">#{order.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rental Details */}
                    {order.type === 'rental' && order.startDate && order.endDate && (
                      <>
                        <Separator className="my-6" />
                        <div className="bg-blue-50 rounded-lg p-6">
                          <h3 className="font-semibold text-black mb-4 flex items-center">
                            <Home className="mr-2 h-5 w-5" />
                            Rental Agreement Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-blue-700 font-medium">Start Date</p>
                              <p className="font-semibold text-blue-900">
                                {format(new Date(order.startDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-700 font-medium">End Date</p>
                              <p className="font-semibold text-blue-900">
                                {format(new Date(order.endDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-700 font-medium">Duration</p>
                              <p className="font-semibold text-blue-900">{order.duration || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Property Details */}
                    <Separator className="my-6" />
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-black mb-4 flex items-center">
                        <Building className="mr-2 h-5 w-5" />
                        Property Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Property Type:</span>
                          <span className="ml-2 font-medium">{order.property.type}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Area:</span>
                          <span className="ml-2 font-medium">{order.property.area} sq ft</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bedrooms:</span>
                          <span className="ml-2 font-medium">{order.property.bedrooms}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bathrooms:</span>
                          <span className="ml-2 font-medium">{order.property.bathrooms}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-8">
                      <Button 
                        onClick={() => downloadInvoice(order)}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                      <Button variant="outline" className="border-gray-300">
                        <Eye className="mr-2 h-4 w-4" />
                        View Contract
                      </Button>
                      {order.status === 'completed' && (
                        <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                          <Star className="mr-2 h-4 w-4" />
                          Rate Property
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-16 border-0 shadow-lg">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Receipt className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">No Orders Yet</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Start your property journey by browsing our premium listings and making your first order.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.href = '/properties'}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Browse Properties
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/construction'}
                    className="border-gray-300 px-8 py-3"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Custom Build
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Orders;