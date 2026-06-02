import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  ArrowRight,
  Search,
  Share2,
  Target,
  Video,
  Code,
  Palette,
  Info,
  Users,
  Sparkles,
  BookOpen,
  Briefcase,
  MapPin
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

  const isBlogPage = location.pathname.startsWith('/blogs');
  const textColorClass = isBlogPage ? 'text-gray-900' : 'text-white';
  const navBgClass = isBlogPage 
    ? (isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 py-4' : 'bg-transparent py-6')
    : (isScrolled ? 'glass-effect py-4' : 'bg-transparent py-6');
  const mobileMenuBgClass = isBlogPage ? 'bg-kaki-dark-grey border border-white/10 shadow-2xl' : 'glass-effect';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom navItem mapping removed to support manual dropdown structuring.

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
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBgClass}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className={`flex items-center space-x-3 hover:opacity-80 transition-opacity ${textColorClass}`}>
            <img
              src={logo}
              alt="KAKI"
              className={`h-8 w-auto ${isBlogPage ? 'invert' : ''}`}
            />
            <span className="text-xl font-bold tracking-wider">KAKI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:text-purple-400 ${isActive('/') ? 'text-purple-400' : textColorClass
                }`}
            >
              Home
            </Link>

            {/* Solutions Hover Dropdown */}
            <div className="relative group py-2">
              <button className={`flex items-center space-x-1 text-sm font-bold uppercase tracking-wider ${textColorClass} hover:text-purple-400 focus:outline-none transition-colors`}>
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Solutions Dropdown Content */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[320px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 bg-kaki-dark-grey border border-white/10 text-white p-3 shadow-2xl rounded-2xl before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
                {/* Services Heading */}
                <div className="px-4 pt-2 pb-2 text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 border-b border-white/5 mb-2">
                  SERVICES
                </div>

                <Link
                  to="/services/seo-geo"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200 group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover/item:bg-purple-500/20 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <path d="M8 13l2-2 2 2 3-3"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-wide">SEO Services</span>
                </Link>
                <Link
                  to="/services/social-media-marketing"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200 group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover/item:bg-purple-500/20 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      <path d="M21 3h-3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1l1.5 1.5V7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-wide">Social Media Marketing</span>
                </Link>
                <Link
                  to="/services/paid-advertising"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200 group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover/item:bg-purple-500/20 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-wide">Paid Advertising</span>
                </Link>
                <Link
                  to="/services/video-marketing"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200 group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover/item:bg-purple-500/20 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <polygon points="10 9 15 12 10 15 10 9" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-wide">Video Marketing</span>
                </Link>
                <Link
                  to="/services/web-development"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200 group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover/item:bg-purple-500/20 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-wide">Web Development</span>
                </Link>
                <Link
                  to="/services/graphic-design"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200 group/item"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover/item:bg-purple-500/20 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-wide">Graphic Design</span>
                </Link>
              </div>
            </div>


            {/* KAKI Hover Dropdown */}
            <div className="relative group py-2">
              <button className={`flex items-center space-x-1 text-sm font-bold uppercase tracking-wider ${textColorClass} hover:text-purple-400 focus:outline-none transition-colors`}>
                <span>Kaki</span>
                <ChevronDown className="w-4 h-4 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* KAKI Dropdown Content */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 bg-kaki-dark-grey border border-white/10 text-white p-2 shadow-2xl rounded-2xl before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">About Us</span>
                </Link>
                <Link
                  to="/team"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Team</span>
                </Link>
                <Link
                  to="/life-at-kaki"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Life at KAKI</span>
                </Link>
                <Link
                  to="/hoardings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Hoardings</span>
                </Link>
                <Link
                  to="/blogs"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Blog</span>
                </Link>
                <Link
                  to="/works"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/10 text-white hover:text-purple-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Works</span>
                </Link>
              </div>
            </div>

            {/* Contact Link */}
            <Link
              to="/contact"
              className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:text-purple-400 ${isActive('/contact') ? 'text-purple-400' : textColorClass
                }`}
            >
              Contact
            </Link>

            {/* GET IN TOUCH Button */}
            {/* <Button
              asChild
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 px-5 py-2 rounded-xl text-xs font-bold tracking-wider flex items-center space-x-1 bg-transparent"
            >
              <Link to="/contact">
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button> */}

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
              <div className={`w-6 h-0.5 transition-all duration-300 ${isBlogPage ? 'bg-gray-900' : 'bg-kaki-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`} />
              <div className={`w-6 h-0.5 transition-all duration-300 ${isBlogPage ? 'bg-gray-900' : 'bg-kaki-white'} ${isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
              <div className={`w-6 h-0.5 transition-all duration-300 ${isBlogPage ? 'bg-gray-900' : 'bg-kaki-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`} />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-6 ${mobileMenuBgClass} rounded-lg p-6 animate-fade-in max-h-[80vh] overflow-y-auto`}>
            <Link
              to="/"
              className={`block py-3 text-base font-semibold uppercase tracking-wider ${isActive('/') ? 'text-purple-400' : 'text-white hover:text-purple-400'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Solutions for Mobile */}
            <div className="py-2 border-t border-white/5">
              <span className="text-xs font-bold text-kaki-grey uppercase tracking-wider">Solutions</span>
              <div className="pl-4 mt-2 space-y-3">
                <Link to="/services/seo-geo" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>SEO Services</Link>
                <Link to="/services/social-media-marketing" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Social Media Marketing</Link>
                <Link to="/services/paid-advertising" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Paid Advertising</Link>
                <Link to="/services/video-marketing" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Video Marketing</Link>
                <Link to="/services/web-development" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Web Development</Link>
                <Link to="/services/graphic-design" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Graphic Design</Link>
              </div>
            </div>

            {/* Kaki for Mobile */}
            <div className="py-2 border-t border-white/5">
              <span className="text-xs font-bold text-kaki-grey uppercase tracking-wider">Kaki</span>
              <div className="pl-4 mt-2 space-y-3">
                <Link to="/about" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <Link to="/team" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Team</Link>
                <Link to="/life-at-kaki" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Life at KAKI</Link>
                <Link to="/hoardings" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Hoardings</Link>
                <Link to="/blogs" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                <Link to="/works" className="block text-sm font-medium text-white hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Works</Link>
              </div>
            </div>

            {/* Contact for Mobile */}
            <Link
              to="/contact"
              className={`block py-3 text-base font-semibold uppercase tracking-wider border-t border-white/5 ${isActive('/contact') ? 'text-purple-400' : 'text-white hover:text-purple-400'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

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
