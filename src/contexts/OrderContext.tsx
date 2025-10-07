import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Property } from './PropertyContext';
import API from '../utils/api';

export interface Order {
  id: string;           // Frontend/localStorage ID (global)
  _id?: string;         // MongoDB backend ID
  propertyId: string | Property;
  property?: Property | null;
  buyerId: string;
  sellerId: string;
  type: 'purchase' | 'rental';
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  duration?: string;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | '_id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getUserOrders: (userId: string) => Order[];
  getSellerOrders: (sellerId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderProvider');
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  // Load orders from localStorage & backend
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    if (user?._id) fetchUserOrders(user._id);
  }, [user?._id]);

  // Create a new order
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | '_id'>) => {
    try {
      const backendData = {
        propertyId: typeof orderData.propertyId === 'string' ? orderData.propertyId : orderData.propertyId.id,
        buyerId: orderData.buyerId,
        sellerId: orderData.sellerId,
        type: orderData.type,
        amount: orderData.amount,
        status: orderData.status,
        startDate: orderData.startDate,
        endDate: orderData.endDate,
        duration: orderData.duration,
      };

      const response = await API.post('/orders', backendData);
      const backendOrder = response.data;

      const localOrder: Order = {
        ...orderData,
        _id: backendOrder._id,
        id: backendOrder._id || Date.now().toString(), // Normalize ID for frontend
        property: orderData.propertyId && typeof orderData.propertyId !== 'string' ? orderData.propertyId : null,
        createdAt: new Date().toISOString(),
      };

      const updatedOrders = [...orders, localOrder];
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      console.log('Order saved locally and backend:', backendOrder);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const updatedOrders = orders.map(o => (o.id === id ? { ...o, status } : o));
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      const backendOrder = orders.find(o => o.id === id);
      if (backendOrder?._id) {
        await API.put(`/orders/${backendOrder._id}/status`, { status });
        console.log('Order status updated in backend');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Fetch user orders from backend
  const fetchUserOrders = async (userId: string) => {
    try {
      const response = await API.get(`/orders/buyer/${userId}`);
      const backendOrders = response.data.map((o: any) => ({
        ...o,
        id: o._id,                      // frontend uses _id
        property: o.propertyId || null, // <-- assign propertyId to property
      }));
      setOrders(backendOrders);
      localStorage.setItem('orders', JSON.stringify(backendOrders));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };


  const getUserOrders = (userId: string) => orders.filter(o => o.buyerId === userId);
  const getSellerOrders = (sellerId: string) => orders.filter(o => o.sellerId === sellerId);

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, getUserOrders, getSellerOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
