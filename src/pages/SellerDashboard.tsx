import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useOrder } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigate, Link } from 'react-router-dom';
import { Home, ShoppingBag, DollarSign, Plus } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { properties } = useProperty();
  const { getSellerOrders } = useOrder();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  const sellerProperties = properties.filter(property => property.sellerId === user.id);
  const sellerOrders = getSellerOrders(user.id);
  const totalRevenue = sellerOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Manage your property listings and sales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerProperties.length}</div>
              <p className="text-xs text-muted-foreground">Total listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerOrders.length}</div>
              <p className="text-xs text-muted-foreground">Total orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sellerProperties.filter(p => p.available).length}
              </div>
              <p className="text-xs text-muted-foreground">Properties available</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/add-property">
                <Button className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Property
                </Button>
              </Link>
              <Link to="/properties">
                <Button variant="outline" className="w-full justify-start">View All Properties</Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline" className="w-full justify-start">View Orders</Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start">Edit Profile</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {sellerOrders.length > 0 ? (
                <div className="space-y-3">
                  {sellerOrders.slice(0, 3).map((order) => (
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
                <p className="text-muted-foreground">No recent orders</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {sellerProperties.length > 0 ? (
              <div className="space-y-3">
                {sellerProperties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${property.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {property.available ? 'Available' : 'Sold'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No properties listed yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SellerDashboard;