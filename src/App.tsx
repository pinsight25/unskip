
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/UserContext';
import { OfferProvider } from '@/contexts/OfferContext';
import { CityProvider } from '@/contexts/CityContext';
import { Toaster } from '@/components/ui/toaster';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import Home from '@/pages/Home';
import CarDetail from '@/pages/CarDetail';
import Dealers from '@/pages/Dealers';
import DealerRegister from '@/pages/DealerRegister';
import DealerInventory from '@/pages/DealerInventory';
import SellCar from '@/pages/SellCar';
import PostAccessory from '@/pages/PostAccessory';
import Accessories from '@/pages/Accessories';
import AccessoryDetail from '@/pages/AccessoryDetail';
import Search from '@/pages/Search';
import Saved from '@/pages/Saved';
import Profile from '@/pages/Profile';
import Chats from '@/pages/Chats';
import ChatDetail from '@/pages/ChatDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <OfferProvider>
          <CityProvider>
            <Router>
              <ResponsiveLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/car/:id" element={<CarDetail />} />
                  <Route path="/dealers" element={<Dealers />} />
                  <Route path="/dealers/:dealerId" element={<DealerInventory />} />
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
                </Routes>
              </ResponsiveLayout>
              <Toaster />
            </Router>
          </CityProvider>
        </OfferProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
