
import { Link } from 'react-router-dom';
import { Car, Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">CarVibe</span>
                <p className="text-sm text-gray-600 font-medium">Good Vibes, Fair Deals</p>
              </div>
            </div>
            <p className="text-gray-600 text-[14px] leading-relaxed max-w-sm">
              Chennai's most trusted platform for buying and selling used cars with verified dealers and transparent pricing.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                <Shield className="h-3 w-3 mr-1" />
                100% Verified
              </Badge>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1">
                ⭐ 4.8 Rating
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: 'Buy Cars', path: '/' },
                { label: 'Sell Your Car', path: '/sell' },
                { label: 'Verified Dealers', path: '/dealers' },
                { label: 'Car Accessories', path: '/accessories' },
                { label: 'Help Center', path: '/help' }
              ].map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className="block text-gray-600 hover:text-orange-500 transition-colors font-medium text-[14px] py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Services</h3>
            <div className="space-y-2">
              {[
                'Car Valuation',
                'Test Drive',
                'Car Inspection',
                'Finance Options',
                'Insurance'
              ].map((service) => (
                <div key={service} className="text-gray-600 font-medium text-[14px] py-1">
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-[14px]">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-[14px]">hello@carvibe.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-gray-900 text-[14px]">Chennai, Tamil Nadu</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-600 text-[14px] text-center md:text-left">
              © 2024 CarVibe. All rights reserved.
            </p>
            <div className="flex space-x-6 text-[14px]">
              <Link to="/privacy" className="text-gray-600 hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-orange-500 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
