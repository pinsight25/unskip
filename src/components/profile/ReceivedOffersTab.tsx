
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import OfferCard from './offer/OfferCard';

interface Offer {
  id: string;
  carId: string;
  carTitle: string;
  askingPrice: number;
  buyerName: string;
  buyerPhone: string;
  offerAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const ReceivedOffersTab = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      carId: '1',
      carTitle: '2022 Maruti Swift VXI',
      askingPrice: 650000,
      buyerName: 'Rahul Sharma',
      buyerPhone: '+91 98765 43210',
      offerAmount: 620000,
      status: 'pending',
      createdAt: '2 days ago'
    },
    {
      id: '2',
      carId: '2',
      carTitle: '2021 Hyundai i20 Sportz',
      askingPrice: 750000,
      buyerName: 'Priya Patel',
      buyerPhone: '+91 87654 32109',
      offerAmount: 780000,
      status: 'accepted',
      createdAt: '1 week ago'
    },
    {
      id: '3',
      carId: '3',
      carTitle: '2020 Honda City VX',
      askingPrice: 950000,
      buyerName: 'Amit Kumar',
      buyerPhone: '+91 76543 21098',
      offerAmount: 900000,
      status: 'rejected',
      createdAt: '3 days ago'
    },
    {
      id: '4',
      carId: '1',
      carTitle: '2022 Maruti Swift VXI',
      askingPrice: 650000,
      buyerName: 'Neha Singh',
      buyerPhone: '+91 65432 10987',
      offerAmount: 640000,
      status: 'pending',
      createdAt: '1 day ago'
    }
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculatePercentageDiff = (offerAmount: number, askingPrice: number) => {
    const diff = ((offerAmount - askingPrice) / askingPrice) * 100;
    return Math.round(diff);
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId ? { ...offer, status: 'accepted' as const } : offer
      )
    );
    
    toast({
      title: "Offer Accepted",
      description: "The buyer has been notified. You can now chat with them.",
    });
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId ? { ...offer, status: 'rejected' as const } : offer
      )
    );
    
    toast({
      title: "Offer Rejected",
      description: "The buyer has been notified of your decision.",
    });
  };

  const handleChatWithBuyer = (offer: Offer) => {
    navigate(`/chat/buyer-${offer.id}`);
  };

  return (
    <div className="space-y-4">
      {offers.length > 0 ? (
        offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            formatPrice={formatPrice}
            calculatePercentageDiff={calculatePercentageDiff}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onChatWithBuyer={handleChatWithBuyer}
          />
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No offers received yet</h3>
            <p className="text-gray-600 mb-6">When buyers make offers on your cars, they'll appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReceivedOffersTab;
