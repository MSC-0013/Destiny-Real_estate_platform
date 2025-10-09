import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const AnalyticsTab = () => {
  const { getAllUsers } = useAuth();
  const { orders } = useOrder();

  const [users, setUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
  }, [getAllUsers]);

  // Helper function: get orders by user role  
  const ordersByUserRole = (role: string) =>
    orders.filter(order => {
      const user = users.find(u => u._id === order.buyerId || u._id === order.sellerId);
      return user?.role === role;
    });

  // Revenue per month (only completed orders)
  const revenueData = orders
    .filter(o => o.status === 'completed' && o.createdAt)
    .map(o => ({
      month: new Date(o.createdAt).toLocaleString('default', { month: 'short' }),
      revenue: o.amount || 0,
    }));

  // Count of users per role
  const userRoles = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Deal statistics for PieChart
  const dealStats = [
    { name: 'Total Deals', value: orders.length },
    { name: 'Completed Deals', value: orders.filter(o => o.status === 'completed').length },
    { name: 'Pending Deals', value: orders.filter(o => o.status === 'pending').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const roles = ['tenant', 'landlord', 'worker', 'contractor', 'designer'];

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Platform Analytics</h2>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Settings className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoles['worker'] || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
            <Settings className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoles['contractor'] || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Designers</CardTitle>
            <Settings className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoles['designer'] || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Deals Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deals Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dealStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {dealStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Users & Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users & Deals Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Count</th>
                  <th className="px-4 py-2 border">Deals Completed</th>
                  <th className="px-4 py-2 border">Deals Pending</th>
                  <th className="px-4 py-2 border">Revenue ($)</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => {
                  const completedOrders = ordersByUserRole(role).filter(o => o.status === 'completed');
                  const pendingOrders = ordersByUserRole(role).filter(o => o.status === 'pending');
                  return (
                    <tr key={role}>
                      <td className="px-4 py-2 border capitalize">{role}</td>
                      <td className="px-4 py-2 border">{userRoles[role] || 0}</td>
                      <td className="px-4 py-2 border">{completedOrders.length}</td>
                      <td className="px-4 py-2 border">{pendingOrders.length}</td>
                      <td className="px-4 py-2 border">
                        ${completedOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
