
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CarDetail from "./pages/CarDetail";
import SellCar from "./pages/SellCar";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Dealers from "./pages/Dealers";
import DealerInventory from "./pages/DealerInventory";
import DealerRegister from "./pages/DealerRegister";
import Chats from "./pages/Chats";
import ChatDetail from "./pages/ChatDetail";
import Accessories from "./pages/Accessories";
import AccessoryDetail from "./pages/AccessoryDetail";
import PostAccessory from "./pages/PostAccessory";
import Rent from "./pages/Rent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sell" element={<SellCar />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/dealer/:dealerId/inventory" element={<DealerInventory />} />
          <Route path="/dealer-register" element={<DealerRegister />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:id" element={<ChatDetail />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/accessories/:id" element={<AccessoryDetail />} />
          <Route path="/post-accessory" element={<PostAccessory />} />
          <Route path="/rent" element={<Rent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
