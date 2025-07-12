
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { OfferProvider } from '@/contexts/OfferContext';
import { CityProvider } from '@/contexts/CityContext';
import { Toaster } from '@/components/ui/toaster';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import ScrollToTop from '@/components/common/ScrollToTop';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingScreen from '@/components/common/LoadingScreen';
import Home from '@/pages/Home';
import CarDetail from '@/pages/CarDetail';
import Dealers from '@/pages/Dealers';
import DealerRegister from '@/pages/DealerRegister';
import DealerInventory from '@/pages/DealerInventory';
import DealerProfile from '@/pages/DealerProfile';
import SellCar from '@/pages/SellCar';
import PostAccessory from '@/pages/PostAccessory';
import Accessories from '@/pages/Accessories';
import AccessoryDetail from '@/pages/AccessoryDetail';
import Search from '@/pages/Search';
import Saved from '@/pages/Saved';
import Profile from '@/pages/Profile';
import Chats from '@/pages/Chats';
import ChatDetail from '@/pages/ChatDetail';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

// App content component that uses the UserContext
const AppContent = () => {
  const { isLoading } = useUser();
  const [forceLoad, setForceLoad] = useState(false);

  // Force load after 5 seconds regardless of auth state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn('🚨 FORCING APP TO LOAD after 5 seconds');
      setForceLoad(true);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading && !forceLoad) {
    return (
      <LoadingScreen 
        message="Loading..." 
        timeout={3000}
        onTimeout={() => setForceLoad(true)}
      />
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <ResponsiveLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/dealers/:dealerId" element={<DealerInventory />} />
          <Route path="/dealers/:dealerSlug" element={<DealerProfile />} />
          <Route path="/dealer/register" element={<DealerRegister />} />
          <Route path="/sell-car" element={<SellCar />} />
          <Route path="/sell" element={<SellCar />} />
          <Route path="/post-accessory" element={<PostAccessory />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/accessories/:id" element={<AccessoryDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chats/:chatId" element={<ChatDetail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </ResponsiveLayout>
      <Toaster />
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <UserProvider>
            <OfferProvider>
              <CityProvider>
                <AppContent />
              </CityProvider>
            </OfferProvider>
          </UserProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
