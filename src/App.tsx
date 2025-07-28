
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { UserProvider } from '@/contexts/UserContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { OfferProvider } from '@/contexts/OfferContext';
import { CityProvider } from '@/contexts/CityContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';
import { setQueryClient } from '@/utils/cacheUtils';

import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import ScrollToTop from '@/components/common/ScrollToTop';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingScreen from '@/components/common/LoadingScreen';

// Lazy load all page components for better performance
const Home = lazy(() => import('@/pages/Home'));
const CarDetail = lazy(() => import('@/pages/CarDetail'));
const Dealers = lazy(() => import('@/pages/Dealers'));
const DealerInventory = lazy(() => import('@/pages/DealerInventory'));
const DealerRegister = lazy(() => import('@/pages/DealerRegister'));
const DealerProfile = lazy(() => import('@/pages/DealerProfile'));
const SellCar = lazy(() => import('@/pages/SellCar'));
const PostAccessory = lazy(() => import('@/pages/PostAccessory'));
const EditAccessory = lazy(() => import('@/pages/EditAccessory'));
const Accessories = lazy(() => import('@/pages/Accessories'));
const AccessoryDetail = lazy(() => import('@/pages/AccessoryDetail'));
const Search = lazy(() => import('@/pages/Search'));
const Saved = lazy(() => import('@/pages/Saved'));
const Profile = lazy(() => import('@/pages/Profile'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const EmptyChatState = lazy(() => import('@/pages/EmptyChatState'));
const ChatDetail = lazy(() => import('@/pages/ChatDetail'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));

import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Loading component for Suspense fallback
const PageLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

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
      staleTime: 5 * 60 * 1000, // 5 minutes - data goes stale after 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
      refetchOnWindowFocus: false, // Don't refetch on window focus to prevent unnecessary requests
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      refetchOnReconnect: true, // Refetch on reconnect
      retry: 2, // Retry failed requests twice
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
                    <NotificationProvider>
                      <ScrollToTop />
                      <ResponsiveLayout>
                        <DealerRegistrationGuard>
                          <Suspense fallback={<PageLoading />}>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/car/:id" element={<CarDetail />} />
                              <Route path="/dealers" element={<Dealers />} />
                              <Route path="/dealers/:slug" element={<DealerProfile />} />
                              <Route path="/dealer/inventory" element={<DealerInventory />} />
                              <Route path="/dealer/register" element={<DealerRegister />} />
                              <Route path="/dealer/test" element={<div>Test Dealer Route Working!</div>} />
                              <Route path="/dealer/:slug" element={<DealerInventory />} />
                              <Route path="/sell-car" element={<SellCar />} />
                              <Route path="/accessories" element={<Accessories />} />
                              <Route path="/accessory/:id" element={<AccessoryDetail />} />
                              <Route path="/post-accessory" element={<PostAccessory />} />
                              <Route path="/edit-accessory/:id" element={<EditAccessory />} />
                              <Route path="/search" element={<Search />} />
                              <Route path="/saved" element={<Saved />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/notifications" element={<Notifications />} />
                              
                              <Route path="/chat/:id" element={<ChatDetail />} />
                              <Route path="/terms" element={<Terms />} />
                              <Route path="/privacy" element={<Privacy />} />
                              <Route path="*" element={<Home />} />
                            </Routes>
                          </Suspense>
                        </DealerRegistrationGuard>
                      </ResponsiveLayout>
                      <Toaster />
                    </NotificationProvider>
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
