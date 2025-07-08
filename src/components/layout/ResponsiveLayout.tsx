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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 responsive-header-spacing">
        {children}
      </main>
      {!isMobile && <Footer />}
      {isMobile && <div className="h-16" />}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default ResponsiveLayout;
