
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
      {/* Header */}
      <Header />
      
      {/* Main content with proper spacing for floating nav */}
      <main className={`main-content ${fullHeight ? 'min-h-screen' : ''} pt-16 md:pt-18 pb-24 md:pb-0`}>
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Footer - only on homepage */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Bottom Navigation - Mobile (Now Floating) */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
