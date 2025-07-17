
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { UserProvider } from '@/contexts/UserContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      retry: 1, // Retry failed requests once
    },
  },
});

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
