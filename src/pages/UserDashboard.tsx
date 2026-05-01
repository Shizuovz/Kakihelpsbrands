import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserHoardings, type Hoarding } from '@/data/hoardings';
import { UserHoardingsManager } from '@/components/UserHoardingsManager';
import { UserAnalytics } from '@/components/UserAnalytics';
import { UserProfile } from '@/components/UserProfile';
import { CalendarManager } from '@/components/CalendarManager';
import { formatINR } from '@/utils/currency';
import { API_BASE_URL } from '@/config';
import { IndianRupee, MapPin, Maximize2, Layers, Eye } from 'lucide-react';
import { resolveApiUrl } from '@/utils/resolveApiUrl';
import {
  ArrowLeft,
  Settings,
  Calendar,
  CalendarDays,
  Image,
  BarChart3,
  Users,
  DollarSign,
  Plus,
  TrendingUp,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  MessageSquare,
  Trash2,
  Filter,
  MoreVertical,
  ChevronDown,
  XCircle,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Search,
  ArrowDownAZ
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [hoardings, setHoardings] = useState<Hoarding[]>([]);
  const [selectedHoarding, setSelectedHoarding] = useState<Hoarding | null>(null);
  const [activeTab, setActiveTab] = useState<'hoardings' | 'analytics' | 'calendar' | 'bookings' | 'profile'>('hoardings');
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'contacted' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');
  const [editingInquiry, setEditingInquiry] = useState<any | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [dbStatus, setDbStatus] = useState<{ isMock: boolean, warning: string | null }>({ isMock: false, warning: null });

  useEffect(() => {
    // If not authenticated and not currently checking auth, redirect to login
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/db-status`);
        if (response.ok) {
          const data = await response.json();
          setDbStatus(data);
        }
      } catch (err) {
        console.error('Failed to check DB status:', err);
      }
    };
    checkDbStatus();
  }, []);

  useEffect(() => {
    if (user?.id) {
      console.log('UserDashboard: Loading content for user:', user.email);
      loadHoardings();
      loadInquiries();
    }
  }, [user?.id]);

  const loadInquiries = async () => {
    try {
      if (!user?.id) return;
      console.log('UserDashboard: Fetching user inquiries...');
      const response = await fetch(`${API_BASE_URL}/api/user/inquiries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setInquiries(result.data || []);
      }
    } catch (error) {
      console.error('UserDashboard: Failed to load inquiries:', error);
    }
  };

  const updateInquiry = async (id: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        // If we confirmed the inquiry, also update the hoarding status to 'Booked'
        if (updates.status === 'confirmed') {
          // Use stringified ID for the API call
          const inquiryId = id.toString();
          const inquiry = inquiries.find(i => (i.id || i._id?.toString() || i._id) === inquiryId);
          if (inquiry && inquiry.hoardingId) {
            console.log('Automating booking for hoarding:', inquiry.hoardingId);
            try {
              await fetch(`${API_BASE_URL}/api/user/hoardings/${inquiry.hoardingId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ status: 'Booked' })
              });
              toast.success('Campaign confirmed and hoarding marked as Booked!');
            } catch (hErr) {
              console.error('Failed to sync hoarding status:', hErr);
            }
          }
        } else {
          toast.success('Inquiry updated successfully');
        }

        loadInquiries();
        loadHoardings(); // Refresh hoarding stats to show in "Recent Bookings"
        setEditingInquiry(null);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update inquiry');
      }
    } catch (error) {
      toast.error('Connection error while updating inquiry');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry? Data cannot be recovered.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        toast.success('Inquiry deleted');
        loadInquiries();
      } else {
        toast.error('Failed to delete inquiry');
      }
    } catch (error) {
      toast.error('Connection error while deleting inquiry');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-kaki-grey/20 text-kaki-grey border-white/10';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'unpaid': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-white/5 text-kaki-grey border-white/10';
    }
  };

  const filteredInquiries = useMemo(() => {
    let result = [...inquiries];
    
    // Status Filter
    if (inquiryFilter !== 'all') {
      result = result.filter(inq => inq.status?.toLowerCase() === inquiryFilter.toLowerCase());
    }
    
    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(inq => 
        (inq.name || '').toLowerCase().includes(query) ||
        (inq.email || '').toLowerCase().includes(query) ||
        (inq.phone || '').toLowerCase().includes(query) ||
        (inq.hoardingTitle || '').toLowerCase().includes(query) ||
        (inq.message || '').toLowerCase().includes(query)
      );
    }
    
    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.submittedAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.submittedAt || 0).getTime();
      
      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'price-high') return (b.hoardingTotalCharges || 0) - (a.hoardingTotalCharges || 0);
      if (sortBy === 'price-low') return (a.hoardingTotalCharges || 0) - (b.hoardingTotalCharges || 0);
      return 0;
    });
    
    return result;
  }, [inquiries, inquiryFilter, searchQuery, sortBy]);

  const exportToCSV = () => {
    if (inquiries.length === 0) {
      toast.error('No inquiries to export');
      return;
    }

    // Define headers
    const headers = [
      'Customer Name',
      'Email',
      'Phone',
      'Company',
      'Hoarding Title',
      'Status',
      'Payment Status',
      'Start Date',
      'End Date',
      'Duration (Days)',
      'Rent',
      'Printing Charges',
      'Mounting Charges',
      'Total Charges',
      'Submitted At',
      'Internal Notes',
      'Message'
    ];

    // Map data to rows
    const rows = inquiries.map(inq => [
      inq.name || 'N/A',
      inq.email || 'N/A',
      inq.phone || 'N/A',
      inq.company || inq.companyName || 'N/A',
      inq.hoardingTitle || 'N/A',
      inq.status || 'new',
      inq.paymentStatus || 'unpaid',
      inq.selectedDates?.startDate || 'N/A',
      inq.selectedDates?.endDate || 'N/A',
      inq.selectedDates ? Math.ceil((new Date(inq.selectedDates.endDate).getTime() - new Date(inq.selectedDates.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 'N/A',
      inq.hoardingPrice || 0,
      inq.hoardingPrintingCharges || 0,
      inq.hoardingMountingCharges || 0,
      inq.hoardingTotalCharges || 0,
      new Date(inq.createdAt || inq.submittedAt).toLocaleString(),
      inq.internalNotes || '',
      inq.message || ''
    ]);

    // Construct CSV content with proper escaping
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kaki-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Inquiries exported to CSV successfully');
  };

  const loadHoardings = async () => {
    try {
      console.log('UserDashboard: Fetching user hoardings...');
      const data = await fetchUserHoardings(user?.id || '');
      console.log('UserDashboard: Loaded hoardings:', data.length);
      setHoardings(data);
      if (data.length > 0) {
        setSelectedHoarding(data[0]);
        console.log('UserDashboard: Selected first hoarding:', data[0].title);
      }
    } catch (error) {
      console.error('UserDashboard: Failed to load hoardings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHoardingUpdate = (updatedHoardings: Hoarding[]) => {
    setHoardings(updatedHoardings);
    if (selectedHoarding && updatedHoardings.length > 0) {
      const updated = updatedHoardings.find(h => h.id === selectedHoarding.id);
      if (updated) setSelectedHoarding(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaki-black pt-32 pb-20">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-48 mb-8"></div>
            <div className="h-96 bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaki-black pt-32 pb-20">
      <div className="container-custom">
        {/* Database Warning */}
        {dbStatus.isMock && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-4 text-red-200 animate-pulse">
            <div className="bg-red-500 p-2 rounded-full">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold">⚠️ DATABASE CONNECTION FAILED (Running in MOCK MODE)</p>
              <p className="text-sm opacity-80">
                Data is being saved to temporary local files. To store data in the cloud permanently, please fix your MongoDB Atlas connection (IP Whitelisting).
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/hoardings")}
              className="text-kaki-grey hover:text-white hover:bg-white/10 w-fit sm:mt-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hoardings
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <Settings className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
                Provider Dashboard
              </h1>
              <p className="text-kaki-grey mt-1 text-sm md:text-base leading-relaxed">
                Manage your hoarding inventory and performance
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setActiveTab('hoardings')}
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-kaki-grey">Total Hoardings</span>
              <Image className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">{hoardings.length}</div>
            <div className="text-xs text-kaki-grey mt-1">Your inventory</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-kaki-grey">Available</span>
              <div className="w-5 h-5 bg-green-500/40 border border-green-500 rounded"></div>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {hoardings.filter(h => h.status === 'Available').length}
            </div>
            <div className="text-xs text-kaki-grey mt-1">Ready for booking</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-kaki-grey">Confirmed Bookings</span>
              <div className="w-5 h-5 bg-green-500/40 border border-green-500 rounded"></div>
            </div>
            <div className="text-3xl font-bold text-white">
              {inquiries.filter(inq => inq.status?.toLowerCase() === 'confirmed').length}
            </div>
            <div className="text-xs text-kaki-grey mt-1">Active campaigns</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-kaki-grey">Total Revenue</span>
              <IndianRupee className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">
              {formatINR(inquiries.filter(inq => inq.status?.toLowerCase() === 'confirmed').reduce((sum, inq) => sum + Number(inq.hoardingTotalCharges || 0), 0))}
            </div>
            <div className="text-xs text-kaki-grey mt-1">Confirmed total</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-1 mb-8 overflow-x-auto no-scrollbar">
          <div className="flex min-w-max md:min-w-0 space-x-1">
            <Button
              variant={activeTab === 'hoardings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('hoardings')}
              className={`flex-1 ${activeTab === 'hoardings'
                ? 'bg-green-600 text-white hover:bg-green-600/80'
                : 'text-kaki-grey hover:text-white hover:bg-white/10'
                }`}
            >
              <Image className="w-4 h-4 mr-2" />
              My Hoardings
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 ${activeTab === 'analytics'
                ? 'bg-green-600 text-white hover:bg-green-600/80'
                : 'text-kaki-grey hover:text-white hover:bg-white/10'
                }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 ${activeTab === 'calendar'
                ? 'bg-green-600 text-white hover:bg-green-600/80'
                : 'text-kaki-grey hover:text-white hover:bg-white/10'
                }`}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={activeTab === 'bookings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 ${activeTab === 'bookings'
                ? 'bg-green-600 text-white hover:bg-green-600/80'
                : 'text-kaki-grey hover:text-white hover:bg-white/10'
                }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className={`flex-1 ${activeTab === 'profile'
                ? 'bg-green-600 text-white hover:bg-green-600/80'
                : 'text-kaki-grey hover:text-white hover:bg-white/10'
                }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'hoardings' && (
            <UserHoardingsManager
              hoardings={hoardings}
              inquiries={inquiries}
              onHoardingsUpdate={handleHoardingUpdate}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'analytics' && (
            <UserAnalytics hoardings={hoardings} inquiries={inquiries} />
          )}

          {activeTab === 'calendar' && (
            <CalendarManager hoardings={hoardings} inquiries={inquiries} />
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Bookings Header */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-green-400" />
                      Booking Management
                    </h2>
                    <p className="text-kaki-grey mt-1 text-sm">Manage your hoarding bookings and inquiries</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] md:text-sm">
                      {hoardings.filter(h => h.status === 'Booked').length} Bookings
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] md:text-sm">
                      {hoardings.filter(h => h.status === 'Available').length} Ready
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>

                {hoardings.filter(h => h.status === 'Booked').length > 0 ? (
                  <div className="space-y-4">
                    {hoardings.filter(h => h.status === 'Booked').slice(0, 5).map((hoarding) => {
                      // Find the most relevant inquiry for this hoarding
                      // Priority: 1. Confirmed status, 2. Latest inquiry if hoarding is booked
                      const confirmedInq = inquiries
                        .filter(inq => {
                          const inqHid = String(inq.hoardingId || '').trim();
                          const hId = String(hoarding.id || (hoarding as any)._id || '').trim();
                          return inqHid === hId && inqHid !== '';
                        })
                        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                        .find(inq => inq.status?.toLowerCase() === 'confirmed') ||
                        (hoarding.status === 'Booked' ? inquiries.find(inq => {
                          const inqHid = String(inq.hoardingId || '').trim();
                          const hId = String(hoarding.id || (hoarding as any)._id || '').trim();
                          return inqHid === hId && inqHid !== '';
                        }) : null);

                      return (
                        <div key={hoarding.id || (hoarding as any)._id?.toString() || Math.random().toString()} className="p-4 md:p-5 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/30 transition-all">
                          <div className="flex flex-col md:flex-row gap-5">
                            {/* Image Thumbnail */}
                            <div className="w-full md:w-40 h-32 md:h-auto aspect-video md:aspect-square rounded-lg overflow-hidden border border-white/10 shrink-0 bg-kaki-dark-grey">
                              <img
                                src={resolveApiUrl(hoarding.imageUrl)}
                                alt={hoarding.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-bold text-lg md:text-xl">{hoarding.title}</h4>
                                    <Badge variant="outline" className="text-[10px] uppercase border-green-500/30 text-green-400 font-bold bg-green-500/5">
                                      Active Booking
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-kaki-grey text-sm mb-2">
                                    <MapPin className="w-3 h-3 text-red-400" />
                                    {hoarding.location}
                                  </div>
                                </div>

                                <div className="text-left md:text-right flex flex-col items-end gap-2">
                                  <div className="flex flex-col items-end">
                                    <div className="text-xl md:text-2xl font-bold text-green-400">
                                      {formatINR(hoarding.totalCharges || (hoarding.price + (hoarding.printingCharges || 0) + (hoarding.mountingCharges || 0)))}
                                    </div>
                                    <div className="text-[10px] text-kaki-grey uppercase tracking-wider font-semibold">Contract Total</div>
                                  </div>

                                  {/* Prominent Dates in Header */}
                                  {confirmedInq && (
                                    <div className="flex flex-col items-end bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg animate-in fade-in zoom-in duration-500">
                                      <p className="text-[9px] text-purple-400 uppercase tracking-widest font-bold mb-0.5">Booking Duration</p>
                                      <p className="text-xs text-white font-bold whitespace-nowrap">
                                        {confirmedInq.selectedDates ? (
                                          `${new Date(confirmedInq.selectedDates.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(confirmedInq.selectedDates.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
                                        ) : 'Dates Not Set'}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
                                <div>
                                  <p className="text-[10px] text-kaki-grey uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Layers className="w-3 h-3" /> Type
                                  </p>
                                  <p className="text-sm text-white font-medium">{hoarding.type}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-kaki-grey uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Maximize2 className="w-3 h-3" /> Size
                                  </p>
                                  <p className="text-sm text-white font-medium">{hoarding.dimensions}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-kaki-grey uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> Views
                                  </p>
                                  <p className="text-sm text-white font-medium">{hoarding.impressions}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Client
                                  </p>
                                  <p className="text-sm text-white font-medium truncate max-w-[150px]">
                                    {confirmedInq ? confirmedInq.name : 'N/A'}
                                  </p>
                                </div>
                              </div>

                              {confirmedInq && (
                                <div className="mt-4 flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <Users className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-kaki-grey uppercase tracking-wider">Campaign Client</p>
                                    <p className="text-sm text-white font-semibold">{confirmedInq.name} {confirmedInq.company && `• ${confirmedInq.company}`}</p>
                                  </div>
                                  <div className="ml-auto flex gap-2">
                                    <a href={`tel:${confirmedInq.phone}`} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-blue-400">
                                      <Phone className="w-3.5 h-3.5" />
                                    </a>
                                    <a href={`mailto:${confirmedInq.email}`} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-blue-400">
                                      <Mail className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-kaki-grey/30 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">No Active Bookings</h4>
                    <p className="text-kaki-grey mb-4">Your hoardings are available for booking</p>
                    <Button
                      onClick={() => setActiveTab('hoardings')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Manage Hoardings
                    </Button>
                  </div>
                )}
              </div>

              {/* Inquiries */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-400" />
                        Booking Inquiries
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInquiryFilter('all')}
                          className={`text-xs ${inquiryFilter === 'all' ? 'bg-white/10 text-white' : 'text-kaki-grey'}`}
                        >
                          All
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInquiryFilter('new')}
                          className={`text-xs ${inquiryFilter === 'new' ? 'bg-blue-500/10 text-blue-400' : 'text-kaki-grey'}`}
                        >
                          New
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInquiryFilter('contacted')}
                          className={`text-xs ${inquiryFilter === 'contacted' ? 'bg-purple-500/10 text-purple-400' : 'text-kaki-grey'}`}
                        >
                          Contacted
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInquiryFilter('confirmed')}
                          className={`text-xs ${inquiryFilter === 'confirmed' ? 'bg-green-500/10 text-green-400' : 'text-kaki-grey'}`}
                        >
                          Confirmed
                        </Button>
                        
                        <div className="h-4 w-px bg-white/10 mx-1 hidden md:block"></div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={exportToCSV}
                          className="text-xs border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 ml-auto flex items-center gap-2"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          Export CSV
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kaki-grey group-focus-within:text-blue-400 transition-colors" />
                        <Input 
                          placeholder="Search customer, email or hoarding..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-white/5 border-white/10 pl-10 h-10 focus:border-blue-500/50"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-10 flex-1">
                            <div className="flex items-center gap-2">
                              <ArrowDownAZ className="w-4 h-4 text-blue-400" />
                              <SelectValue placeholder="Sort By" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-kaki-black border-white/10">
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="price-high">Highest Value</SelectItem>
                            <SelectItem value="price-low">Lowest Value</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSearchQuery('');
                            setSortBy('newest');
                            setInquiryFilter('all');
                          }}
                          className="text-kaki-grey hover:text-white border border-white/10 h-10 w-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                {filteredInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {filteredInquiries.map((inquiry) => (
                      <div key={inquiry.id || (inquiry._id ? inquiry._id.toString() : Math.random().toString())} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/20 transition-all relative group">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0 ${inquiry.status === 'confirmed' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                              <Phone className={`w-4 h-4 md:w-6 md:h-6 ${inquiry.status === 'confirmed' ? 'text-green-400' : 'text-blue-400'}`} />
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-white font-bold text-lg">{inquiry.name}</h4>
                                <Badge variant="outline" className={`text-[10px] uppercase ${getStatusColor(inquiry.status)}`}>
                                  {inquiry.status || 'New'}
                                </Badge>
                                <Badge variant="outline" className={`text-[10px] uppercase ${getPaymentStatusColor(inquiry.paymentStatus || 'unpaid')}`}>
                                  {inquiry.paymentStatus || 'Unpaid'}
                                </Badge>
                                {(inquiry.company || inquiry.companyName) && (
                                  <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-kaki-grey">
                                    {inquiry.company || inquiry.companyName}
                                  </Badge>
                                )}
                              </div>

                              <p className="text-kaki-grey text-sm">
                                Interested in: <span className="text-white font-medium">{inquiry.hoardingTitle || 'Unknown Hoarding'}</span>
                              </p>

                              {/* Campaign Dates */}
                              {inquiry.selectedDates && (
                                <div className="flex items-center gap-2 text-xs text-purple-400 mt-2 bg-purple-400/5 px-2 py-1.5 rounded w-fit border border-purple-500/10">
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  <span>
                                    {new Date(inquiry.selectedDates.startDate).toLocaleDateString()} - {new Date(inquiry.selectedDates.endDate).toLocaleDateString()}
                                  </span>
                                  <span className="opacity-60">
                                    ({Math.ceil((new Date(inquiry.selectedDates.endDate).getTime() - new Date(inquiry.selectedDates.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days)
                                  </span>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-4 text-xs text-kaki-grey mt-3">
                                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded">
                                  <Phone className="w-3.5 h-3.5 text-blue-400" /> {inquiry.phone}
                                </a>
                                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded">
                                  <Mail className="w-3.5 h-3.5 text-blue-400" /> {inquiry.email}
                                </a>
                              </div>

                              {/* Price Breakdown Popover-style div */}
                              {(inquiry.hoardingPrintingCharges || inquiry.hoardingMountingCharges) && (
                                <div className="mt-3 flex gap-3 text-[10px] text-kaki-grey/60 uppercase tracking-wider">
                                  <span>Rent: {formatINR(inquiry.hoardingPrice || 0)}</span>
                                  <span>•</span>
                                  <span>Setup: {formatINR((inquiry.hoardingPrintingCharges || 0) + (inquiry.hoardingMountingCharges || 0))}</span>
                                </div>
                              )}

                              {/* Inquiry Message */}
                              {inquiry.message && (
                                <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/5 relative">
                                  <p className="text-[10px] text-kaki-grey uppercase tracking-wider mb-1 font-semibold flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3 text-purple-400" /> Client Requirements:
                                  </p>
                                  <p className="text-sm text-white/90 leading-relaxed italic">"{inquiry.message}"</p>
                                </div>
                              )}

                              {/* Internal Notes */}
                              {inquiry.internalNotes && (
                                <div className="mt-3 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                                  <p className="text-[10px] text-yellow-400/70 uppercase tracking-wider mb-1 font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" /> Management Notes:
                                  </p>
                                  <p className="text-sm text-yellow-200/80 leading-relaxed">{inquiry.internalNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3 min-w-[200px]">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-400">
                                {formatINR(inquiry.hoardingTotalCharges || inquiry.hoardingPrice || 0)}
                              </div>
                              <div className="text-[10px] text-kaki-grey uppercase tracking-wider">Est. Campaign Value</div>
                              <div className="flex items-center justify-end gap-2 mt-1">
                                <Clock className="w-3 h-3 text-kaki-grey" />
                                <span className="text-[10px] text-kaki-grey">
                                  {new Date(inquiry.createdAt || inquiry.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-2">
                              {/* Status Dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 hover:bg-white/10 text-xs">
                                    Status <ChevronDown className="w-3 h-3 ml-1" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-kaki-black border-white/10 text-white w-40">
                                  <DropdownMenuLabel className="text-[10px] text-kaki-grey uppercase">Change Status</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-white/5" />
                                  <DropdownMenuItem onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { status: 'new' })} className="gap-2 cursor-pointer focus:bg-blue-500/20">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> New
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { status: 'contacted' })} className="gap-2 cursor-pointer focus:bg-purple-500/20">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> Contacted
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { status: 'confirmed' })} className="gap-2 cursor-pointer focus:bg-green-500/20">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Confirmed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { status: 'cancelled' })} className="gap-2 cursor-pointer focus:bg-red-500/20">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Cancelled
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              {/* Payment Status Dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className={`h-8 border-white/10 bg-white/5 hover:bg-white/10 text-xs ${getPaymentStatusColor(inquiry.paymentStatus || 'unpaid')}`}>
                                    Payment <ChevronDown className="w-3 h-3 ml-1" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-kaki-black border-white/10 text-white w-40">
                                  <DropdownMenuLabel className="text-[10px] text-kaki-grey uppercase">Payment Status</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-white/5" />
                                  <DropdownMenuItem onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { paymentStatus: 'unpaid' })} className="gap-2 cursor-pointer focus:bg-red-500/20">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Unpaid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { paymentStatus: 'partial' })} className="gap-2 cursor-pointer focus:bg-yellow-500/20">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Partially Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { paymentStatus: 'paid' })} className="gap-2 cursor-pointer focus:bg-green-500/20">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Fully Paid
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              {/* Notes Button */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingInquiry(inquiry);
                                      setInternalNotes(inquiry.internalNotes || '');
                                    }}
                                    className="h-8 border-white/10 bg-white/5 hover:bg-white/10 text-xs"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-kaki-black border-white/10 text-white">
                                  <DialogHeader>
                                    <DialogTitle>Inquiry Management</DialogTitle>
                                    <DialogDescription className="text-kaki-grey">
                                      Add internal notes or follow-up details for {inquiry.name}.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-kaki-grey">Internal Notes</label>
                                      <Textarea
                                        placeholder="Add private notes about this client interaction..."
                                        value={internalNotes}
                                        onChange={(e) => setInternalNotes(e.target.value)}
                                        className="bg-black/50 border-white/10 min-h-[120px] focus:border-green-500/50"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => updateInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id, { internalNotes })}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Save Notes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              {/* Delete Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteInquiry(inquiry.id || inquiry._id?.toString() || inquiry._id)}
                                className="h-8 border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <Mail className="w-12 h-12 text-kaki-grey/30 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">No {inquiryFilter !== 'all' ? inquiryFilter : ''} inquiries found</h4>
                    <p className="text-kaki-grey text-sm mb-4">When users request to book your hoardings, they'll appear here.</p>
                    {inquiryFilter !== 'all' && (
                      <Button variant="link" onClick={() => setInquiryFilter('all')} className="text-green-400">
                        View all inquiries
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && user && (
            <UserProfile user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;