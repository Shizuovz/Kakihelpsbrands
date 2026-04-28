import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Hoarding } from '@/data/hoardings';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  DollarSign, 
  MapPin,
  BarChart3,
  PieChart
} from 'lucide-react';
import { formatINR } from '@/utils/currency';

interface UserAnalyticsProps {
  hoardings: Hoarding[];
  inquiries: any[];
}

export const UserAnalytics = ({ hoardings, inquiries }: UserAnalyticsProps) => {
  // Use inquiries for booking-related stats
  const confirmedInquiries = inquiries.filter(inq => inq.status?.toLowerCase() === 'confirmed');
  
  // Calculate analytics
  const analytics = {
    totalHoardings: hoardings.length,
    availableHoardings: hoardings.filter(h => h.status === 'Available').length,
    bookedCount: confirmedInquiries.length,
    totalRevenue: confirmedInquiries.reduce((sum, inq) => sum + (Number(inq.hoardingTotalCharges) || 0), 0),
    avgPrice: hoardings.length > 0 ? hoardings.reduce((sum, h) => sum + h.price, 0) / hoardings.length : 0,
    occupancyRate: hoardings.length > 0 ? (confirmedInquiries.length / hoardings.length) * 100 : 0,
  };

  // Group by region - using confirmed inquiries to see actual performance
  const regionData = hoardings.reduce((acc, hoarding) => {
    const region = hoarding.region || 'Unknown';
    if (!acc[region]) {
      acc[region] = { count: 0, value: 0, booked: 0 };
    }
    acc[region].count++;
    
    // Find confirmed inquiries for this hoarding
    const hInqs = confirmedInquiries.filter(inq => {
      const inqHid = String(inq.hoardingId || '').trim();
      const hId = String(hoarding.id || (hoarding as any)._id || '').trim();
      return inqHid === hId;
    });
    
    acc[region].value += hInqs.reduce((sum, inq) => sum + (Number(inq.hoardingTotalCharges) || 0), 0);
    acc[region].booked += hInqs.length;
    
    return acc;
  }, {} as Record<string, { count: number; value: number; booked: number }>);

  // Group by type
  const typeData = hoardings.reduce((acc, hoarding) => {
    const type = hoarding.type || 'Unknown';
    if (!acc[type]) {
      acc[type] = { count: 0, value: 0, booked: 0 };
    }
    acc[type].count++;
    
    // Find confirmed inquiries for this hoarding
    const hInqs = confirmedInquiries.filter(inq => {
      const inqHid = String(inq.hoardingId || '').trim();
      const hId = String(hoarding.id || (hoarding as any)._id || '').trim();
      return inqHid === hId;
    });
    
    acc[type].value += hInqs.reduce((sum, inq) => sum + (Number(inq.hoardingTotalCharges) || 0), 0);
    acc[type].booked += hInqs.length;
    
    return acc;
  }, {} as Record<string, { count: number; value: number; booked: number }>);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-kaki-dark-grey border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-kaki-grey">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatINR(analytics.totalRevenue)}
            </div>
            <p className="text-xs text-kaki-grey">
              Confirmed total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-kaki-dark-grey border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-kaki-grey">
              Occupancy Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round(analytics.occupancyRate)}%
            </div>
            <p className="text-xs text-kaki-grey">
              {analytics.bookedCount} campaigns active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-kaki-dark-grey border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-kaki-grey">
              Average Price
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹{Math.round(analytics.avgPrice).toLocaleString()}
            </div>
            <p className="text-xs text-kaki-grey">
              Per month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-kaki-dark-grey border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-kaki-grey">
              Available Spaces
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analytics.availableHoardings}
            </div>
            <p className="text-xs text-kaki-grey">
              Ready for booking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Breakdown */}
        <Card className="bg-kaki-dark-grey border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Regional Breakdown
            </CardTitle>
            <CardDescription className="text-kaki-grey">
              Performance by region
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(regionData).map(([region, data]) => (
              <div key={region} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-white font-medium">{region}</p>
                    <p className="text-sm text-kaki-grey">
                      {data.count} spaces • {data.booked} booked
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatINR(data.value)}</p>
                  <Badge 
                    className={`${
                      data.booked > 0 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400'
                        : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {data.count > 0 ? Math.round((data.booked / data.count) * 100) : 0}% occupied
                  </Badge>
                </div>
              </div>
            ))}
            {Object.keys(regionData).length === 0 && (
              <p className="text-kaki-grey text-center py-4">No regional data available</p>
            )}
          </CardContent>
        </Card>

        {/* Type Breakdown */}
        <Card className="bg-kaki-dark-grey border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Type Breakdown
            </CardTitle>
            <CardDescription className="text-kaki-grey">
              Performance by hoarding type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(typeData).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-white font-medium capitalize">{type}</p>
                    <p className="text-sm text-kaki-grey">
                      {data.count} spaces • {data.booked} booked
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatINR(data.value)}</p>
                  <Badge 
                    className={`${
                      data.booked > 0 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400'
                        : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {data.count > 0 ? Math.round((data.booked / data.count) * 100) : 0}% occupied
                  </Badge>
                </div>
              </div>
            ))}
            {Object.keys(typeData).length === 0 && (
              <p className="text-kaki-grey text-center py-4">No type data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="bg-kaki-dark-grey border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance Insights
          </CardTitle>
          <CardDescription className="text-kaki-grey">
            Key metrics and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hoardings.length === 0 ? (
            <p className="text-kaki-grey text-center py-8">
              No hoardings data available. Add some hoardings to see analytics.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium">Top Performing Regions</h4>
                {Object.entries(regionData)
                  .sort(([, a], [, b]) => b.value - a.value)
                  .slice(0, 3)
                  .map(([region, data], index) => (
                    <div key={region} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-400">#{index + 1}</span>
                        <span className="text-white">{region}</span>
                      </div>
                      <span className="text-kaki-grey">{formatINR(data.value)}</span>
                    </div>
                  ))}
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white font-medium">Recommendations</h4>
                <div className="space-y-2">
                  {analytics.occupancyRate < 50 && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400 text-sm">
                        <strong>Low Occupancy:</strong> Consider reducing prices or improving visibility for available spaces.
                      </p>
                    </div>
                  )}
                  {analytics.occupancyRate > 80 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-sm">
                        <strong>High Occupancy:</strong> Great performance! Consider expanding to new regions.
                      </p>
                    </div>
                  )}
                  {analytics.avgPrice < 30000 && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-400 text-sm">
                        <strong>Pricing Opportunity:</strong> Your average price is below market rate. Consider premium pricing for high-traffic locations.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
