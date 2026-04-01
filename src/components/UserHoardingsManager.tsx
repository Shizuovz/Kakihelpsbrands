import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiImageManager } from '@/components/MultiImageManager';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { type Hoarding } from '@/data/hoardings';
import { useAuth } from '@/contexts/AuthContext';
import { formatINR } from '@/utils/currency';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  MapPin, 
  Maximize2, 
  DollarSign,
  Calendar,
  Users,
  Settings,
  Image as ImageIcon
} from 'lucide-react';

interface UserHoardingsManagerProps {
  hoardings: Hoarding[];
  onHoardingsUpdate: (hoardings: Hoarding[]) => void;
  isLoading: boolean;
}

export const UserHoardingsManager = ({ hoardings, onHoardingsUpdate, isLoading }: UserHoardingsManagerProps) => {
  const { user } = useAuth();
  const [editingHoarding, setEditingHoarding] = useState<Hoarding | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Hoarding>>({});
  const [availabilityData, setAvailabilityData] = useState<Array<{date: string, status: 'available' | 'limited' | 'booked'}>>([]);

  const handleCreateNew = () => {
    const newHoarding: Partial<Hoarding> = {
      title: '',
      location: '',
      region: 'Dimapur',
      price: 0,
      dimensions: '',
      type: 'Digital',
      status: 'Available',
      impressions: '',
      imageUrl: '',
      images: [],
      totalSqft: 0,
      printingCharges: 0,
      mountingCharges: 0,
      totalCharges: 0,
      ownerId: user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setEditingHoarding(newHoarding as Hoarding);
    setFormData(newHoarding);
    setIsCreatingNew(true);
    setAvailabilityData([]);
  };

  const handleEdit = async (hoarding: Hoarding) => {
    setEditingHoarding({ ...hoarding });
    setFormData({ ...hoarding });
    setIsCreatingNew(false);
    
    try {
      if (hoarding.id) {
        const response = await fetch(`http://localhost:3001/api/hoardings/${hoarding.id}/availability`);
        if (response.ok) {
          const result = await response.json();
          setAvailabilityData(result.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.location) {
      alert('Please fill in at least the title and location.');
      return;
    }

    setIsSaving(true);
    try {
      // Ensure the primary imageUrl is the first image in the gallery if available
      const finalImages = formData.images || [];
      const primaryImage = finalImages.length > 0 ? finalImages[0] : (formData.imageUrl || '');

      const updatedHoarding = {
        ...editingHoarding,
        ...formData,
        imageUrl: primaryImage,
        images: finalImages,
        totalCharges: (formData.price || 0) + (formData.printingCharges || 0) + (formData.mountingCharges || 0),
        ownerId: user?.id
      };

      const url = isCreatingNew 
        ? 'http://localhost:3001/api/user/hoardings' 
        : `http://localhost:3001/api/user/hoardings/${updatedHoarding.id}`;
      
      const method = isCreatingNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedHoarding),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (isCreatingNew) {
          onHoardingsUpdate([...hoardings, result.data]);
        } else {
          onHoardingsUpdate(hoardings.map(h => h.id === result.data.id ? result.data : h));
        }

        // Save availability data
        if (result.data.id && availabilityData.length >= 0) {
          await fetch(`http://localhost:3001/api/hoardings/${result.data.id}/availability`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ availability: availabilityData }),
          });
        }

        alert(isCreatingNew ? 'Created successfully!' : 'Updated successfully!');
        handleCancel();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (hoardingId: string) => {
    if (!confirm('Are you sure you want to delete this hoarding?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/user/hoardings/${hoardingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        onHoardingsUpdate(hoardings.filter(h => h.id !== hoardingId));
        alert('Deleted successfully');
      }
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleCancel = () => {
    setEditingHoarding(null);
    setFormData({});
    setIsCreatingNew(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (editingHoarding) {
    return (
      <Card className="bg-kaki-dark-grey border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">
              {isCreatingNew ? 'Create New Hoarding' : 'Edit Hoarding'}
            </CardTitle>
            <CardDescription className="text-kaki-grey">
              Fill in the details for your advertising space
            </CardDescription>
          </div>
          <Button variant="ghost" onClick={handleCancel} className="text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Basic Information
                </h3>
                
                <div className="space-y-2">
                  <Label className="text-white">Title</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Location</Label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Region</Label>
                    <Select value={formData.region || 'Dimapur'} onValueChange={(v) => handleInputChange('region', v)}>
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-kaki-dark-grey border-white/10">
                        <SelectItem value="Dimapur">Dimapur</SelectItem>
                        <SelectItem value="Kohima">Kohima</SelectItem>
                        <SelectItem value="Mokokchung">Mokokchung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Type</Label>
                    <Select value={formData.type || 'Hoarding'} onValueChange={(v) => handleInputChange('type', v)}>
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-kaki-dark-grey border-white/10">
                        <SelectItem value="Hoarding">Hoarding</SelectItem>
                        <SelectItem value="Unipole">Unipole</SelectItem>
                        <SelectItem value="Digital">Digital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-blue-400" />
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Dimensions</Label>
                    <Input value={formData.dimensions || ''} onChange={(e) => handleInputChange('dimensions', e.target.value)} className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Sq. Feet</Label>
                    <Input type="number" value={formData.totalSqft || 0} onChange={(e) => handleInputChange('totalSqft', parseInt(e.target.value))} className="bg-black/40 border-white/10 text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Impressions</Label>
                    <Input value={formData.impressions || ''} onChange={(e) => handleInputChange('impressions', e.target.value)} placeholder="e.g. 1.2M/Month" className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Visibility</Label>
                    <Input value={formData.visibility || ''} onChange={(e) => handleInputChange('visibility', e.target.value)} placeholder="e.g. High Traffic" className="bg-black/40 border-white/10 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Images */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Monthly Rent</Label>
                    <Input type="number" value={formData.price || 0} onChange={(e) => handleInputChange('price', parseInt(e.target.value))} className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Status</Label>
                    <Select value={formData.status || 'Available'} onValueChange={(v) => handleInputChange('status', v)}>
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-kaki-dark-grey border-white/10">
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Booked">Booked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Printing Charges</Label>
                    <Input type="number" value={formData.printingCharges || 0} onChange={(e) => handleInputChange('printingCharges', parseInt(e.target.value))} className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Mounting Charges</Label>
                    <Input type="number" value={formData.mountingCharges || 0} onChange={(e) => handleInputChange('mountingCharges', parseInt(e.target.value))} className="bg-black/40 border-white/10 text-white" />
                  </div>
                </div>

                <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-kaki-grey">Total Current Investment:</span>
                    <span className="text-purple-400 font-bold">{formatINR((formData.price || 0) + (formData.printingCharges || 0) + (formData.mountingCharges || 0))}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-pink-400" />
                  Images
                </h3>
                <MultiImageManager
                  images={formData.images || []}
                  onImagesChange={(images) => handleInputChange('images', images)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
            <Button variant="outline" onClick={handleCancel} className="text-white border-white/10">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 min-w-[120px]">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Hoarding'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Hoardings</h2>
          <p className="text-kaki-grey">Manage your advertising portfolio</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hoardings.map((h) => (
          <Card key={h.id} className="bg-white/5 border-white/10 overflow-hidden group hover:border-green-500/50 transition-all">
            <div className="relative h-48">
              <img 
                src={h.imageUrl || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80'} 
                alt={h.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <Badge className={`absolute top-2 right-2 ${h.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}>
                {h.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{h.title}</h3>
              <div className="space-y-2 text-sm text-kaki-grey mb-4">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {h.location}</p>
                <p className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> {formatINR(h.price)}/mo</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(h)} className="flex-1 bg-white/5 border-white/10 text-white">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button size="sm" onClick={() => handleDelete(h.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserHoardingsManager;
