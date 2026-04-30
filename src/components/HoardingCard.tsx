import { Hoarding } from "@/data/hoardings";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize2, Users, ArrowRight, Square } from "lucide-react";
import { formatINR } from "@/utils/currency";
import { useNavigate } from "react-router-dom";

interface HoardingCardProps {
  hoarding: Hoarding;
}

export const HoardingCard = ({ hoarding }: HoardingCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/hoardings/${hoarding.id}`);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/hoardings/${hoarding.id}`);
  };

  return (
    <>
      <div 
        className="group relative bg-kaki-dark-grey rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-kaki-dark-grey to-transparent z-10" />
          <img 
            src={hoarding.imageUrl || (hoarding.images && hoarding.images.length > 0 ? hoarding.images[0] : '')} 
            alt={hoarding.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              // Fallback to a generated image if the uploaded image fails to load
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('picsum.photos')) {
                target.src = `https://picsum.photos/seed/${hoarding.title.replace(/\s+/g, '-')}/800/600.jpg`;
              }
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <span className="px-3 py-1 text-xs font-semibold bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white shadow-lg">
              {hoarding.type}
            </span>
            {hoarding.lightingType && (
              <span className={`px-3 py-1 text-xs font-semibold backdrop-blur-md rounded-full border shadow-lg ${
                hoarding.lightingType === 'Lit' 
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' 
                  : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
              }`}>
                {hoarding.lightingType}
              </span>
            )}
          </div>
          
          <div className="absolute top-4 right-4 z-20">
            <span className={`px-3 py-1 text-xs font-semibold backdrop-blur-md rounded-full border ${
              hoarding.status === 'Available' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                : hoarding.status === 'Limited'
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                  : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}>
              {hoarding.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-6 relative z-20">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {hoarding.title}
          </h3>
          
          <div className="flex items-center text-kaki-grey mb-4">
            <MapPin className="w-4 h-4 mr-1.5 text-purple-400" />
            <span className="text-sm truncate">{hoarding.location}</span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-sm text-kaki-grey bg-white/5 p-2 rounded-lg">
              <Maximize2 className="w-4 h-4 mr-2 text-pink-400" />
              <span>{hoarding.dimensions}</span>
            </div>
            <div className="flex items-center text-sm text-kaki-grey bg-white/5 p-2 rounded-lg">
              <Square className="w-4 h-4 mr-2 text-orange-400" />
              <span>{hoarding.totalSqft} sqft</span>
            </div>
            <div className="flex items-center text-sm text-kaki-grey bg-white/5 p-2 rounded-lg">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              <span className="truncate">{hoarding.impressions}</span>
            </div>
            <div className="flex items-center text-sm text-kaki-grey bg-white/5 p-2 rounded-lg">
              <span className="text-xs font-semibold text-green-400">
                +₹{hoarding.printingCharges.toLocaleString('en-IN')} setup
              </span>
            </div>
          </div>

          {/* Additional Cost Breakdown */}
          <div className="bg-white/5 rounded-lg p-3 mb-6">
            <div className="text-xs text-kaki-grey space-y-1">
              <div className="flex justify-between">
                <span>Display Cost:</span>
                <span className="text-white">{formatINR(hoarding.price)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span>Printing:</span>
                <span className="text-white">{formatINR(hoarding.printingCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mounting:</span>
                <span className="text-white">{formatINR(hoarding.mountingCharges)}</span>
              </div>
              <div className="border-t border-white/10 pt-1 mt-1 flex justify-between">
                <span className="font-semibold text-white">Total:</span>
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {formatINR(hoarding.totalCharges)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer/Action */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-kaki-grey block mb-0.5">Starting from</span>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                {formatINR(hoarding.price)}
              </span>
              <span className="text-xs text-kaki-grey ml-1">/ mo</span>
            </div>
            
            {/* Book Now button */}
            <Button 
              className="rounded-full w-10 h-10 p-0 bg-white/10 hover:bg-purple-600 text-white border border-white/10 hover:border-transparent transition-all group-hover:w-auto group-hover:px-4"
              disabled={hoarding.status === 'Booked'}
              onClick={handleBookNow}
            >
              <span className="hidden group-hover:inline-block mr-2 text-sm">
                {hoarding.status === 'Booked' ? 'Waitlist' : 'Book Now'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

    </>
  );
};
