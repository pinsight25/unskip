
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppWidget = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '919876543210'; // Remove the + for the API
    const message = 'Hi! I need help with Unskip.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
      <Button
        onClick={handleWhatsAppClick}
        className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 min-h-[48px] min-w-[48px]"
      >
        <MessageCircle className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default WhatsAppWidget;
