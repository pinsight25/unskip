
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import Home from '@/pages/Home';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Home />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Index;
