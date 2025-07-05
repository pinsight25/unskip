
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
        {/* Main Footer Content - Better desktop alignment */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Company Info */}
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 premium-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Car className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-bold text-foreground">CarVibe</span>
                  <p className="text-sm text-muted-foreground font-medium">Good Vibes, Fair Deals</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base max-w-md">
                Chennai's most trusted platform for buying and selling used cars with verified listings and transparent pricing.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-success/10 text-success border-success/20 px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  100% Verified
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  ⭐ 4.8 Rating
                </Badge>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="h-12 w-12 p-0 hover:bg-primary hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="h-12 w-12 p-0 hover:bg-primary hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="h-12 w-12 p-0 hover:bg-primary hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6 lg:space-y-8">
              <h3 className="text-xl font-bold text-foreground">Quick Links</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Buy Cars', path: '/' },
                  { label: 'Sell Your Car', path: '/sell' },
                  { label: 'Car Loans', path: '/loans' },
                  { label: 'Insurance', path: '/insurance' },
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

            {/* Contact & Support */}
            <div className="space-y-6 lg:space-y-8">
              <h3 className="text-xl font-bold text-foreground">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base">+91 98765 43210</p>
                    <p className="text-sm text-muted-foreground">Mon-Sat, 9 AM - 7 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base">hello@carvibe.com</p>
                    <p className="text-sm text-muted-foreground">24/7 support</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base">Chennai, Tamil Nadu</p>
                    <p className="text-sm text-muted-foreground">Serving all of Chennai</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Support */}
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-12 text-base">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Support
              </Button>
            </div>
          </div>
        </div>

        {/* Clean Bottom Bar - Better desktop layout */}
        <div className="border-t border-border bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-muted-foreground text-base">
                © 2024 CarVibe. All rights reserved. Made with ❤️ in Chennai
              </p>
              <div className="flex space-x-8 text-base">
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
