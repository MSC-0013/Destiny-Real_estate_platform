import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useOrder } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigate, Link } from 'react-router-dom';
import { Home, Plus, TrendingUp, Eye, DollarSign, Package } from 'lucide-react';
import RevenueChart from '@/components/analytics/RevenueChart';
import IncomeExpenseChart from '@/components/analytics/IncomeExpenseChart';
import { useConstruction } from '@/contexts/ConstructionContext';



const LandlordDashboard = () => {
  const { user } = useAuth();
  const { properties } = useProperty();
  const { getSellerOrders } = useOrder();
  const { addProject } = useConstruction();


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'landlord') {
    return <Navigate to="/" replace />;
  }

  const landlordProperties = properties.filter(property => property.sellerId === user.id);
  const landlordOrders = getSellerOrders(user.id);
  const totalRevenue = landlordOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  const rentalIncome = landlordOrders
    .filter(order => order.type === 'rental' && order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  const salesIncome = landlordOrders
    .filter(order => order.type === 'purchase' && order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  // Mock analytics data
  const revenueData = [
    { month: 'Jan', revenue: totalRevenue * 0.12 },
    { month: 'Feb', revenue: totalRevenue * 0.15 },
    { month: 'Mar', revenue: totalRevenue * 0.18 },
    { month: 'Apr', revenue: totalRevenue * 0.16 },
    { month: 'May', revenue: totalRevenue * 0.19 },
    { month: 'Jun', revenue: totalRevenue * 0.20 },
  ];

  const incomeExpenseData = [
    { month: 'Jan', income: totalRevenue * 0.15, expenses: totalRevenue * 0.05 },
    { month: 'Feb', income: totalRevenue * 0.18, expenses: totalRevenue * 0.06 },
    { month: 'Mar', income: totalRevenue * 0.16, expenses: totalRevenue * 0.04 },
    { month: 'Apr', income: totalRevenue * 0.20, expenses: totalRevenue * 0.07 },
    { month: 'May', income: totalRevenue * 0.17, expenses: totalRevenue * 0.05 },
    { month: 'Jun', income: totalRevenue * 0.14, expenses: totalRevenue * 0.03 },
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Landlord Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here's your property overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Home className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{landlordProperties.length}</div>
              <p className="text-xs text-muted-foreground">Total listings</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-luxury" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{landlordOrders.length}</div>
              <p className="text-xs text-muted-foreground">All transactions</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {landlordProperties.filter(p => p.available).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently listed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild className="w-full">
              <Link to="/add-property">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/properties">
                <Eye className="mr-2 h-4 w-4" />
                View Listings
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/orders">
                <Package className="mr-2 h-4 w-4" />
                View Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/profile">
                <TrendingUp className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueChart data={revenueData} />
          <IncomeExpenseChart data={incomeExpenseData} />
        </div>

        {/* Income Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Rental Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">
                Rs. {rentalIncome.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                From {landlordOrders.filter(o => o.type === 'rental').length} rental agreements
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Sales Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-luxury mb-2">
                Rs. {salesIncome.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                From {landlordOrders.filter(o => o.type === 'purchase').length} property sales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {landlordOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {landlordOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{order.property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">Rs. {order.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground capitalize">{order.type}</p>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Properties */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {landlordProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
                <Button asChild>
                  <Link to="/add-property">
                    <Plus className="mr-2 h-4 w-4" />
                    List Your First Property
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {landlordProperties.slice(0, 6).map(property => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">
                          Rs. {property.price.toLocaleString()}
                        </span>
                        <Badge variant={property.available ? 'default' : 'secondary'}>
                          {property.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>

                      <Button asChild variant="outline" className="w-full mt-2">
                        <Link to={`/edit-property/${property.id}`}>
                          Edit Property
                        </Link>
                      </Button>

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LandlordDashboard;