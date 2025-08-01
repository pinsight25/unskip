
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
import { preloadManager } from '@/utils/preloadUtils';

import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import ScrollToTop from '@/components/common/ScrollToTop';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingScreen from '@/components/common/LoadingScreen';

// Enhanced lazy loading with preloading strategies
// Core pages - loaded immediately
const Home = lazy(() => import('@/pages/Home'));

// Heavy pages - loaded on demand with preloading
const CarDetail = lazy(() => import('@/pages/CarDetail'), {
  // Preload when user hovers over car cards
  preload: () => import('@/pages/CarDetail')
});

const SellCar = lazy(() => import('@/pages/SellCar'), {
  // Preload when user navigates to profile (likely to sell)
  preload: () => import('@/pages/SellCar')
});

const Profile = lazy(() => import('@/pages/Profile'), {
  // Preload when user clicks profile-related elements
  preload: () => import('@/pages/Profile')
});

// Feature-based lazy loading
const Dealers = lazy(() => import('@/pages/Dealers'));
const DealerInventory = lazy(() => import('@/pages/DealerInventory'));
const DealerRegister = lazy(() => import('@/pages/DealerRegister'));
const DealerProfile = lazy(() => import('@/pages/DealerProfile'));

// Accessory feature
const PostAccessory = lazy(() => import('@/pages/PostAccessory'));
const EditAccessory = lazy(() => import('@/pages/EditAccessory'));
const Accessories = lazy(() => import('@/pages/Accessories'));
const AccessoryDetail = lazy(() => import('@/pages/AccessoryDetail'));

// Search and discovery
const Search = lazy(() => import('@/pages/Search'));
const Saved = lazy(() => import('@/pages/Saved'));

// Chat feature - loaded separately for better performance
const ChatPage = lazy(() => import('@/pages/ChatPage'), {
  // Preload chat when user is likely to use it
  preload: () => import('@/pages/ChatPage')
});
const EmptyChatState = lazy(() => import('@/pages/EmptyChatState'));
const Chats = lazy(() => import('@/pages/Chats'));
const ChatDetail = lazy(() => import('@/pages/ChatDetail'), {
  // Preload when user opens chat list
  preload: () => import('@/pages/ChatDetail')
});

// Static pages
const Notifications = lazy(() => import('@/pages/Notifications'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));

import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Enhanced loading component with better UX
const PageLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
      <div className="mt-2 text-sm text-gray-400">Please wait while we load the page</div>
    </div>
  </div>
);

// Feature-specific loading components
const ChatLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Chat...</p>
      <div className="mt-2 text-sm text-gray-400">Preparing your messaging experience</div>
    </div>
  </div>
);

const CarLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Car Details...</p>
      <div className="mt-2 text-sm text-gray-400">Fetching comprehensive vehicle information</div>
    </div>
  </div>
);

function AppLoadingGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUser();

  // Only show loading for a maximum of 3 seconds to prevent infinite loading
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading screen only briefly while user context is initializing
  if (isLoading && showLoading) {
    return <PageLoading />;
  }

  return <>{children}</>;
}

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

// Preloading strategies for better UX
const preloadHeavyComponents = () => {
  // Initialize the preload manager
  preloadManager.preloadCriticalModules();
};

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
  useEffect(() => {
    // Initialize preloading strategies
    preloadHeavyComponents();
  }, []);

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
                      <AppLoadingGuard>
                        <ResponsiveLayout>
                          <DealerRegistrationGuard>
                            <Suspense fallback={<PageLoading />}>
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/car/:id" element={
                                  <Suspense fallback={<CarLoading />}>
                                    <CarDetail />
                                  </Suspense>
                                } />
                                <Route path="/dealers" element={<Dealers />} />
                                <Route path="/dealers/:slug" element={<DealerProfile />} />
                                <Route path="/dealer/inventory" element={<DealerInventory />} />
                                <Route path="/dealer/register" element={<DealerRegister />} />
                                <Route path="/dealer/test" element={<div>Test Dealer Route Working!</div>} />
                                <Route path="/dealer/:slug" element={<DealerInventory />} />
                                <Route path="/sell-car" element={
                                  <Suspense fallback={<CarLoading />}>
                                    <SellCar />
                                  </Suspense>
                                } />
                                <Route path="/accessories" element={<Accessories />} />
                                <Route path="/accessory/:id" element={<AccessoryDetail />} />
                                <Route path="/post-accessory" element={<PostAccessory />} />
                                <Route path="/edit-accessory/:id" element={<EditAccessory />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/saved" element={<Saved />} />
                                <Route path="/profile" element={
                                  <Suspense fallback={<PageLoading />}>
                                    <Profile />
                                  </Suspense>
                                } />
                                <Route path="/notifications" element={<Notifications />} />
                                
                                <Route path="/chats" element={
                                  <Suspense fallback={<ChatLoading />}>
                                    <ChatPage />
                                  </Suspense>
                                }>
                                  <Route index element={<div className="flex-1 flex items-center justify-center text-gray-500">Select a chat to start messaging</div>} />
                                  <Route path=":id" element={
                                    <Suspense fallback={<ChatLoading />}>
                                      <ChatDetail />
                                    </Suspense>
                                  } />
                                </Route>
                                <Route path="/terms" element={<Terms />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="*" element={<Home />} />
                              </Routes>
                            </Suspense>
                          </DealerRegistrationGuard>
                        </ResponsiveLayout>
                      </AppLoadingGuard>
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
