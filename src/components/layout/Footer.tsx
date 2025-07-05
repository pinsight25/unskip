
import { Link } from 'react-router-dom';
import { Car, Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-border relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-24 h-24 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Compact Main Footer Content */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Company Info - Streamlined */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-foreground">CarVibe</span>
                  <p className="text-sm text-muted-foreground font-medium">Good Vibes, Fair Deals</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base max-w-sm">
                Chennai's most trusted platform for buying and selling used cars.
              </p>
              
              {/* Compact Trust Badges */}
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-success/10 text-success border-success/20 px-3 py-2">
                  <Shield className="h-4 w-4 mr-1" />
                  Verified
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-2">
                  ⭐ 4.8 Rating
                </Badge>
              </div>
            </div>

            {/* Quick Links - Compact */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Buy Cars', path: '/' },
                  { label: 'Sell Your Car', path: '/sell' },
                  { label: 'Dealers', path: '/dealers' },
                  { label: 'Help Center', path: '/help' }
                ].map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors font-medium text-base py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact - Streamlined */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-secondary" />
                  <span className="font-semibold text-foreground">hello@carvibe.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-foreground">Chennai, Tamil Nadu</span>
                </div>
              </div>

              {/* Social Media - Compact */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-primary hover:text-white">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-primary hover:text-white">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-primary hover:text-white">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="border-t border-border bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
              <p className="text-muted-foreground text-base">
                © 2024 CarVibe. All rights reserved.
              </p>
              <div className="flex space-x-6 text-base">
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
