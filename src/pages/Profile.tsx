import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  Save,
  X,
  Upload,
  Shield,
  Calendar,
  MapPin,
  Briefcase
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | File | null>(null);
  const [isSaving, setIsSaving] = useState(false); // <-- New state

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'tenant',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    occupation: user?.occupation || '',
    bio: user?.bio || '',
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file); // store the File object
    }
  };


  // Updated handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); // Start saving

    const form = new FormData();

    // Append all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value as string);
    });

    // Append profile image if exists
    if (profileImage) form.append("profileImage", profileImage);

    try {
      await updateProfile(form); // call AuthContext function
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false); // Stop saving
    }
  };



const handleCancel = () => {
  setFormData({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address || '',
    dateOfBirth: user.dateOfBirth || '',
    occupation: user.occupation || '',
    bio: user.bio || '',
  });
  setProfileImage(null);
  setIsEditing(false);
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-50 text-red-700 border-red-200';
    case 'seller': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'contractor': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'designer': return 'bg-pink-50 text-pink-700 border-pink-200';
    case 'worker': return 'bg-orange-50 text-orange-700 border-orange-200';
    default: return 'bg-green-50 text-green-700 border-green-200';
  }
};

return (
  <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-black text-white">
            <User className="mr-2 h-4 w-4" />
            Profile Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-xl overflow-hidden">
          {/* Header with Profile Image */}
          <div className="relative h-48 bg-gradient-to-r from-black to-gray-800">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-6 left-6 flex items-end space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                  {profileImage || user.profileImage ? (
                    <img
                      src={
                        profileImage instanceof File
                          ? URL.createObjectURL(profileImage)
                          : profileImage || user.profileImage
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />

                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="text-white pb-4">
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <div className="flex items-center space-x-4">
                  <Badge className={`${getRoleBadgeColor(user.role)} border`}>
                    <Shield className="mr-1 h-3 w-3" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <div className="flex items-center text-gray-200">
                    <Mail className="mr-1 h-4 w-4" />
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-6 right-6">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-black" />
                  <h3 className="text-xl font-semibold text-black">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      required
                      className="border-gray-300"
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
                      className="border-gray-300"
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
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: 'tenant' | 'landlord' | 'admin' | 'contractor' | 'designer' | 'worker') =>
                        setFormData(prev => ({ ...prev, role: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="landlord">Landlord</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-black" />
                  <h3 className="text-xl font-semibold text-black">Additional Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="e.g., Software Engineer"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </form>

            {/* Account Stats */}
            {/* Updated Account Stats with saving logic */}
            {!isEditing && !isSaving && (
              <>
                <Separator className="my-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-black mb-2">
                      {user.role === 'tenant' ? '5' : user.role === 'landlord' ? '12' : '8'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.role === 'tenant' ? 'Properties Viewed' : user.role === 'landlord' ? 'Properties Listed' : 'Projects Managed'}
                    </div>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-black mb-2">
                      {user.role === 'tenant' ? '2' : user.role === 'landlord' ? '8' : '15'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.role === 'tenant' ? 'Bookmarks' : user.role === 'landlord' ? 'Sold Properties' : 'Completed Projects'}
                    </div>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-black mb-2">4.8</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);
};

export default Profile;