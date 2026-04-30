import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHoardings, type Hoarding } from "@/data/hoardings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/ContactForm";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { ImageGallery } from "@/components/ImageGallery";
import { 
  ArrowLeft, 
  MapPin, 
  Maximize2, 
  Square,
  CheckCircle,
  Clock,
  Eye, 
  Calendar,
  Phone,
  Mail,
  Users,
  DollarSign,
  Check,
  Star,
  Zap
} from "lucide-react";
import { formatINR } from "@/utils/currency";
import { API_BASE_URL } from "@/config";

export const HoardingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [hoarding, setHoarding] = useState<Hoarding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ startDate: string; endDate: string } | null>(null);
  const [availabilityData, setAvailabilityData] = useState<Array<{ date: string; status: 'available' | 'limited' | 'booked' }>>([]);

  useEffect(() => {
    const loadHoarding = async () => {
      try {
        setIsLoading(true);
        const hoardings = await fetchHoardings();
        // Use == instead of === to be resilient to string vs number IDs if they slip through
        const foundHoarding = hoardings.find(h => h.id == id);
        
        if (foundHoarding) {
          setHoarding(foundHoarding);
          // Load availability data for this hoarding
          await loadAvailability(foundHoarding.id);
        } else {
          // Hoarding not found, redirect back to listings
          navigate("/hoardings");
        }
      } catch (error) {
        console.error("Failed to load hoarding:", error);
        navigate("/hoardings");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadHoarding();
    }
  }, [id, navigate]);

  const loadAvailability = async (hoardingId: string) => {
    try {
      console.log('Loading availability for hoarding:', hoardingId);
      const response = await fetch(`${API_BASE_URL}/api/hoardings/${hoardingId}/availability`);
      if (response.ok) {
        const result = await response.json();
        console.log('Availability data loaded:', result.data);
        setAvailabilityData(result.data || []);
      } else {
        console.error('Failed to load availability:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const handleBookNow = () => {
    if (selectedDates) {
      setIsContactFormOpen(true);
    }
  };

  const handleGoBack = () => {
    navigate("/hoardings");
  };

  const handleDateSelect = (dates: { startDate: string; endDate: string }) => {
    setSelectedDates(dates);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaki-black pt-32 pb-20">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-white/5 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hoarding) {
    return (
      <div className="min-h-screen bg-kaki-black pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Hoarding not found</h1>
          <Button onClick={handleGoBack} className="bg-purple-600 hover:bg-purple-700">
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-kaki-black pt-32 pb-20">
        <div className="container-custom">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="mb-8 text-kaki-grey hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <div className="space-y-6">
              <ImageGallery
                images={hoarding.images || []}
                primaryImage={hoarding.imageUrl}
                title={hoarding.title}
              />
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {hoarding.title}
                </h1>
                <div className="flex items-center text-kaki-grey mb-6">
                  <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                  <span className="text-lg">{hoarding.location}</span>
                </div>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <Maximize2 className="w-5 h-5 mr-2 text-pink-400" />
                    <span className="text-white font-medium">Dimensions</span>
                  </div>
                  <p className="text-kaki-grey">{hoarding.dimensions}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <Square className="w-5 h-5 mr-2 text-orange-400" />
                    <span className="text-white font-medium">Total Area</span>
                  </div>
                  <p className="text-kaki-grey">{hoarding.totalSqft} sqft</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    <span className="text-white font-medium">Impressions</span>
                  </div>
                  <p className="text-kaki-grey">{hoarding.impressions}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <Eye className="w-5 h-5 mr-2 text-green-400" />
                    <span className="text-white font-medium">Visibility</span>
                  </div>
                  <p className="text-kaki-grey">{hoarding.visibility || "High Traffic Area"}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    <span className="text-white font-medium">Lighting</span>
                  </div>
                  <p className="text-kaki-grey">{hoarding.lightingType || "Non-Lit"}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Pricing Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-kaki-grey">Display Cost (per month)</span>
                    <span className="text-white font-semibold">{formatINR(hoarding.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-kaki-grey">Printing Charges</span>
                    <span className="text-white font-semibold">{formatINR(hoarding.printingCharges)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-kaki-grey">Mounting Charges</span>
                    <span className="text-white font-semibold">{formatINR(hoarding.mountingCharges)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Total Investment</span>
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        {formatINR(hoarding.totalCharges)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Information */}
              {(hoarding.availableStartDate || hoarding.availableEndDate) && (
                <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Availability Period
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-kaki-grey">Available From</span>
                      <span className="text-white font-semibold">
                        {hoarding.availableStartDate ? new Date(hoarding.availableStartDate).toLocaleDateString() : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-kaki-grey">Available Until</span>
                      <span className="text-white font-semibold">
                        {hoarding.availableEndDate ? new Date(hoarding.availableEndDate).toLocaleDateString() : 'Ongoing'}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="flex items-center gap-2 text-blue-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>
                          {hoarding.availableStartDate && hoarding.availableEndDate 
                            ? `Available for ${Math.ceil((new Date(hoarding.availableEndDate).getTime() - new Date(hoarding.availableStartDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                            : 'Flexible booking period'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Availability Calendar */}
              <div>
                {availabilityData.length === 0 && !isLoading ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center animate-pulse">
                    <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <p className="text-kaki-grey text-sm">Loading detailed availability...</p>
                  </div>
                ) : (
                  <AvailabilityCalendar 
                    onDateSelect={handleDateSelect}
                    selectedDates={selectedDates}
                    availabilityData={availabilityData}
                  />
                )}
              </div>

              {/* Map Section */}
              {hoarding.mapHtml && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    Exact Location
                  </h3>
                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-white/10 map-container group relative">
                    <style>{`
                      .map-container iframe {
                        width: 100% !important;
                        height: 100% !important;
                        border: 0 !important;
                      }
                    `}</style>
                    {hoarding.mapHtml.includes('<iframe') ? (
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: hoarding.mapHtml }} />
                    ) : (
                      <div className="w-full h-full relative">
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          src={(() => {
                            const input = hoarding.mapHtml;
                            if (!input) return "";
                            
                            // Try to extract place name from Google Maps URL (/place/Name)
                            const placeMatch = input.match(/\/place\/([^\/\?#]+)/);
                            if (placeMatch && placeMatch[1]) {
                              return `https://maps.google.com/maps?q=${placeMatch[1]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                            }
                            
                            // Try to extract coordinates from Google Maps URL (@lat,lng)
                            const coordMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                            if (coordMatch && coordMatch[1] && coordMatch[2]) {
                              return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                            }
                            
                            // Fallback to searching for the raw input (works for addresses, names, etc.)
                            return `https://maps.google.com/maps?q=${encodeURIComponent(input)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                          })()}
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                        <div className="absolute bottom-4 right-4">
                          <Button 
                            size="sm"
                            onClick={() => {
                              let url = hoarding.mapHtml;
                              if (url && !url.startsWith('http')) url = 'https://' + url;
                              window.open(url || '', '_blank');
                            }}
                            className="bg-black/60 hover:bg-black/80 text-white border border-white/10 text-[10px] h-7 backdrop-blur-sm px-3"
                          >
                            Open in Full Maps
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center text-kaki-grey">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    <span>Premium location with high foot traffic</span>
                  </div>
                  <div className="flex items-center text-kaki-grey">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    <span>Excellent visibility from main road</span>
                  </div>
                  <div className="flex items-center text-kaki-grey">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    <span>Illuminated display for night visibility</span>
                  </div>
                  <div className="flex items-center text-kaki-grey">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                    <span>Professional mounting and maintenance</span>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 text-lg font-semibold"
                  disabled={!selectedDates}
                >
                  {selectedDates ? (hoarding.status === 'Booked' ? 'Book Available Slots' : 'Book This Space') : 'Select Dates to Book'}
                </Button>
                {!selectedDates ? (
                  <p className="text-center text-sm text-kaki-grey mt-2">
                    Please select your campaign dates from calendar above
                  </p>
                ) : (
                  <p className="text-center text-sm text-yellow-500/80 mt-2">
                    {hoarding.status === 'Limited' && 'Availability is limited for this hoarding.'}
                    {availabilityData.some(a => a.status === 'booked') && 'This hoarding has existing bookings. You can book the remaining dates.'}
                  </p>
                )}
                <div className="flex items-center justify-center gap-6 text-sm text-kaki-grey mt-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>advertising@kaki.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <ContactForm
          hoarding={hoarding}
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
          selectedDates={selectedDates}
        />
      )}
    </>
  );
};

export default HoardingDetail;
