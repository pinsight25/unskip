
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - visible on all devices but styled differently */}
      <Header />
      
      {/* Main content area */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Footer - only on desktop and when showFooter is true */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Bottom Navigation - only on mobile/tablet */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
