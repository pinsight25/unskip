import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from '../mobile/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  // Hide header/footer on chat pages
  const hideHeaderFooter = location.pathname.startsWith('/chats');
  const isChatsPage = location.pathname.startsWith('/chats');

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeaderFooter && <Header />}
      <main className={`flex-1${!isChatsPage ? ' responsive-header-spacing' : ''}`}>
        {children}
      </main>
      {!isMobile && !hideHeaderFooter && <Footer />}
      {isMobile && <div className="h-16" />}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default ResponsiveLayout;
