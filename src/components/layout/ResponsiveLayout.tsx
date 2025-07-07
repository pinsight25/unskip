
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from '../mobile/BottomNavigation';
import WhatsAppWidget from '../ui/WhatsAppWidget';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  fullHeight?: boolean;
}

const ResponsiveLayout = ({ children, showFooter = false, fullHeight = false }: ResponsiveLayoutProps) => {
  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main content with proper spacing and bottom padding for mobile navigation */}
      <main className={`flex-1 pt-14 pb-20 md:pb-8 ${fullHeight ? 'min-h-screen' : ''}`}>
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Footer - only on homepage and desktop */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
