import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Building, Edit2, Save, X } from 'lucide-react';
import { authAPI } from '@/data/auth';
import { toast } from 'sonner';

interface UserProfileProps {
  user: any;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    role: user.role,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token found');

      const updatedUser = await authAPI.updateProfile(token, formData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      role: user.role,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-kaki-dark-grey border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-kaki-grey">
                Manage your account details and preferences
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className="text-white hover:bg-white/10"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-kaki-grey" />
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 bg-black/40 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-kaki-grey" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-black/40 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-kaki-grey" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 bg-black/40 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-kaki-grey" />
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="pl-10 bg-black/40 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Account Type</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: 'organizer' | 'provider') => 
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger className="bg-black/40 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-kaki-dark-grey border-white/10">
                      <SelectItem value="organizer" className="text-white hover:bg-purple-600">
                        Event Organizer
                      </SelectItem>
                      <SelectItem value="provider" className="text-white hover:bg-purple-600">
                        Service Provider
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-kaki-grey text-sm">Full Name</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-white">{user.name}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-kaki-grey text-sm">Email Address</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <span className="text-white">{user.email}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-kaki-grey text-sm">Phone Number</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <span className="text-white">{user.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-kaki-grey text-sm">Company Name</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Building className="w-4 h-4 text-purple-400" />
                    <span className="text-white">{user.company}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-kaki-grey text-sm">Account Type</Label>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-500/30 text-purple-400 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-kaki-grey text-sm">Member Since</Label>
                  <div className="mt-1">
                    <span className="text-white">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="bg-kaki-dark-grey border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
          <CardDescription className="text-kaki-grey">
            Manage your account preferences and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Change Password
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Notification Settings
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Privacy Settings
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Info */}
      <Card className="bg-kaki-dark-grey border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Subscription Plan</CardTitle>
          <CardDescription className="text-kaki-grey">
            Current plan and usage limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white font-medium">Free Plan</h4>
              <p className="text-kaki-grey text-sm">Up to 10 hoardings</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 border border-green-500/30 text-green-400">
              Active
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-kaki-grey">Hoardings Used</span>
              <span className="text-white">5 / 10</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
            Upgrade to Pro Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
