
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
      {/* Header - fixed at top */}
      <Header />
      
      {/* Main content - flexible height with proper spacing */}
      <main className={`main-content ${fullHeight ? 'min-h-screen' : ''} pt-14 md:pt-16`}>
        <div className="desktop-container">
          {children}
        </div>
      </main>
      
      {/* Footer - desktop only, only show on landing/marketing pages */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* WhatsApp Widget - floating action button */}
      <WhatsAppWidget />
      
      {/* Bottom Navigation - mobile only, fixed at bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl safe-area-bottom">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
