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
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Chat from '@/pages/Chat';
import SellCar from '@/pages/SellCar';
import AccessoryPost from '@/pages/AccessoryPost';
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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/sell-car" element={<SellCar />} />
              <Route path="/post-accessory" element={<AccessoryPost />} />
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
