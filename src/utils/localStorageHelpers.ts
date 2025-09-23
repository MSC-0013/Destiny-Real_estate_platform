/**
 * Utility functions for localStorage operations
 */

export const initializeStorage = () => {
  // Initialize with demo users if not already present
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@demo.com',
        phone: '+1 555 0100',
        role: 'admin',
        password: 'admin123'
      },
      {
        id: 'seller-1',
        name: 'John Smith',
        email: 'seller@demo.com',
        phone: '+1 555 0123',
        role: 'seller',
        password: 'seller123'
      },
      {
        id: 'tenant-1',
        name: 'Jane Doe',
        email: 'tenant@demo.com',
        phone: '+1 555 0124',
        role: 'tenant',
        password: 'tenant123'
      }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }
};

export const clearAllStorage = () => {
  localStorage.clear();
};

export const exportData = () => {
  const data = {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    properties: JSON.parse(localStorage.getItem('properties') || '[]'),
    orders: JSON.parse(localStorage.getItem('orders') || '[]'),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `estate-hub-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};