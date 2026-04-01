import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const BillboardAd = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [countdown, setCountdown] = useState(5);


  useEffect(() => {
    // skip if on dashboard or admin pages
    if (location.pathname.startsWith('/admin') || location.pathname === '/dashboard') return;
    
    let interval: NodeJS.Timeout;

    const showTimer = setTimeout(() => {
      setIsRendered(true);
      setTimeout(() => {
        setIsVisible(true);
        // Start countdown once visible
        interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 50);
    }, 2500);

    // Auto-close after countdown + initial display time
    // We remove the auto-close to force the user to interact or wait for the "Skip" to be available
    /*
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 10500);
    */

    return () => {
      clearTimeout(showTimer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 500); // Wait for transition
  };

  if (!isRendered || location.pathname.startsWith('/admin') || location.pathname === '/dashboard') return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ease-in-out ${isVisible ? "bg-black/80 backdrop-blur-sm opacity-100" : "bg-transparent opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`relative w-full max-w-5xl md:h-[600px] max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden bg-gradient-to-br from-kaki-dark-grey to-kaki-black border border-white/10 rounded-3xl shadow-3xl transform transition-all duration-500 delay-100 ${isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-8 opacity-0"
          }`}
      >
        {/* Close/Skip Button */}
        {countdown === 0 ? (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-[9999] px-3 py-1.5 md:px-4 md:py-2 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors flex items-center text-sm md:text-base font-medium cursor-pointer shadow-lg"
            aria-label="Close Ad"
          >
            <span>Skip</span>
            <X className="w-3 h-3 md:w-4 md:h-4 ml-1.5 md:ml-2 gap-2" />
          </button>
        ) : (
          <div
            className="absolute top-3 right-3 md:top-4 md:right-4 z-[9999] px-3 py-1.5 md:px-4 md:py-2 bg-black/40 text-white/70 rounded-full backdrop-blur-md flex items-center text-sm md:text-base font-medium cursor-not-allowed select-none"
            aria-label={`Skip in ${countdown}`}
          >
            <span>Skip in {countdown}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-[45%] relative min-h-[200px] sm:min-h-[300px] md:min-h-0 md:h-full">
            <img
              src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80"
              alt="Billboard Advertising"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kaki-black to-transparent md:bg-gradient-to-r md:from-transparent md:to-kaki-black z-10" />
            <div className="absolute inset-0 bg-purple-900/40 mix-blend-overlay z-10" />

            {/* Overlay Text on Image for Mobile */}
            <div className="absolute bottom-6 left-6 z-20 md:hidden">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-purple-300 uppercase bg-black/50 backdrop-blur-md rounded-full border border-purple-500/20">
                Featured
              </div>
            </div>
          </div>

          <div className="md:w-[55%] p-6 sm:p-10 md:p-12 flex flex-col justify-center relative z-20 bg-kaki-black md:bg-transparent overflow-y-auto">
            <div className="hidden md:inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-purple-300 uppercase bg-purple-900/30 border border-purple-500/20 rounded-full w-fit">
              Featured Service
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
              Dominate the Streets with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">KAKI Billboards</span>
            </h2>
            <p className="text-kaki-grey mb-6 sm:mb-8 md:mb-8 text-base sm:text-lg md:text-lg leading-relaxed">
              Get premium billboard placements in prime locations. Maximize your brand's offline visibility today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-4 mt-auto md:mt-0">
              <Button asChild onClick={(e) => { e.preventDefault(); handleClose(); setTimeout(() => window.location.href = '/contact', 500); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-900/20 w-full sm:w-auto px-6 py-5 md:px-8 md:py-6 text-base md:text-lg">
                <Link to="/contact" className="flex items-center justify-center w-full">
                  Book Now <ExternalLink className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Link>
              </Button>
              {countdown === 0 ? (
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="border-white/20 text-white w-full sm:w-auto px-6 py-5 md:px-8 md:py-6 text-base md:text-lg transition-all hover:bg-white/10 z-[9999]"
                >
                  Maybe Later
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillboardAd;
