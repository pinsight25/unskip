import { Link } from 'react-router-dom';
import { Car, Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Simplified Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 premium-gradient rounded-xl flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">CarVibe</span>
                  <p className="text-sm text-white/80">Good Vibes, Fair Deals</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed">
                Chennai's most trusted platform for buying and selling used cars.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/20">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/20">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/20">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: 'Browse Cars', path: '/' },
                  { label: 'Sell Your Car', path: '/sell' },
                  { label: 'Help Center', path: '/help' },
                  { label: 'Safety Guidelines', path: '/safety' }
                ].map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors block"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-white/70" />
                  <span className="text-white">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-white/70" />
                  <span className="text-white">hello@carvibe.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-white/70" />
                  <span className="text-white">Chennai, Tamil Nadu</span>
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