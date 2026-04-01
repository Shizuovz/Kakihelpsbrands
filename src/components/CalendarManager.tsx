import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { Calendar as CalendarIcon, Save, MapPin } from 'lucide-react';
import { Hoarding } from '@/data/hoardings';

interface CalendarManagerProps {
  hoardings: Hoarding[];
}

export const CalendarManager = ({ hoardings }: CalendarManagerProps) => {
  const [selectedHoardingId, setSelectedHoardingId] = useState<string>('');
  const [availabilityData, setAvailabilityData] = useState<Array<{date: string, status: 'available' | 'limited' | 'booked'}>>([]);
  const [selectedRange, setSelectedRange] = useState<{startDate: string, endDate: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedHoardingId) {
      loadAvailability(selectedHoardingId);
    } else {
      setAvailabilityData([]);
      setSelectedRange(null);
    }
  }, [selectedHoardingId]);

  const loadAvailability = async (hoardingId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/hoardings/${hoardingId}/availability`);
      if (response.ok) {
        const result = await response.json();
        setAvailabilityData(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDateRangeStatus = (status: 'available' | 'limited' | 'booked') => {
    if (!selectedRange?.startDate || !selectedRange?.endDate) return;
    
    // Create an entirely new array of deeply cloned objects
    const newAvailability = availabilityData.map(a => ({ ...a }));
    
    // Parse dates (carefully splitting strings to avoid JS timezone shifts on midnight parsing)
    const [startYear, startMonth, startDay] = selectedRange.startDate.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    
    const [endYear, endMonth, endDay] = selectedRange.endDate.split('-').map(Number);
    const end = new Date(endYear, endMonth - 1, endDay);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const existingIndex = newAvailability.findIndex(a => a.date === dateStr);
      if (existingIndex > -1) {
        newAvailability[existingIndex].status = status;
      } else {
        newAvailability.push({ date: dateStr, status });
      }
    }
    
    // State update triggers re-render and clears the actively purple selected block so user can see what they just painted
    setAvailabilityData(newAvailability);
    setSelectedRange(null);
  };

  const handleSave = async () => {
    if (!selectedHoardingId) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:3001/api/hoardings/${selectedHoardingId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ availability: availabilityData }),
      });
      
      if (response.ok) {
        alert('Calendar availability saved successfully!');
      } else {
        throw new Error('Failed to save calendar data');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save calendar availability.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedHoarding = hoardings.find(h => h.id === selectedHoardingId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Calendar Management</h2>
          <p className="text-kaki-grey mt-1">Select a property to manage its detailed availability calendar</p>
        </div>
        
        <div className="w-full md:w-72">
          <Select value={selectedHoardingId} onValueChange={setSelectedHoardingId}>
            <SelectTrigger className="bg-black/40 border-white/10 text-white">
              <SelectValue placeholder="Select a hoarding..." />
            </SelectTrigger>
            <SelectContent className="bg-kaki-dark-grey border-white/10">
              {hoardings.map(hoarding => (
                <SelectItem key={hoarding.id} value={hoarding.id || 'err'} className="focus:bg-purple-900/40 focus:text-white">
                  {hoarding.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedHoardingId && selectedHoarding ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Controller Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                  Interactive Calendar
                </CardTitle>
                <CardDescription className="text-kaki-grey text-xs lg:text-sm">
                  Click a start and end block to select a range. Then, mark its status using the Action Panel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center animate-pulse text-kaki-grey">Loading primary calendar...</div>
                ) : (
                  <div className="rounded-xl overflow-hidden">
                    <AvailabilityCalendar 
                      isEditingMode={true}
                      availabilityData={availabilityData}
                      onDateSelect={(dates) => setSelectedRange(dates)}
                      selectedDates={selectedRange || undefined}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action / Sidebar Panel */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedHoarding.imageUrl && (
                  <img src={selectedHoarding.imageUrl} alt={selectedHoarding.title} className="w-full h-32 object-cover rounded-lg border border-white/5" />
                )}
                <div>
                  <h4 className="text-white font-medium text-lg leading-tight">{selectedHoarding.title}</h4>
                  <div className="flex items-center text-kaki-grey text-sm mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedHoarding.location}, {selectedHoarding.region}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-br ${selectedRange ? 'from-purple-900/20 to-blue-900/20 border-purple-500/30' : 'from-white/5 to-white/5 border-white/10'}`}>
              <CardHeader>
                <CardTitle className="text-white text-lg">Action Panel</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedRange ? (
                  <p className="text-kaki-grey text-sm italic">
                    Select a date range on the calendar to mark its availability...
                  </p>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                      <p className="text-xs text-kaki-grey mb-1">Selected Range:</p>
                      <p className="text-sm text-white font-medium">
                        {new Date(selectedRange.startDate).toLocaleDateString()} - {new Date(selectedRange.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-kaki-grey mb-2">Mark range as:</p>
                      <Button 
                        onClick={() => updateDateRangeStatus('available')} 
                        className="w-full bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 justify-start"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                        Available
                      </Button>
                      <Button 
                        onClick={() => updateDateRangeStatus('limited')} 
                        className="w-full bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-500/30 justify-start"
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
                        Limited
                      </Button>
                      <Button 
                        onClick={() => updateDateRangeStatus('booked')} 
                        className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 justify-start"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                        Booked
                      </Button>
                    </div>
                  </div>
                )}
                
                <hr className="border-white/10 my-6" />
                
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving Calendar...' : 'Save Calendar Updates'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/5 border-dashed rounded-2xl">
          <CalendarIcon className="w-16 h-16 text-white/20 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Hoarding Selected</h3>
          <p className="text-kaki-grey max-w-md text-center">
            Select one of your registered properties from the dropdown menu above to manage its availability calendar.
          </p>
        </div>
      )}
    </div>
  );
};
