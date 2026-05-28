import { Link } from 'react-router-dom';
import logo from '../assets/logos/logo-no-bg.png';
import { Instagram, Youtube, Facebook, ArrowUp } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-kaki-black border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-85 transition-opacity inline-flex">
              <img 
                src={logo}
                alt="KAKI" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold tracking-wider text-white">KAKI</span>
            </Link>
            <p className="text-kaki-grey text-base leading-relaxed max-w-sm">
              A creative marketing agency helping brands grow through strategy, content, design, and performance marketing.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/kaki_marketing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-kaki-grey hover:text-purple-400 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@kaki9139" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-kaki-grey hover:text-purple-400 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/KAKIMarketing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-kaki-grey hover:text-purple-400 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/KAKImarketing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-kaki-grey hover:text-purple-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services/seo" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  SEO Services
                </Link>
              </li>
              <li>
                <Link to="/services/social-media" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Social Media Marketing
                </Link>
              </li>
              <li>
                <Link to="/services/paid-advertising" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Paid Advertising
                </Link>
              </li>
              <li>
                <Link to="/services/video-marketing" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Video Marketing
                </Link>
              </li>
              <li>
                <Link to="/services/web-development" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services/graphic-design" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Graphic Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/works" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/life-at-kaki" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Life At KAKI
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/terms-conditions" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-kaki-grey hover:text-purple-400 text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-kaki-grey text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} KAKI. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 text-kaki-grey hover:text-white transition-all duration-300 hover:scale-105"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
