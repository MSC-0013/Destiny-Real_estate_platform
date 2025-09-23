import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useOrder } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigate, Link } from 'react-router-dom';
import { Users, Home, ShoppingBag, DollarSign, Settings, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { properties } = useProperty();
  const { orders } = useOrder();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the entire real estate platform</p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/add-property">
                <Button className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Construction Project
                </Button>
              </Link>
              <Link to="/properties">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  Manage Properties
                </Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Manage Orders
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Users className="w-4 h-4 mr-2" />
                Manage Users (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{order.property.title}</p>
                        <p className="text-sm text-muted-foreground">{order.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>For Sale</span>
                  <span>{properties.filter(p => p.category === 'sale').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>For Rent</span>
                  <span>{properties.filter(p => p.category === 'rent').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available</span>
                  <span>{properties.filter(p => p.available).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Featured</span>
                  <span>{properties.filter(p => p.featured).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{orders.filter(o => o.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmed</span>
                  <span>{orders.filter(o => o.status === 'confirmed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span>{orders.filter(o => o.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancelled</span>
                  <span>{orders.filter(o => o.status === 'cancelled').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;