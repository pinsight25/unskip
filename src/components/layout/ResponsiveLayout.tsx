
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
    <div className="app-container min-h-screen flex flex-col prevent-horizontal-scroll">
      {/* Header */}
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main className={`flex-1 pt-16 lg:pt-20 pb-20 lg:pb-8 ${fullHeight ? 'min-h-screen' : ''}`}>
        <div className="w-full max-w-7xl mx-auto prevent-horizontal-scroll">
          {children}
        </div>
      </main>
      
      {/* Footer - only on homepage and desktop */}
      {showFooter && (
        <div className="hidden lg:block">
          <Footer />
        </div>
      )}
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
