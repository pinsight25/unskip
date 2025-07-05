
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, Facebook, Twitter, Instagram, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-gray-900">CarVibe</span>
                <span className="text-xs text-gray-600 font-medium mt-0.5">Good Vibes, Fair Deals</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Your trusted platform for buying and selling cars with verified users and fair pricing.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">No Lowball Offers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">Verified Users Only</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <div className="space-y-3">
              {[
                { label: 'Buy Cars', path: '/' },
                { label: 'Sell Your Car', path: '/sell' },
                { label: 'How It Works', path: '/how-it-works' },
                { label: 'Help Center', path: '/help' }
              ].map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className="block text-gray-600 hover:text-orange-500 transition-colors text-sm py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">WhatsApp Support</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">hello@carvibe.com</span>
              </div>
              
              <div className="flex gap-4 pt-2">
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © 2024 CarVibe. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-600 hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-orange-500 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
