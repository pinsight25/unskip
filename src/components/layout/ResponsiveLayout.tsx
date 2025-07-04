
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
      
      {/* Main content area with proper spacing for bottom nav on mobile */}
      <main className="flex-1 pb-24 md:pb-0 pt-14 md:pt-16">
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
      
      {/* Bottom Navigation - always visible on mobile/tablet for ALL pages */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
