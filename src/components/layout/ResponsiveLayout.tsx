
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
      {/* Compact Header */}
      <Header />
      
      {/* Main content with compact spacing */}
      <main className={`main-content ${fullHeight ? 'min-h-screen' : ''} pt-14 md:pt-16`}>
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Compact Footer - only on homepage */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Compact Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-lg safe-area-bottom">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
