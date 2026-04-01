import { useState, useEffect } from 'react';
import logo from '../assets/logos/logo-no-bg.png';
import { useAuth } from '@/contexts/AuthContext';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { isAuthenticated } = useAuth();
  const [hasFinishedOnce, setHasFinishedOnce] = useState(false);

  useEffect(() => {
    // If already authenticated and we've already shown the loader once, 
    // let's skip it to speed up the dashboard experience
    if (isAuthenticated && progress > 50) {
      setProgress(100);
      setIsLoading(false);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          setHasFinishedOnce(true);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-kaki-black">
      <div className="text-center">
        <div className="mb-8 animate-logo-float">
          <img 
            src={logo} 
            alt="KAKI Logo" 
            className="h-28 w-auto mx-auto"
          />
        </div>
        
        <div className="w-64 h-1 bg-kaki-grey/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-kaki-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="mt-4 text-kaki-grey text-sm font-light tracking-wider">
          LOADING EXCELLENCE
        </p>
      </div>
    </div>
  );
};

export default Preloader;
