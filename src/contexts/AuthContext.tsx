import React, { createContext, useContext, useState, useEffect } from 'react';
import * as API from "@/utils/api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
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

  // Load current user from localStorage or IndexedDB
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoading(false);
        return;
      }
      try {
        const { getSession } = await import('@/utils/indexedDB');
        const session = await getSession();
        if (session && session.user) setUser(session.user);
      } catch (err) {
        console.error('Failed to load session from IndexedDB:', err);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  // ✅ Login function (backend + local)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await API.login(email, password);
      setUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      const { saveSession } = await import('@/utils/indexedDB');
      await saveSession({ user: data.user });
      return true;
    } catch {
      // fallback to local storage only
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    }
  };

  // ✅ Signup function (backend + local)
  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const { data } = await API.signup(userData);
      setUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      const { saveSession } = await import('@/utils/indexedDB');
      await saveSession({ user: data.user });
      return true;
    } catch {
      // fallback local
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.email === userData.email)) return false;
      const newUser = { ...userData, id: Date.now().toString() };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
  };

  // ✅ Logout
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    try {
      const { clearSession } = await import('@/utils/indexedDB');
      await clearSession();
    } catch (err) {
      console.error('Failed to clear IndexedDB session:', err);
    }
  };

  // ✅ Get all users (backend fallback to local)
  const getAllUsers = (): User[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  // ✅ Get user by ID
  const getUserById = (id: string): User | undefined => {
    const users = getAllUsers();
    return users.find(u => u.id === id);
  };

  // ✅ Update profile (backend + local)
  const updateProfile = async (userData: Partial<User> | FormData) => {
  if (!user) return;

  try {
    let data;
    if (userData instanceof FormData) {
      const res = await API.updateUser(user.id, userData, { headers: { "Content-Type": "multipart/form-data" } });
      data = res.data;
    } else {
      const res = await API.updateUser(user.id, userData);
      data = res.data;
    }

    setUser(data);
    localStorage.setItem("currentUser", JSON.stringify(data));
  } catch {
    // fallback local
    const updatedUser = { ...user, ...(userData instanceof FormData ? {} : userData) };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }
};

  // ✅ Update any user (admin)
  const updateUser = (id: string, userData: Partial<User>) => {
    try {
      API.updateUser(id, userData);
    } catch {}
    const users = getAllUsers();
    const updatedUsers = users.map(u => (u.id === id ? { ...u, ...userData } : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    if (user?.id === id) setUser({ ...user, ...userData });
  };

  // ✅ Delete user
  const deleteUser = (id: string) => {
    try {
      API.deleteUser(id);
    } catch {}
    const users = getAllUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    if (user?.id === id) setUser(null);
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
