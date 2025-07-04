import { Link } from 'react-router-dom';
import { Car, Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold">CarVibe</span>
                <p className="text-xs text-muted-foreground">Good Vibes, Fair Deals</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Chennai's most trusted platform for buying and selling used cars. 
              Connecting buyers and sellers with transparency and trust.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary block">Browse Cars</Link>
              <Link to="/sell" className="text-sm text-muted-foreground hover:text-primary block">Sell Your Car</Link>
              <Link to="/dealers" className="text-sm text-muted-foreground hover:text-primary block">Verified Dealers</Link>
              <Link to="/rent" className="text-sm text-muted-foreground hover:text-primary block">Car Rentals</Link>
            </div>
          </div>

          {/* Safety & Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Safety & Support
            </h3>
            <div className="space-y-2">
              <Link to="/safety-tips" className="text-sm text-muted-foreground hover:text-primary block">Safety Tips</Link>
              <Link to="/verification" className="text-sm text-muted-foreground hover:text-primary block">Verification Process</Link>
              <Link to="/help" className="text-sm text-muted-foreground hover:text-primary block">Help Center</Link>
              <Link to="/report" className="text-sm text-muted-foreground hover:text-primary block">Report Issues</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@carvibe.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Tips Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center text-warning-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Safety First - Tips for Safe Transactions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div>
                <strong>Meet in Public:</strong> Always meet in a safe, public location for test drives and transactions.
              </div>
              <div>
                <strong>Verify Documents:</strong> Check RC, insurance, and pollution certificates before payment.
              </div>
              <div>
                <strong>Test Drive:</strong> Take a thorough test drive before making any payment decisions.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © 2024 CarVibe. All rights reserved. Built with care in Chennai.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;