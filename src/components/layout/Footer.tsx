
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
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 premium-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-foreground">CarVibe</span>
                  <p className="text-sm text-muted-foreground">Good Vibes, Fair Deals</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                Chennai's most trusted platform for buying and selling used cars with verified listings and transparent pricing.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-success/10 text-success border-success/20">
                  <Shield className="h-3 w-3 mr-1" />
                  100% Verified
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  ⭐ 4.8 Rating
                </Badge>
              </div>

              {/* Social Media */}
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-primary hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-primary hover:text-white transition-colors">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 hover:bg-primary hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
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
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact & Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">+91 98765 43210</p>
                    <p className="text-xs text-muted-foreground">Mon-Sat, 9 AM - 7 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">hello@carvibe.com</p>
                    <p className="text-xs text-muted-foreground">24/7 support</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Chennai, Tamil Nadu</p>
                    <p className="text-xs text-muted-foreground">Serving all of Chennai</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Support */}
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Support
              </Button>
            </div>
          </div>
        </div>

        {/* Clean Bottom Bar */}
        <div className="border-t border-border bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-muted-foreground text-sm">
                © 2024 CarVibe. All rights reserved. Made with ❤️ in Chennai
              </p>
              <div className="flex space-x-6 text-sm">
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
