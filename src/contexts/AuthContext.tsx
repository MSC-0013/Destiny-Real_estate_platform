import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      try {
        const { saveSession } = await import('@/utils/indexedDB');
        await saveSession({ user: userWithoutPassword });
      } catch (err) {
        console.error('Failed to save session to IndexedDB:', err);
      }

      return true;
    }
    return false;
  };

  // Signup function
  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === userData.email)) return false;

    const newUser = { ...userData, id: Date.now().toString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };

  // Logout
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    try {
      const { clearSession } = await import('@/utils/indexedDB');
      await clearSession();
    } catch (err) {
      console.error('Failed to clear IndexedDB session:', err);
    }
  };

  // Get all users
  const getAllUsers = (): User[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  // Get a user by ID
  const getUserById = (id: string): User | undefined => {
    const users = getAllUsers();
    return users.find(u => u.id === id);
  };

  // Update current user profile
  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users = getAllUsers();
    const updatedUsers = users.map(u => (u.id === user.id ? { ...u, ...userData } : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Update any user by ID (admin feature)
  const updateUser = (id: string, userData: Partial<User>) => {
    const users = getAllUsers();
    const updatedUsers = users.map(u => (u.id === id ? { ...u, ...userData } : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    if (user?.id === id) setUser({ ...user, ...userData });
  };

  // Delete user by ID
  const deleteUser = (id: string) => {
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
