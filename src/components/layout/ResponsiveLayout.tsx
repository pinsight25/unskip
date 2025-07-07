
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
      
      {/* Main content with responsive header spacing */}
      <main className={`flex-1 responsive-header-spacing ${isMobile ? 'pb-24' : 'pb-8'}`}>
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
