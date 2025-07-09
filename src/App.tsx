
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/UserContext';
import { OfferProvider } from '@/contexts/OfferContext';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/Home';
import CarDetail from '@/pages/CarDetail';
import Dealers from '@/pages/Dealers';
import DealerRegister from '@/pages/DealerRegister';
import DealerInventory from '@/pages/DealerInventory';
import SellCar from '@/pages/SellCar';
import PostAccessory from '@/pages/PostAccessory';
import Search from '@/pages/Search';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <OfferProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/car/:id" element={<CarDetail />} />
              <Route path="/dealers" element={<Dealers />} />
              <Route path="/dealers/:dealerId" element={<DealerInventory />} />
              <Route path="/dealer/register" element={<DealerRegister />} />
              <Route path="/sell-car" element={<SellCar />} />
              <Route path="/post-accessory" element={<PostAccessory />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Router>
          <Toaster />
        </OfferProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
