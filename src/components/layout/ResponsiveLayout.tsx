
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
    <div className="app-container">
      {/* Enhanced Header */}
      <Header />
      
      {/* Main content with proper spacing */}
      <main className={`main-content ${fullHeight ? 'min-h-screen' : ''} pt-16 md:pt-20`}>
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Compact Footer - only on homepage */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* Enhanced WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Enhanced Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl safe-area-bottom">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
