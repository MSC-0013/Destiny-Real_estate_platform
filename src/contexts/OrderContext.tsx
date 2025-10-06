import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Property } from './PropertyContext';
import API from '../utils/api';

export interface Order {
  id: string;         // Frontend/localStorage ID (global)
  _id?: string;       // MongoDB backend ID
  propertyId: string | Property;
  property?: Property;
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

  useEffect(() => {
    // Load from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    // Fetch from backend
    if (user?._id) fetchUserOrders(user._id);
  }, [user?._id]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | '_id'>) => {
    try {
      const backendData = {
        propertyId: typeof orderData.propertyId === 'string' ? orderData.propertyId : orderData.propertyId._id,
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

      // Use global frontend id
      const localOrder: Order = {
        ...orderData,
        _id: backendOrder._id,
        id: Date.now().toString(), // global frontend id
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

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      // Update locally
      const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      // Update backend
      const backendOrder = orders.find(o => o.id === id);
      if (backendOrder?._id) {
        await API.put(`/orders/${backendOrder._id}/status`, { status });
        console.log('Order status updated in backend');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const fetchUserOrders = async (userId: string) => {
    try {
      const response = await API.get(`/orders/buyer/${userId}`);
      const backendOrders = response.data.map((o: any) => ({
        ...o,
        id: Date.now().toString(), // global frontend id
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
