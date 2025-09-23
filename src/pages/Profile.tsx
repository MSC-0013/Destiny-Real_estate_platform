import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'tenant',
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    toast({ title: 'Success', description: 'Profile updated successfully!' });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: 'tenant' | 'seller' | 'admin') => 
                      setFormData(prev => ({ ...prev, role: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;