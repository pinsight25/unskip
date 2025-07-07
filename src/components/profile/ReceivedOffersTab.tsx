
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
    // Navigate to chat with specific buyer
    navigate(`/chat/buyer-${offer.id}`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPercentageBadge = (percentage: number) => {
    if (percentage > 0) {
      return <span className="text-green-600 font-medium">+{percentage}%</span>;
    } else if (percentage < 0) {
      return <span className="text-red-600 font-medium">{percentage}%</span>;
    }
    return <span className="text-gray-600 font-medium">0%</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-4 md:p-6">
        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer) => {
              const percentageDiff = calculatePercentageDiff(offer.offerAmount, offer.askingPrice);
              
              return (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{offer.carTitle}</h3>
                        <p className="text-sm text-gray-500">Posted {offer.createdAt}</p>
                      </div>
                      {getStatusBadge(offer.status)}
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Asking Price</p>
                        <p className="font-semibold text-lg">{formatPrice(offer.askingPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Buyer</p>
                        <p className="font-medium">{offer.buyerName}</p>
                      </div>
                    </div>

                    {/* Offer Amount */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Offer Amount</p>
                          <p className="font-bold text-xl text-primary">{formatPrice(offer.offerAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Difference</p>
                          <p className="text-lg font-semibold">{getPercentageBadge(percentageDiff)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-2">
                      {offer.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Offer
                          </Button>
                          <Button
                            onClick={() => handleRejectOffer(offer.id)}
                            variant="outline"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {offer.status === 'accepted' && (
                        <Button
                          onClick={() => handleChatWithBuyer(offer)}
                          className="flex-1"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat with Buyer
                        </Button>
                      )}
                      {offer.status === 'rejected' && (
                        <div className="flex-1 p-2 text-center text-gray-500 text-sm">
                          Offer rejected on {offer.createdAt}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No offers received yet</h3>
            <p className="text-gray-600 mb-6">When buyers make offers on your cars, they'll appear here</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReceivedOffersTab;
