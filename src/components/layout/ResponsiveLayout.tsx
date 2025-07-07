
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from '../mobile/BottomNavigation';
import { useEffect, useState } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main content with proper spacing below header */}
      <main className={`flex-1 ${isMobile ? 'pt-6 pb-20' : 'pt-24'}`}>
        <div className={isMobile ? 'pb-8' : ''}>
          {children}
        </div>
      </main>
      
      {/* Desktop Footer */}
      {!isMobile && <Footer />}
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default ResponsiveLayout;
