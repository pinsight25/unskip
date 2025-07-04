import { Link } from 'react-router-dom';
import { Car, Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-light rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 premium-gradient rounded-xl flex items-center justify-center shadow-glow">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">CarVibe</span>
                  <p className="text-sm text-white/80">Good Vibes, Fair Deals</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed">
                Chennai's most trusted platform for buying and selling used cars. 
                Connecting buyers and sellers with transparency, trust, and premium service.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Explore</h3>
              <div className="space-y-3">
                {[
                  { label: 'Browse Cars', path: '/' },
                  { label: 'Sell Your Car', path: '/sell' },
                  { label: 'Verified Dealers', path: '/dealers' },
                  { label: 'Car Rentals', path: '/rent' },
                  { label: 'Car Loans', path: '/loans' },
                  { label: 'Insurance', path: '/insurance' }
                ].map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors flex items-center group"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Safety & Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2 text-success" />
                Safety & Support
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Safety Guidelines', path: '/safety' },
                  { label: 'Verification Process', path: '/verification' },
                  { label: 'Help Center', path: '/help' },
                  { label: 'Report Issues', path: '/report' },
                  { label: 'Dispute Resolution', path: '/disputes' },
                  { label: 'Terms & Conditions', path: '/terms' }
                ].map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors flex items-center group"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Call us</p>
                    <p className="font-medium text-white">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Email us</p>
                    <p className="font-medium text-white">hello@carvibe.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Visit us</p>
                    <p className="font-medium text-white">Chennai, Tamil Nadu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Safety Banner */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-success/20 to-primary-light/20 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-success mr-3" />
                <h4 className="text-xl font-semibold">Your Safety is Our Priority</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <h5 className="font-semibold mb-2">🛡️ Meet Safely</h5>
                  <p className="text-white/70">Always meet in public places for test drives and transactions</p>
                </div>
                <div className="text-center">
                  <h5 className="font-semibold mb-2">📋 Verify Documents</h5>
                  <p className="text-white/70">Check RC, insurance, and pollution certificates thoroughly</p>
                </div>
                <div className="text-center">
                  <h5 className="font-semibold mb-2">🔍 Inspect First</h5>
                  <p className="text-white/70">Take a comprehensive test drive before any payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-white/60 text-sm">
                © 2024 CarVibe. All rights reserved. Made with ❤️ in Chennai
              </p>
              <div className="flex space-x-6 text-sm">
                <Link to="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="text-white/60 hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;