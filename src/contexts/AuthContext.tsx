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

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  const persistUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) localStorage.setItem('currentUser', JSON.stringify(newUser));
    else localStorage.removeItem('currentUser');
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await API.login(email, password);
      persistUser(data.user);
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const signup = async (userData: Omit<User, '_id'> & { password: string }) => {
    try {
      const { data } = await API.signup(userData);
      persistUser(data.user);
      return true;
    } catch (err) {
      console.error('Signup failed:', err);
      return false;
    }
  };

  const logout = () => {
    persistUser(null);
    localStorage.removeItem('token');
  };

  const getAllUsers = (): User[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  const getUserById = (id: string): User | undefined => {
    return getAllUsers().find(u => u._id === id);
  };

  const updateProfile = async (userData: FormData) => {
    if (!user) return;

    try {
      // Always send FormData with multipart/form-data headers
      const res = await API.updateUser(user._id, userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update user in state and localStorage
      persistUser(res.data);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };


  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const res = await API.updateUser(id, userData);
      const users = getAllUsers();
      const updatedUsers = users.map(u => u._id === id ? { ...u, ...res.data } : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      if (user?._id === id) persistUser({ ...user, ...res.data });
    } catch (err) {
      console.error('Update user failed:', err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await API.deleteUser(id);
      const users = getAllUsers();
      const filteredUsers = users.filter(u => u._id !== id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      if (user?._id === id) persistUser(null);
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
