import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  ChevronDown,
  User,
  LogOut
} from "lucide-react";
import logo from '../assets/logos/logo-no-bg.png';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Works', path: '/works' },
    { name: 'Hoardings', path: '/hoardings' },
    { name: 'Blog', path: '/blogs' },
    { name: 'Team', path: '/team' },
    { name: 'Life at KAKI', path: '/life-at-kaki' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Determine what to show in the auth section
  const getAuthSection = () => {
    if (user) {
      return (
        <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
          <div className="flex items-center space-x-2 text-green-400">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'glass-effect py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src={logo}
              alt="KAKI" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold tracking-wider">KAKI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-kaki-grey relative ${
                  isActive(item.path) ? 'text-kaki-white' : 'text-kaki-grey'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-kaki-white rounded-full" />
                )}
              </Link>
            ))}
            
            {/* Auth Section */}
            {getAuthSection()}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="flex flex-col space-y-1">
              <div className={`w-6 h-0.5 bg-kaki-white transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`} />
              <div className={`w-6 h-0.5 bg-kaki-white transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <div className={`w-6 h-0.5 bg-kaki-white transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`} />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-6 glass-effect rounded-lg p-6 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-3 text-base font-medium transition-colors ${
                  isActive(item.path) ? 'text-kaki-white' : 'text-kaki-grey hover:text-kaki-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section for Mobile */}
            <div className="border-t border-white/20 pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-2 text-green-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">{user?.name || 'User'}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
