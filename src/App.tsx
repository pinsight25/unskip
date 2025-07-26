
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { UserProvider } from '@/contexts/UserContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { OfferProvider } from '@/contexts/OfferContext';
import { CityProvider } from '@/contexts/CityContext';
import { Toaster } from '@/components/ui/toaster';
import { setQueryClient } from '@/utils/cacheUtils';

import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import ScrollToTop from '@/components/common/ScrollToTop';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingScreen from '@/components/common/LoadingScreen';

import Home from '@/pages/Home';
import CarDetail from '@/pages/CarDetail';
import Dealers from '@/pages/Dealers';
import DealerInventory from '@/pages/DealerInventory';

import DealerRegister from '@/pages/DealerRegister';
import DealerProfile from '@/pages/DealerProfile';
import SellCar from '@/pages/SellCar';
import PostAccessory from '@/pages/PostAccessory';
import EditAccessory from '@/pages/EditAccessory';
import Accessories from '@/pages/Accessories';
import AccessoryDetail from '@/pages/AccessoryDetail';
import Search from '@/pages/Search';
import Saved from '@/pages/Saved';
import Profile from '@/pages/Profile';
import ChatPage from '@/pages/ChatPage';
import EmptyChatState from '@/pages/EmptyChatState';
import ChatDetail from '@/pages/ChatDetail';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function DealerRegistrationGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    
    // Only enforce dealer registration for dealer inventory management
    if (
      user &&
      user.userType === 'dealer' &&
      user.dealer_registration_completed === false
    ) {
      // Only redirect for dealer inventory management
      const dealerInventoryPaths = [
        '/dealer/inventory'
      ];
      
      if (dealerInventoryPaths.includes(location.pathname)) {
        navigate('/dealer/register', { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  return <>{children}</>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Data never goes stale - only invalidate manually
      gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
      refetchOnWindowFocus: false, // Don't refetch when user returns to tab
      refetchOnMount: false, // Don't refetch on mount if data exists
      refetchOnReconnect: false, // Don't refetch on reconnect
      retry: 1, // Retry failed requests once
      retryDelay: 1000, // Wait 1 second before retrying
    },
  },
});

// Set query client for global cache utilities
setQueryClient(queryClient);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SupabaseProvider>
          <UserProvider>
            <AuthModalProvider>
              <ErrorBoundary>
                <OfferProvider>
                  <CityProvider>
                    <ScrollToTop />
                    <ResponsiveLayout>
                      <DealerRegistrationGuard>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/car/:id" element={<CarDetail />} />
                          <Route path="/dealers" element={<Dealers />} />
                          <Route path="/dealers/:dealerSlug" element={<DealerInventory />} />
                          <Route path="/dealer/inventory" element={<DealerInventory />} />
                          <Route path="/dealer/dashboard" element={<DealerInventory />} />

                          <Route path="/dealer/register" element={<DealerRegister />} />
                          <Route path="/sell-car" element={<SellCar />} />
                          <Route path="/sell" element={<SellCar />} />
                          <Route path="/post-accessory" element={<PostAccessory />} />
                          <Route path="/accessories/:id/edit" element={<EditAccessory />} />
                          <Route path="/accessories" element={<Accessories />} />
                          <Route path="/accessories/:id" element={<AccessoryDetail />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/saved" element={<Saved />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/chats" element={<ChatPage />}>
                            <Route index element={<EmptyChatState />} />
                            <Route path=":chatId" element={<ChatDetail />} />
                          </Route>
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/privacy" element={<Privacy />} />
                        </Routes>
                      </DealerRegistrationGuard>
                    </ResponsiveLayout>
                    <Toaster />
                  </CityProvider>
                </OfferProvider>
              </ErrorBoundary>
            </AuthModalProvider>
          </UserProvider>
        </SupabaseProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
