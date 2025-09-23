import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';

const Orders = () => {
  const { user } = useAuth();
  const { getUserOrders } = useOrder();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userOrders = getUserOrders(user.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'confirmed': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Orders</h1>
        
        {userOrders.length > 0 ? (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{order.property.title}</CardTitle>
                      <p className="text-muted-foreground">{order.property.location}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Type</p>
                      <p className="font-semibold capitalize">{order.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">${order.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-semibold">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {order.type === 'rental' && order.startDate && order.endDate && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-semibold">
                          {format(new Date(order.startDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-semibold">
                          {format(new Date(order.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No orders found</p>
            <p className="text-muted-foreground">Start browsing properties to make your first order!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;