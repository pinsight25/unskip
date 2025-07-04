
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from '../mobile/BottomNavigation';
import WhatsAppWidget from '../ui/WhatsAppWidget';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const ResponsiveLayout = ({ children, showFooter = true }: ResponsiveLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - responsive positioning */}
      <Header />
      
      {/* Main content - PROPER SPACING FOR MOBILE */}
      <main className="flex-1 pt-14 md:pt-16 pb-24 md:pb-0">
        {children}
      </main>
      
      {/* Footer - desktop only */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Bottom Navigation - ENHANCED FOR MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
