import React, { createContext, useContext, useState, useEffect } from 'react';
import * as API from "@/utils/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'tenant' | 'landlord' | 'admin' | 'contractor' | 'worker' | 'designer';
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
  occupation?: string;
  bio?: string;
  profileImage?: string;
  verified?: boolean;
  documents?: string[];
  portfolio?: {
    title: string;
    description: string;
    images: string[];
    completedDate?: string;
  }[];
  earnings?: number;
  rating?: number;
  completedJobs?: number;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, '_id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User> | FormData) => Promise<void>;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on start
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await API.login(email, password);
      setUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  // Signup
  const signup = async (userData: Omit<User, '_id'> & { password: string }): Promise<boolean> => {
    try {
      const { data } = await API.signup(userData);
      setUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error('Signup failed:', err);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  // Get all users
  const getAllUsers = (): User[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  // Get user by ID
  const getUserById = (id: string): User | undefined => {
    const users = getAllUsers();
    return users.find(u => u._id === id);
  };

  // Update own profile
  const updateProfile = async (userData: Partial<User> | FormData) => {
    if (!user) return;
    try {
      let res;
      if (userData instanceof FormData) {
        res = await API.updateUser(user._id, userData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        res = await API.updateUser(user._id, userData);
      }
      setUser(res.data);
      localStorage.setItem('currentUser', JSON.stringify(res.data));
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  // Update any user (admin)
  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const res = await API.updateUser(id, userData);
      const users = getAllUsers();
      const updatedUsers = users.map(u => u._id === id ? { ...u, ...res.data } : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      if (user?._id === id) setUser({ ...user, ...res.data });
    } catch (err) {
      console.error('Update user failed:', err);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      await API.deleteUser(id);
      const users = getAllUsers();
      const filteredUsers = users.filter(u => u._id !== id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      if (user?._id === id) setUser(null);
    } catch (err) {
      console.error('Delete user failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        getAllUsers,
        getUserById,
        updateUser,
        deleteUser,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
