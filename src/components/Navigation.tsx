import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import logo from '../assets/logos/logo-no-bg.png';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="ml-4 pl-4 border-l border-white/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 px-3 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 mr-1">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold max-w-[120px] truncate">{user?.name || 'User'}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-kaki-dark-grey border border-white/10 text-white w-56 p-1 mt-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200" 
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="px-3 py-2 text-kaki-grey text-[10px] font-bold uppercase tracking-[0.2em]">
                Provider Management
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-1 my-1" />
              
              <DropdownMenuItem 
                onClick={() => navigate('/dashboard')}
                className="rounded-md px-3 py-3 focus:bg-green-500/10 hover:bg-green-500/10 cursor-pointer flex items-center gap-3 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                   <LayoutDashboard className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Dashboard</span>
                  <span className="text-[10px] text-kaki-grey">Manage inventory & inquiries</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/5 mx-1 my-1" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-md px-3 py-2.5 text-red-400 focus:bg-red-500/10 hover:bg-red-500/10 cursor-pointer flex items-center gap-3 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <div className="border-t border-white/10 pt-4 mt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <User className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white leading-none">{user?.name || 'User'}</span>
                      <span className="text-[10px] text-kaki-grey mt-1 uppercase tracking-wider">Provider Account</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start text-green-400 hover:text-green-300 hover:bg-green-500/10 h-12 px-4 rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-12 px-4 rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-2 pb-2">
                  <Button 
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl shadow-lg shadow-purple-500/20 font-bold"
                  >
                    Sign In / Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
