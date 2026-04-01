import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface AvailabilityCalendarProps {
  onDateSelect?: (dates: { startDate: string; endDate: string }) => void;
  selectedDates?: { startDate: string; endDate: string };
  availabilityData?: Array<{ date: string; status: 'available' | 'limited' | 'booked' }>;
  isEditingMode?: boolean;
}

export const AvailabilityCalendar = ({ onDateSelect, selectedDates, availabilityData, isEditingMode = false }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [rangeStart, setRangeStart] = useState<string | null>(null);

  // Get availability from provided data or fallback to mock
  const getAvailabilityForDate = (date: Date) => {
    const dateStr = formatDate(date);
    
    // Use provided availability data if available
    if (availabilityData) {
      const availability = availabilityData.find(a => a.date === dateStr);
      if (availability) {
        return availability.status;
      }
      // If date is not explicitly marked, leave it neutral
      return 'none';
    }
    
    return 'none';
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const parseDateString = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: Date) => {
    // Use local date instead of UTC to avoid date shifting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateInRange = (date: string) => {
    if (!selectedDates?.startDate || !selectedDates?.endDate) return false;
    return date >= selectedDates.startDate && date <= selectedDates.endDate;
  };

  const isDateSelected = (date: string) => {
    return date === selectedDates?.startDate || date === selectedDates?.endDate;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    const availability = getAvailabilityForDate(date);
    
    if (availability === 'booked' && !isEditingMode) return;

    if (!rangeStart) {
      setRangeStart(dateStr);
      onDateSelect?.({ startDate: dateStr, endDate: dateStr });
    } else {
      const start = parseDateString(rangeStart);
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (end < start) {
        // Swap dates if end is before start
        onDateSelect?.({ 
          startDate: formatDate(end), 
          endDate: formatDate(start) 
        });
      } else {
        onDateSelect?.({ 
          startDate: formatDate(start), 
          endDate: formatDate(end) 
        });
      }
      setRangeStart(null);
    }
  };

  const handleDateHover = (date: Date) => {
    const dateStr = formatDate(date);
    const availability = getAvailabilityForDate(date);
    
    if (availability === 'booked' && !isEditingMode) {
      setHoveredDate(null);
    } else if (rangeStart) {
      setHoveredDate(dateStr);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = formatDate(date);
      const availability = getAvailabilityForDate(date);
      const isSelected = isDateSelected(dateStr);
      const isInRange = isDateInRange(dateStr);
      const isHovered = hoveredDate && rangeStart && 
        ((new Date(hoveredDate) >= new Date(rangeStart) && new Date(hoveredDate) <= date) ||
         (new Date(hoveredDate) <= new Date(rangeStart) && new Date(hoveredDate) >= date));

      let className = "h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all border border-transparent ";
      
      // Selection always takes highest visual priority so user knows what they clicked
      if (isSelected) {
        className += "ring-2 ring-purple-500 ring-offset-2 ring-offset-kaki-dark-grey bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 ";
      } else if (isInRange || isHovered) {
        className += "bg-purple-500/30 border-purple-500/50 text-purple-200 ";
      } else if (availability === 'booked') {
        className += "bg-red-500/40 text-red-400 hover:bg-red-500/50 ";
        if (!isEditingMode) className += "cursor-not-allowed ";
      } else if (availability === 'limited') {
        className += "bg-yellow-500/40 text-yellow-400 hover:bg-yellow-500/50 ";
      } else if (availability === 'available') {
        className += "bg-green-500/40 text-green-400 hover:bg-green-500/50 ";
      } else {
        className += "bg-white/5 text-kaki-grey hover:bg-white/10 hover:text-white ";
      }

      days.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => handleDateHover(date)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-kaki-dark-grey/50 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-purple-400" />
          Availability Calendar
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeMonth(-1)}
            className="text-kaki-grey hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white font-medium min-w-[150px] text-center">
            {monthYear}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeMonth(1)}
            className="text-kaki-grey hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/40 border border-green-500 rounded"></div>
          <span className="text-white">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500/40 border border-yellow-500 rounded"></div>
          <span className="text-white">Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/40 border border-red-500 rounded"></div>
          <span className="text-white">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 border border-purple-500 rounded"></div>
          <span className="text-white">Selected</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-purple-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Selection Info */}
      {selectedDates?.startDate && selectedDates?.endDate && (
        <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
          <div className="text-sm text-kaki-grey mb-2">Selected Date Range:</div>
          <div className="text-white font-medium">
            {new Date(selectedDates.startDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })} - {new Date(selectedDates.endDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
          <div className="text-xs text-purple-400 mt-1">
            {Math.ceil((new Date(selectedDates.endDate).getTime() - new Date(selectedDates.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-kaki-grey">
        Click on available dates to select your campaign dates. Green dates are fully available, yellow dates have limited availability, and red dates are already booked.
      </div>
    </div>
  );
};
