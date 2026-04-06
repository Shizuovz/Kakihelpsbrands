import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { useNavigate } from 'react-router-dom';
import { resolveApiUrl } from '@/utils/resolveApiUrl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Save, 
  Layout, 
  Image as ImageIcon, 
  Users, 
  Share2, 
  Plus, 
  Trash2, 
  Video, 
  Globe,
  Settings,
  ArrowLeft,
  UploadCloud,
  Briefcase,
  Upload,
  Linkedin,
  Instagram,
  Mail,
  Clock,
  Youtube
} from 'lucide-react';

export const AdminContent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [content, setContent] = useState<any>({
    hero: { title: '', subtitle: '', videoUrl: '', posterUrl: '' },
    departments: [],
    stats: [],
    socialLinks: [],
    recentWorks: [],
    works: {
      hero: { title: '', subtitle: '' },
      projects: []
    }
  });

  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    
    if (!token || !userStr) {
      toast.error('Administrative access required');
      navigate('/admin/login');
      return;
    }
    
    setAdminUser(JSON.parse(userStr));

    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/all`);
        if (response.ok) {
          const result = await response.json();
          // Merge initial structure with fetched data to ensure all keys like 'works' exist
          setContent((prev: any) => ({
            ...prev,
            ...result.data,
            works: {
              ...prev.works,
              ...(result.data.works || {})
            }
          }));
        }
      } catch (error) {
        toast.error('Failed to load content');
      }
    };

    const fetchInquiries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/inquiries`);
        if (response.ok) {
          const result = await response.json();
          setInquiries(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load inquiries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
    fetchInquiries();
  }, [navigate]);



  const updateWorkProject = (index: number, field: string, value: any) => {
    const newProjects = [...content.works.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setContent({ ...content, works: { ...content.works, projects: newProjects } });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/content/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        toast.success('Website content updated successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updateHero = (field: string, value: string) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const handleFileUpload = (onSuccess: (url: string) => void, type: 'image' | 'video' = 'image') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          // The admin upload endpoint returns { success: true, files: [{ url: '...' }] }
          const url = data.files && data.files.length > 0 ? data.files[0].url : data.url;
          onSuccess(url);
          toast.success('File uploaded successfully!');
        } else {
          toast.error(data.message || 'Failed to upload file');
        }
      } catch (error: any) {
        toast.error(error.message || 'Error uploading file');
      }
    };
    input.click();
  };

  const updateStateDeep = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const newObj = { ...obj };
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  const addItem = (sectionPath: string, defaultItem: any) => {
    const keys = sectionPath.split('.');
    let current = content;
    for (const key of keys) {
      if (!current[key]) current[key] = []; // initialize if missing
      current = current[key];
    }
    const newArray = [...current, defaultItem];
    setContent(updateStateDeep(content, sectionPath, newArray));
  };

  const removeItem = (sectionPath: string, index: number) => {
    const keys = sectionPath.split('.');
    let current = content;
    for (const key of keys) {
      current = current[key];
    }
    const newArray = [...current];
    newArray.splice(index, 1);
    setContent(updateStateDeep(content, sectionPath, newArray));
  };


  const updateItem = (sectionPath: string, index: number, field: string, value: string) => {
    const keys = sectionPath.split('.');
    let current = content;
    for (const key of keys) {
      current = current[key];
    }
    const newArray = [...current];
    newArray[index] = { ...newArray[index], [field]: value };
    setContent(updateStateDeep(content, sectionPath, newArray));
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setInquiries(prev => prev.filter(item => (item.id || item._id) !== id));
        toast.success('Inquiry deleted');
      }
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleMarkAsRead = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' || currentStatus === 'new' ? 'read' : 'unread';
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setInquiries(prev => prev.map(item => 
          (item.id || item._id) === id ? { ...item, status: newStatus } : item
        ));
        toast.success(`Inquiry marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaki-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
      <div className="container-custom">
        <div className="sticky top-0 z-50 bg-kaki-black/90 backdrop-blur-md border-b border-white/5 pt-32 pb-4 -mt-32 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-kaki-grey hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-purple-500" />
                Website CMS
              </h1>
              <p className="text-kaki-grey">Logged in as: <span className="text-purple-400 font-medium">{adminUser?.name || 'Admin'}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
                variant="outline"
                onClick={() => {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    navigate('/admin/login');
                }}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
                Log Out
            </Button>
            <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]"
            >
                {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
            <TabsTrigger value="hero" className="data-[state=active]:bg-purple-600">
              <Layout className="w-4 h-4 mr-2" /> Hero Section
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" /> About Us
            </TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-purple-600">
              <Globe className="w-4 h-4 mr-2" /> Departments
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600">
              <Plus className="w-4 h-4 mr-2" /> Stats
            </TabsTrigger>
            <TabsTrigger value="recent-works" className="data-[state=active]:bg-purple-600">
              <ImageIcon className="w-4 h-4 mr-2" /> Recent Works
            </TabsTrigger>
            <TabsTrigger value="works" className="data-[state=active]:bg-purple-600">
              <Briefcase className="w-4 h-4 mr-2" /> Our Works Page
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-purple-600">
              <Share2 className="w-4 h-4 mr-2" /> Social Links
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" /> Kaki Team Full
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-purple-600">
              <Mail className="w-4 h-4 mr-2" /> Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription className="text-kaki-grey">Main landing section of the homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main Title</label>
                  <Input 
                    value={content.hero.title} 
                    onChange={(e) => updateHero('title', e.target.value)}
                    className="bg-kaki-black border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sub-title</label>
                  <Textarea 
                    value={content.hero.subtitle} 
                    onChange={(e) => updateHero('subtitle', e.target.value)}
                    className="bg-kaki-black border-white/10 h-24"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Video className="w-4 h-4" /> Video URL
                    </label>
                    <div className="flex gap-2">
                        <Input 
                          value={content.hero.videoUrl} 
                          onChange={(e) => updateHero('videoUrl', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                        <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => updateHero('videoUrl', url), 'video')}>
                            <UploadCloud className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Poster Image URL
                    </label>
                    <div className="flex gap-2">
                        <Input 
                          value={content.hero.posterUrl} 
                          onChange={(e) => updateHero('posterUrl', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                        <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => updateHero('posterUrl', url), 'image')}>
                            <UploadCloud className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <div className="space-y-6">
              {content.departments.map((dept: any, index: number) => (
                <Card key={index} className="bg-white/5 border-white/10 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">Department: {dept.name}</CardTitle>
                    <Button variant="destructive" size="sm" onClick={() => removeItem('departments', index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Name</label>
                        <Input 
                          value={dept.name} 
                          onChange={(e) => updateItem('departments', index, 'name', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Icon (Video, Instagram, Code, 🎨)</label>
                        <Input 
                          value={dept.icon} 
                          onChange={(e) => updateItem('departments', index, 'icon', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-kaki-grey">Description</label>
                      <Input 
                        value={dept.description} 
                        onChange={(e) => updateItem('departments', index, 'description', e.target.value)}
                        className="bg-kaki-black border-white/10"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Stats Label</label>
                        <Input 
                          value={dept.stats} 
                          onChange={(e) => updateItem('departments', index, 'stats', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Path</label>
                        <Input 
                          value={dept.path} 
                          onChange={(e) => updateItem('departments', index, 'path', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Gradient (Tailwind classes)</label>
                        <Input 
                          value={dept.gradient} 
                          onChange={(e) => updateItem('departments', index, 'gradient', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="outline" 
                onClick={() => addItem('departments', { name: '', description: '', icon: 'Video', stats: '', path: '', gradient: '', color: '' })}
                className="w-full border-dashed border-white/20 py-8 hover:bg-white/5"
              >
                <Plus className="w-5 h-5 mr-2" /> Add New Department
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Impact Stats</CardTitle>
                <CardDescription className="text-kaki-grey">Numerical achievements section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.stats.map((stat: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-kaki-grey">Number (e.g. 50+)</label>
                      <Input 
                        value={stat.number} 
                        onChange={(e) => updateItem('stats', index, 'number', e.target.value)}
                        className="bg-kaki-black border-white/10"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-kaki-grey">Label</label>
                      <Input 
                        value={stat.label} 
                        onChange={(e) => updateItem('stats', index, 'label', e.target.value)}
                        className="bg-kaki-black border-white/10"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-kaki-grey">Color Class</label>
                      <Input 
                        value={stat.color} 
                        onChange={(e) => updateItem('stats', index, 'color', e.target.value)}
                        className="bg-kaki-black border-white/10"
                      />
                    </div>
                    <Button variant="destructive" className="mt-6" onClick={() => removeItem('stats', index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addItem('stats', { number: '', label: '', color: '' })} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" /> Add Stat
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-works">
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Recent Works (Home Page)</h3>
                    <p className="text-kaki-grey text-sm">Manage the small "Recent Works" section on the home page</p>
                </div>
                <Button onClick={() => addItem('recentWorks', { title: 'New Work', category: 'Studio', description: '', image: '', gradient: 'from-purple-500 to-blue-600' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Recent Work
                </Button>
              </div>
              
              {content.recentWorks.map((work: any, index: number) => (
                <Card key={index} className="bg-white/5 border-white/10 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">Work: {work.title}</CardTitle>
                    <Button variant="destructive" size="sm" onClick={() => removeItem('recentWorks', index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Title</label>
                        <Input 
                          value={work.title} 
                          onChange={(e) => updateItem('recentWorks', index, 'title', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Category</label>
                        <Input 
                          value={work.category} 
                          onChange={(e) => updateItem('recentWorks', index, 'category', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-kaki-grey">Image URL</label>
                      <div className="flex gap-2">
                          <Input 
                            value={work.image} 
                            onChange={(e) => updateItem('recentWorks', index, 'image', e.target.value)}
                            className="bg-kaki-black border-white/10"
                          />
                          <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => updateItem('recentWorks', index, 'image', url), 'image')}>
                              <UploadCloud className="w-4 h-4" />
                          </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-kaki-grey">Description</label>
                      <Textarea 
                        value={work.description} 
                        onChange={(e) => updateItem('recentWorks', index, 'description', e.target.value)}
                        className="bg-kaki-black border-white/10 h-20"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="outline" 
                onClick={() => addItem('recentWorks', { title: '', category: '', description: '', image: '', gradient: '' })}
                className="w-full border-dashed border-white/20 py-8 hover:bg-white/5"
              >
                <Plus className="w-5 h-5 mr-2" /> Add New Work
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription className="text-kaki-grey">Links displayed in hero and footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.socialLinks.map((social: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0">
                    <div className="flex-initial w-32 space-y-2">
                      <label className="text-xs text-kaki-grey">Icon (Name)</label>
                      <Input 
                        value={social.icon} 
                        onChange={(e) => updateItem('socialLinks', index, 'icon', e.target.value)}
                        className="bg-kaki-black border-white/10"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-kaki-grey">URL</label>
                      <Input 
                        value={social.url} 
                        onChange={(e) => updateItem('socialLinks', index, 'url', e.target.value)}
                        className="bg-kaki-black border-white/10"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-kaki-grey">Label</label>
                      <Input 
                        value={social.label} 
                        onChange={(e) => updateItem('socialLinks', index, 'label', e.target.value)}
                        className="bg-kaki-black border-white/10"
                      />
                    </div>
                    <Button variant="destructive" className="mt-6" onClick={() => removeItem('socialLinks', index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addItem('socialLinks', { icon: 'Instagram', url: '', label: '' })} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" /> Add Link
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    YouTube Global Integration
                </CardTitle>
                <CardDescription className="text-kaki-grey">Permanently connect your YouTube channel to the Life at Kaki page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">YouTube API Key</label>
                        <Input 
                            value={content.lifeAtKaki?.youtube?.apiKey || ''} 
                            onChange={(e) => setContent(updateStateDeep(content, 'lifeAtKaki.youtube.apiKey', e.target.value))}
                            className="bg-kaki-black border-white/10"
                            type="password"
                            placeholder="AIza..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Channel Handle/ID</label>
                        <Input 
                            value={content.lifeAtKaki?.youtube?.channelId || ''} 
                            onChange={(e) => setContent(updateStateDeep(content, 'lifeAtKaki.youtube.channelId', e.target.value))}
                            className="bg-kaki-black border-white/10"
                            placeholder="@username"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-kaki-grey">Target Playlist ID (Optional)</label>
                    <Input 
                        value={content.lifeAtKaki?.youtube?.playlistId || ''} 
                        onChange={(e) => setContent(updateStateDeep(content, 'lifeAtKaki.youtube.playlistId', e.target.value))}
                        className="bg-kaki-black border-white/10"
                        placeholder="PL..."
                    />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        <TabsContent value="works" className="space-y-6">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Our Works Page Headers</CardTitle>
              <CardDescription className="text-kaki-grey">Main header section of the 'Our Works' page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Title</label>
                <Input 
                  value={content.works?.hero?.title || ''} 
                  onChange={(e) => setContent({ ...content, works: { ...content.works, hero: { ...content.works.hero, title: e.target.value } } })}
                  className="bg-kaki-black border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Subtitle</label>
                <Textarea 
                  value={content.works?.hero?.subtitle || ''} 
                  onChange={(e) => setContent({ ...content, works: { ...content.works, hero: { ...content.works.hero, subtitle: e.target.value } } })}
                  className="bg-kaki-black border-white/10 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>All Projects</CardTitle>
                <CardDescription className="text-kaki-grey">Manage portfolio items on the works page</CardDescription>
              </div>
              <Button onClick={() => addItem('works.projects', { id: Date.now(), title: 'New Project', category: 'Studio', description: '', year: new Date().getFullYear().toString(), client: '' })}>
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(content.works?.projects || []).map((project: any, index: number) => (
                  <div key={project.id || index} className="p-4 border border-white/10 rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg">Project #{index + 1}: {project.title}</h4>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => removeItem('works.projects', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Project Title</label>
                        <Input 
                          value={project.title} 
                          onChange={(e) => updateItem('works.projects', index, 'title', e.target.value)}
                          className="bg-kaki-black border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-kaki-grey">Department</label>
                        <select 
                          value={project.category} 
                          onChange={(e) => updateItem('works.projects', index, 'category', e.target.value)}
                          className="w-full bg-kaki-black border border-white/10 rounded-md p-2 text-white outline-none focus:border-purple-500 transition-colors"
                        >
                          <option value="Studio">Studio</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Design">Design</option>
                          <option value="Tech">Tech</option>
                          <option value="Case Study">Case Study</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-kaki-grey">Project Description</label>
                      <Textarea 
                        value={project.description} 
                        onChange={(e) => updateItem('works.projects', index, 'description', e.target.value)}
                        className="bg-kaki-black border-white/10 h-24"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-kaki-grey">Image</label>
                            <div className="flex gap-2">
                                <Input 
                                    value={project.image || ''} 
                                    onChange={(e) => updateItem('works.projects', index, 'image', e.target.value)}
                                    className="bg-kaki-black border-white/10"
                                />
                                <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => updateItem('works.projects', index, 'image', url), 'image')}>
                                    <UploadCloud className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-kaki-grey">Video (Optional)</label>
                            <div className="flex gap-2">
                                <Input 
                                    value={project.video || ''} 
                                    onChange={(e) => updateItem('works.projects', index, 'video', e.target.value)}
                                    className="bg-kaki-black border-white/10"
                                    placeholder="/uploads/video.mp4"
                                />
                                <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => updateItem('works.projects', index, 'video', url), 'video')}>
                                    <UploadCloud className="w-4 h-4" />
                                </Button>
                            </div>
                            {project.video && (
                              <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-white/10">
                                <video 
                                  src={resolveApiUrl(project.video)} 
                                  className="w-full h-full object-cover"
                                  controls
                                  muted
                                />
                              </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-kaki-grey">External Link (Tech Only)</label>
                            <Input 
                                value={project.link || ''} 
                                onChange={(e) => updateItem('works.projects', index, 'link', e.target.value)}
                                className="bg-kaki-black border-white/10"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-kaki-grey">Project Year</label>
                            <Input 
                                value={project.year} 
                                onChange={(e) => updateItem('works.projects', index, 'year', e.target.value)}
                                className="bg-kaki-black border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-kaki-grey">Client Name</label>
                            <Input 
                                value={project.client} 
                                onChange={(e) => updateItem('works.projects', index, 'client', e.target.value)}
                                className="bg-kaki-black border-white/10"
                            />
                        </div>
                    </div>
                  </div>
                ))}

                {/* Redundant Actions at Bottom */}
                <div className="mt-8 flex items-center justify-between p-6 bg-purple-500/10 border border-purple-500/20 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={() => addItem('works.projects', { id: Date.now(), title: 'New Project', category: 'Studio', description: '', year: new Date().getFullYear().toString(), client: '' })}
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Another Project
                        </Button>
                        <p className="text-sm text-kaki-grey">Total Projects: {(content.works?.projects || []).length}</p>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                    >
                        {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save All Work</>}
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>About Us Hero</CardTitle>
              <CardDescription className="text-kaki-grey">Hero section text for the About Us page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey uppercase tracking-wider">Main Title</label>
                <Input 
                  value={content.about?.hero?.title || ''} 
                  onChange={(e) => setContent({ ...content, about: { ...content.about, hero: { ...content.about.hero, title: e.target.value } } })}
                  className="bg-kaki-black border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey uppercase tracking-wider">Subtitle</label>
                <Textarea 
                  value={content.about?.hero?.subtitle || ''} 
                  onChange={(e) => setContent({ ...content, about: { ...content.about, hero: { ...content.about.hero, subtitle: e.target.value } } })}
                  className="bg-kaki-black border-white/10 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Section Headers & CTA</CardTitle>
              <CardDescription>Main titles and descriptions for sub-sections</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-kaki-black rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-purple-400">Journey Section</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Title</label>
                  <Input value={content.about?.journeyTitle} onChange={(e) => setContent({ ...content, about: { ...content.about, journeyTitle: e.target.value } })} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Subtitle</label>
                  <Textarea value={content.about?.journeySubtitle} onChange={(e) => setContent({ ...content, about: { ...content.about, journeySubtitle: e.target.value } })} className="bg-white/5 border-white/10 h-20 text-xs" />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-kaki-black rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-purple-400">Team Section</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Title</label>
                  <Input value={content.about?.teamTitle} onChange={(e) => setContent({ ...content, about: { ...content.about, teamTitle: e.target.value } })} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Subtitle</label>
                  <Textarea value={content.about?.teamSubtitle} onChange={(e) => setContent({ ...content, about: { ...content.about, teamSubtitle: e.target.value } })} className="bg-white/5 border-white/10 h-20 text-xs" />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-kaki-black rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-purple-400">Values Section</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Title</label>
                  <Input value={content.about?.valuesTitle} onChange={(e) => setContent({ ...content, about: { ...content.about, valuesTitle: e.target.value } })} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Subtitle</label>
                  <Textarea value={content.about?.valuesSubtitle} onChange={(e) => setContent({ ...content, about: { ...content.about, valuesSubtitle: e.target.value } })} className="bg-white/5 border-white/10 h-20 text-xs" />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-kaki-black rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-purple-400">Bottom CTA Section</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Title</label>
                  <Input value={content.about?.ctaTitle} onChange={(e) => setContent({ ...content, about: { ...content.about, ctaTitle: e.target.value } })} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-kaki-grey uppercase">Subtitle</label>
                  <Textarea value={content.about?.ctaSubtitle} onChange={(e) => setContent({ ...content, about: { ...content.about, ctaSubtitle: e.target.value } })} className="bg-white/5 border-white/10 h-20 text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Introduction (Who We Are)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey">Section Title</label>
                <Input 
                  value={content.about?.intro?.title || ''} 
                  onChange={(e) => setContent({ ...content, about: { ...content.about, intro: { ...content.about.intro, title: e.target.value } } })}
                  className="bg-kaki-black border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey">Description</label>
                <Textarea 
                  value={content.about?.intro?.description || ''} 
                  onChange={(e) => setContent({ ...content, about: { ...content.about, intro: { ...content.about.intro, description: e.target.value } } })}
                  className="bg-kaki-black border-white/10 min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey">Sub-description</label>
                <Textarea 
                  value={content.about?.intro?.subDescription || ''} 
                  onChange={(e) => setContent({ ...content, about: { ...content.about, intro: { ...content.about.intro, subDescription: e.target.value } } })}
                  className="bg-kaki-black border-white/10 h-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey uppercase tracking-wider text-purple-400">Section Image</label>
                <div className="flex gap-2">
                  <Input 
                    value={content.about?.intro?.image || ''} 
                    onChange={(e) => setContent({ ...content, about: { ...content.about, intro: { ...content.about.intro, image: e.target.value } } })}
                    className="bg-kaki-black border-white/10"
                  />
                  <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => setContent({ ...content, about: { ...content.about, intro: { ...content.about.intro, image: url } } }))}>
                    <UploadCloud className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Mission & Purpose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey">Mission Title</label>
                <Input 
                  value={content.about?.mission?.title || ''} 
                  onChange={(e) => setContent({ ...content, about: { ...content.about, mission: { ...content.about.mission, title: e.target.value } } })}
                  className="bg-kaki-black border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey">Mission Description</label>
                <Textarea 
                  value={content.about?.mission?.description || ''} 
                  onChange={(e) => setContent({ ...content, about: { ...content.about, mission: { ...content.about.mission, description: e.target.value } } })}
                  className="bg-kaki-black border-white/10 min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-kaki-grey uppercase tracking-wider text-purple-400">Mission Image</label>
                <div className="flex gap-2">
                  <Input 
                    value={content.about?.mission?.image || ''} 
                    onChange={(e) => setContent({ ...content, about: { ...content.about, mission: { ...content.about.mission, image: e.target.value } } })}
                    className="bg-kaki-black border-white/10"
                  />
                  <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => setContent({ ...content, about: { ...content.about, mission: { ...content.about.mission, image: url } } }))}>
                    <UploadCloud className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Our Journey (Timeline)</CardTitle>
                <CardDescription>Major milestones in KAKI history</CardDescription>
              </div>
              <Button onClick={() => addItem('about.timeline', { year: '2025', title: 'New Milestone', description: '', highlight: '' })} size="sm" className="bg-purple-600 font-inter">
                <Plus className="w-4 h-4 mr-1" /> Add Year
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.about?.timeline?.map((item: any, index: number) => (
                <div key={index} className="p-4 bg-kaki-black rounded-xl border border-white/5 space-y-3 relative group">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem('about.timeline', index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-kaki-grey uppercase">Year</label>
                      <Input value={item.year} onChange={(e) => updateItem('about.timeline', index, 'year', e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-kaki-grey uppercase">Highlight (Badge)</label>
                      <Input value={item.highlight} onChange={(e) => updateItem('about.timeline', index, 'highlight', e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-kaki-grey uppercase">Title</label>
                    <Input value={item.title} onChange={(e) => updateItem('about.timeline', index, 'title', e.target.value)} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-kaki-grey uppercase">Description</label>
                    <Textarea value={item.description} onChange={(e) => updateItem('about.timeline', index, 'description', e.target.value)} className="bg-white/5 border-white/10 h-20" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meet Our Team</CardTitle>
                <CardDescription>Profiles of the creative minds at KAKI</CardDescription>
              </div>
              <Button onClick={() => addItem('about.team', { name: 'Member Name', role: '', description: '', specialization: '', image: '' })} size="sm" className="bg-purple-600 font-inter">
                <Plus className="w-4 h-4 mr-1" /> Add Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.about?.team?.map((member: any, index: number) => (
                <div key={index} className="p-4 bg-kaki-black rounded-2xl border border-white/5 space-y-4 relative group">
                   <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem('about.team', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-kaki-grey">Name</label>
                      <Input value={member.name} onChange={(e) => updateItem('about.team', index, 'name', e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-kaki-grey">Role</label>
                      <Input value={member.role} onChange={(e) => updateItem('about.team', index, 'role', e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-kaki-grey">Specialization</label>
                    <Input value={member.specialization} onChange={(e) => updateItem('about.team', index, 'specialization', e.target.value)} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-kaki-grey">Description</label>
                    <Textarea value={member.description} onChange={(e) => updateItem('about.team', index, 'description', e.target.value)} className="bg-white/5 border-white/10 h-20" />
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs text-kaki-grey uppercase tracking-wider text-purple-400">Profile Photo</label>
                      <div className="flex gap-2">
                        <Input value={member.image} onChange={(e) => updateItem('about.team', index, 'image', e.target.value)} className="bg-white/5 border-white/10" />
                        <Button size="icon" variant="secondary" onClick={() => handleFileUpload((url) => updateItem('about.team', index, 'image', url), 'image')}>
                          <UploadCloud className="w-4 h-4" />
                        </Button>
                      </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Our Values</CardTitle>
                <CardDescription>Core principles guiding KAKI</CardDescription>
              </div>
              <Button onClick={() => addItem('about.values', { title: 'New Value', description: '', icon: '✨', color: 'from-purple-500 to-pink-500' })} size="sm" className="bg-purple-600 font-inter">
                <Plus className="w-4 h-4 mr-1" /> Add Value
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.about?.values?.map((value: any, index: number) => (
                <div key={index} className={`p-5 bg-gradient-to-br ${value.color} rounded-3xl space-y-3 relative group text-white`}>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                    onClick={() => removeItem('about.values', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <Input value={value.icon} onChange={(e) => updateItem('about.values', index, 'icon', e.target.value)} className="w-12 bg-white/20 border-white/20 text-center text-xl p-0" />
                    <Input value={value.title} onChange={(e) => updateItem('about.values', index, 'title', e.target.value)} className="bg-white/20 border-white/20 font-bold" />
                  </div>
                  <Textarea value={value.description} onChange={(e) => updateItem('about.values', index, 'description', e.target.value)} className="bg-white/10 border-white/10 h-24 placeholder:text-white/50" placeholder="Describe this value..." />
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase opacity-70">Gradient Class</label>
                    <Input value={value.color} onChange={(e) => updateItem('about.values', index, 'color', e.target.value)} className="bg-white/10 border-white/10 text-xs h-7" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Team Page Hero</CardTitle>
                <CardDescription>Main header for the full team roster page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hero Title</label>
                    <Input 
                      value={content.teamPage?.hero?.title || ''} 
                      onChange={(e) => setContent(updateStateDeep(content, 'teamPage.hero.title', e.target.value))}
                      className="bg-white/10 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hero Subtitle</label>
                    <Textarea 
                      value={content.teamPage?.hero?.subtitle || ''} 
                      onChange={(e) => setContent(updateStateDeep(content, 'teamPage.hero.subtitle', e.target.value))}
                      className="bg-white/10 border-white/10 h-20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Professional Stats</CardTitle>
                <CardDescription>Numbers highlighted on the team page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(content.teamPage?.stats || []).map((stat: any, index: number) => (
                    <div key={index} className="p-4 bg-white/5 rounded-2xl space-y-2">
                      <Input 
                        value={stat.number} 
                        onChange={(e) => updateItem('teamPage.stats', index, 'number', e.target.value)}
                        className="bg-purple-900/20 border-white/10 font-bold"
                        placeholder="Number (e.g. 45+)"
                      />
                      <Input 
                        value={stat.label} 
                        onChange={(e) => updateItem('teamPage.stats', index, 'label', e.target.value)}
                        className="bg-white/10 border-white/10 text-xs"
                        placeholder="Label"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Departments & Members</CardTitle>
                <CardDescription>Manage your team roster by department</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="leadership" className="w-full">
                  <TabsList className="bg-white/5 border-white/10 mb-6">
                    {Object.keys(content.teamPage?.departments || {}).map((dept) => (
                      <TabsTrigger key={dept} value={dept} className="capitalize">{dept}</TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(content.teamPage?.departments || {}).map(([dept, members]: [string, any]) => (
                    <TabsContent key={dept} value={dept} className="space-y-4">
                      <div className="flex justify-end mb-4">
                        <Button 
                          onClick={() => addItem(`teamPage.departments.${dept}`, { name: 'New Member', role: 'Role', image: '', social: { linkedin: '', instagram: '', email: '' } })} 
                          size="sm"
                          className="bg-purple-600"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add to {dept}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member: any, index: number) => (
                          <div key={index} className="p-5 bg-white/5 border border-white/10 rounded-3xl relative group space-y-4">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
                              onClick={() => removeItem(`teamPage.departments.${dept}`, index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden relative group/img">
                                <img src={member.image} className="w-full h-full object-cover" />
                                <button 
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  onClick={() => handleFileUpload((url) => updateItem(`teamPage.departments.${dept}`, index, 'image', url), 'image')}
                                >
                                  <Upload className="w-4 h-4 text-white" />
                                </button>
                              </div>
                              <div className="flex-1 space-y-2">
                                <Input 
                                  value={member.name} 
                                  onChange={(e) => updateItem(`teamPage.departments.${dept}`, index, 'name', e.target.value)}
                                  className="bg-white/10 border-white/10 font-bold h-8"
                                  placeholder="Full Name"
                                />
                                <Input 
                                  value={member.role} 
                                  onChange={(e) => updateItem(`teamPage.departments.${dept}`, index, 'role', e.target.value)}
                                  className="bg-white/10 border-white/10 text-xs h-7 text-purple-300"
                                  placeholder="Role"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2 bg-black/20 p-3 rounded-2xl">
                              <label className="text-[10px] uppercase opacity-50 block">Social Links</label>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Linkedin className="w-3 h-3 opacity-50" />
                                  <Input 
                                    value={member.social?.linkedin || ''} 
                                    onChange={(e) => {
                                      const newSocial = { ...member.social, linkedin: e.target.value };
                                      updateItem(`teamPage.departments.${dept}`, index, 'social', newSocial as any);
                                    }}
                                    className="bg-white/5 border-white/5 h-7 text-[10px]"
                                    placeholder="LinkedIn URL"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Instagram className="w-3 h-3 opacity-50" />
                                  <Input 
                                    value={member.social?.instagram || ''} 
                                    onChange={(e) => {
                                      const newSocial = { ...member.social, instagram: e.target.value };
                                      updateItem(`teamPage.departments.${dept}`, index, 'social', newSocial as any);
                                    }}
                                    className="bg-white/5 border-white/5 h-7 text-[10px]"
                                    placeholder="Instagram URL"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3 opacity-50" />
                                  <Input 
                                    value={member.social?.email || ''} 
                                    onChange={(e) => {
                                      const newSocial = { ...member.social, email: e.target.value };
                                      updateItem(`teamPage.departments.${dept}`, index, 'social', newSocial as any);
                                    }}
                                    className="bg-white/5 border-white/5 h-7 text-[10px]"
                                    placeholder="Email Address"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Recruitment CTA</CardTitle>
                <CardDescription>Control the "Join Our Tech Family" section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-medium">CTA Title</label>
                    <Input 
                      value={content.teamPage?.hiring?.title || ''} 
                      onChange={(e) => setContent(updateStateDeep(content, 'teamPage.hiring.title', e.target.value))}
                      className="bg-white/10 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Button Text</label>
                    <Input 
                      value={content.teamPage?.hiring?.buttonText || ''} 
                      onChange={(e) => setContent(updateStateDeep(content, 'teamPage.hiring.buttonText', e.target.value))}
                      className="bg-white/10 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA Description</label>
                  <Textarea 
                    value={content.teamPage?.hiring?.description || ''} 
                    onChange={(e) => setContent(updateStateDeep(content, 'teamPage.hiring.description', e.target.value))}
                    className="bg-white/10 border-white/10 h-20"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Core Principles</CardTitle>
                  <CardDescription>Core values highlighted on the team page</CardDescription>
                </div>
                <Button onClick={() => addItem('teamPage.values', { title: 'New Principle', description: '', icon: '✨', color: 'from-purple-500 to-pink-500' })} size="sm" className="bg-purple-600">
                  <Plus className="w-4 h-4 mr-1" /> Add Principle
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(content.teamPage?.values || []).map((value: any, index: number) => (
                  <div key={index} className={`p-5 bg-gradient-to-br ${value.color} rounded-3xl space-y-3 relative group text-white`}>
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                      onClick={() => removeItem('teamPage.values', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <Input value={value.icon} onChange={(e) => updateItem('teamPage.values', index, 'icon', e.target.value)} className="w-12 bg-white/20 border-white/20 text-center text-xl p-0" />
                      <Input value={value.title} onChange={(e) => updateItem('teamPage.values', index, 'title', e.target.value)} className="bg-white/20 border-white/20 font-bold" />
                    </div>
                    <Textarea value={value.description} onChange={(e) => updateItem('teamPage.values', index, 'description', e.target.value)} className="bg-white/10 border-white/10 h-24 placeholder:text-white/50" placeholder="Describe this principle..." />
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase opacity-70">Gradient Class</label>
                      <Input value={value.color} onChange={(e) => updateItem('teamPage.values', index, 'color', e.target.value)} className="bg-white/10 border-white/10 text-xs h-7" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inquiries & Leads</CardTitle>
                    <CardDescription className="text-kaki-grey">Manage messages from potential clients</CardDescription>
                  </div>
                  <div className="px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                    <span className="text-purple-400 font-bold">{inquiries.length}</span> <span className="text-sm text-kaki-grey ml-2">Total Messages</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                      <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <p className="text-kaki-grey">No inquiries yet. Keep building!</p>
                    </div>
                  ) : (
                    inquiries.map((inquiry: any) => {
                      const inquiryId = inquiry.id || inquiry._id;
                      const isUnread = inquiry.status === 'new' || inquiry.status === 'unread';
                      
                      return (
                        <div key={inquiryId} className={`p-6 bg-white/5 border ${isUnread ? 'border-purple-500/50 bg-purple-500/[0.03]' : 'border-white/10'} rounded-3xl hover:bg-white/[0.07] transition-all relative group`}>
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-bold text-lg ${isUnread ? 'text-white' : 'text-white/80'}`}>{inquiry.name}</h3>
                                {isUnread && (
                                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                )}
                                {(inquiry.type === 'contact_form' || !inquiry.type) ? (
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded uppercase font-bold tracking-wider">General Inquiry</span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded uppercase font-bold tracking-wider">Service Lead</span>
                                )}
                              </div>
                              <p className="text-purple-400 text-sm mb-2">{inquiry.email}</p>
                              <div className="flex flex-wrap gap-3 text-xs text-kaki-grey">
                                {inquiry.phone && <span className="flex items-center"><Plus className="w-3 h-3 mr-1" /> {inquiry.phone}</span>}
                                {inquiry.subject && <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {inquiry.subject}</span>}
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(inquiry.createdAt || Date.now()).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleMarkAsRead(inquiryId, inquiry.status)}
                                  className={`text-xs ${isUnread ? 'text-purple-400 hover:text-purple-300' : 'text-kaki-grey hover:text-white'}`}
                               >
                                  {isUnread ? 'Mark as Read' : 'Unmark'}
                               </Button>
                               <a href={`mailto:${inquiry.email}`} className="px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium">Reply</a>
                               <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteInquiry(inquiryId)}
                                  className="text-white/30 hover:text-red-500 hover:bg-red-500/10"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </Button>
                            </div>
                          </div>
                          <div className={`p-4 ${isUnread ? 'bg-kaki-black/80' : 'bg-kaki-black/40'} rounded-2xl border border-white/5 text-sm ${isUnread ? 'text-white/90' : 'text-kaki-grey'} whitespace-pre-wrap leading-relaxed`}>
                            {inquiry.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
    </div>
  );
};

export default AdminContent;
