import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useOrder } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, User } from 'lucide-react';

const TenantDashboard = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { getUserOrders } = useOrder();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'tenant') {
    return <Navigate to="/" replace />;
  }

  const userOrders = getUserOrders(user.id);

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Manage your rentals and wishlist</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wishlist.length}</div>
              <p className="text-xs text-muted-foreground">Properties saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userOrders.length}</div>
              <p className="text-xs text-muted-foreground">Total orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userOrders.filter(order => order.type === 'rental' && order.status === 'confirmed').length}
              </div>
              <p className="text-xs text-muted-foreground">Current rentals</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/properties">
                <Button className="w-full justify-start">Browse Properties</Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="outline" className="w-full justify-start">View Wishlist</Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline" className="w-full justify-start">My Orders</Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start">Edit Profile</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userOrders.length > 0 ? (
                <div className="space-y-3">
                  {userOrders.slice(0, 3).map((order) => (
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
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default TenantDashboard;