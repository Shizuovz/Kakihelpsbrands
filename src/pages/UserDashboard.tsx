import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserHoardings, type Hoarding } from '@/data/hoardings';
import { UserHoardingsManager } from '@/components/UserHoardingsManager';
import { UserAnalytics } from '@/components/UserAnalytics';
import { UserProfile } from '@/components/UserProfile';
import { CalendarManager } from '@/components/CalendarManager';
import { formatINR } from '@/utils/currency';
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
  CheckCircle
} from 'lucide-react';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [hoardings, setHoardings] = useState<Hoarding[]>([]);
  const [selectedHoarding, setSelectedHoarding] = useState<Hoarding | null>(null);
  const [activeTab, setActiveTab] = useState<'hoardings' | 'analytics' | 'calendar' | 'bookings' | 'profile'>('hoardings');
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<{isMock: boolean, warning: string | null}>({isMock: false, warning: null});

  useEffect(() => {
    // If not authenticated and not currently checking auth, redirect to login
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/db-status');
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
      const response = await fetch('http://localhost:3001/api/user/inquiries', {
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/hoardings")}
              className="text-kaki-grey hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hoardings
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-green-400" />
                Provider Dashboard
              </h1>
              <p className="text-kaki-grey mt-1">Manage your hoarding inventory and performance</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setActiveTab('hoardings')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Hoarding
            </Button>
            <Button 
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <span className="text-kaki-grey">Booked</span>
              <div className="w-5 h-5 bg-red-500/40 border border-red-500 rounded"></div>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {hoardings.filter(h => h.status === 'Booked').length}
            </div>
            <div className="text-xs text-kaki-grey mt-1">Currently occupied</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-kaki-grey">Monthly Revenue</span>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">
              {formatINR(hoardings.filter(h => h.status === 'Booked').reduce((sum, h) => sum + h.price, 0))}
            </div>
            <div className="text-xs text-kaki-grey mt-1">Current month</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-1 mb-8">
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'hoardings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('hoardings')}
              className={`flex-1 ${
                activeTab === 'hoardings' 
                  ? 'bg-green-600 text-white' 
                  : 'text-kaki-grey hover:text-white hover:bg-white/10'
              }`}
            >
              <Image className="w-4 h-4 mr-2" />
              My Hoardings
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 ${
                activeTab === 'analytics' 
                  ? 'bg-green-600 text-white' 
                  : 'text-kaki-grey hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 ${
                activeTab === 'calendar' 
                  ? 'bg-green-600 text-white' 
                  : 'text-kaki-grey hover:text-white hover:bg-white/10'
              }`}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={activeTab === 'bookings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 ${
                activeTab === 'bookings' 
                  ? 'bg-green-600 text-white' 
                  : 'text-kaki-grey hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className={`flex-1 ${
                activeTab === 'profile' 
                  ? 'bg-green-600 text-white' 
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
              onHoardingsUpdate={handleHoardingUpdate} 
              isLoading={isLoading} 
            />
          )}

          {activeTab === 'analytics' && (
            <UserAnalytics hoardings={hoardings} />
          )}

          {activeTab === 'calendar' && (
            <CalendarManager hoardings={hoardings} />
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Bookings Header */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-green-400" />
                      Booking Management
                    </h2>
                    <p className="text-kaki-grey mt-1">Manage your hoarding bookings and inquiries</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {hoardings.filter(h => h.status === 'Booked').length} Active Bookings
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {hoardings.filter(h => h.status === 'Available').length} Available
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>
                
                {hoardings.filter(h => h.status === 'Booked').length > 0 ? (
                  <div className="space-y-4">
                    {hoardings.filter(h => h.status === 'Booked').slice(0, 5).map((hoarding) => (
                      <div key={hoarding.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{hoarding.title}</h4>
                            <p className="text-kaki-grey text-sm">{hoarding.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">{formatINR(hoarding.price)}/mo</div>
                          <div className="text-kaki-grey text-sm">Active Booking</div>
                        </div>
                      </div>
                    ))}
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
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Recent Inquiries
                </h3>
                
                {inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id || inquiry._id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/30 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                              <Phone className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold text-lg">{inquiry.name}</h4>
                                <Badge variant="outline" className="text-[10px] uppercase border-blue-500/30 text-blue-400">
                                  {inquiry.company || 'Individual'}
                                </Badge>
                              </div>
                              <p className="text-kaki-grey text-sm font-medium">
                                Interested in: <span className="text-white">{inquiry.hoardingTitle}</span>
                              </p>
                              
                              {/* Campaign Dates */}
                              {inquiry.selectedDates && (
                                <div className="flex items-center gap-2 text-xs text-purple-400 mt-2 bg-purple-400/5 px-2 py-1 rounded w-fit">
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  <span>
                                    {new Date(inquiry.selectedDates.startDate).toLocaleDateString()} - {new Date(inquiry.selectedDates.endDate).toLocaleDateString()}
                                  </span>
                                  <span className="opacity-60">
                                    ({Math.ceil((new Date(inquiry.selectedDates.endDate).getTime() - new Date(inquiry.selectedDates.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days)
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-4 text-xs text-kaki-grey mt-2">
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inquiry.phone}</span>
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inquiry.email}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-400">
                                {formatINR(inquiry.hoardingTotalCharges || inquiry.hoardingPrice || 0)}
                              </div>
                              <div className="text-[10px] text-kaki-grey uppercase tracking-wider">Total Est. Value</div>
                            </div>
                            
                            {/* Price Breakdown Popover-style div */}
                            {(inquiry.hoardingPrintingCharges || inquiry.hoardingMountingCharges) && (
                              <div className="text-[10px] text-kaki-grey text-right bg-black/20 p-2 rounded">
                                <div>Rent: {formatINR(inquiry.hoardingPrice || 0)}</div>
                                <div>Setup: {formatINR((inquiry.hoardingPrintingCharges || 0) + (inquiry.hoardingMountingCharges || 0))}</div>
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-kaki-grey" />
                              <span className="text-[10px] text-kaki-grey">
                                {new Date(inquiry.createdAt || inquiry.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-kaki-grey">
                    No inquiries yet. When users request to book your spaces, they will appear here.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <UserProfile user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
