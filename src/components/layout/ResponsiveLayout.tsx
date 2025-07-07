
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from '../mobile/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main className={`flex-1 ${isMobile ? 'pt-4 pb-24' : 'pt-20 pb-8'}`}>
        {children}
      </main>
      
      {/* Desktop Footer */}
      {!isMobile && <Footer />}
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default ResponsiveLayout;
