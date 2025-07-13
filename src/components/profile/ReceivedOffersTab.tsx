import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import { useUserOffers } from '@/hooks/useUserOffers';
import { Skeleton } from '@/components/ui/skeleton';

const ReceivedOffersTab = () => {
  const { toast } = useToast();
  const { navigateToChat } = useChatManager();
  const { offers, isLoading, error, updateOfferStatus } = useUserOffers();

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

  const handleAcceptOffer = async (offerId: string) => {
    const success = await updateOfferStatus(offerId, 'accepted');
    
    if (success) {
      toast({
        title: "Offer Accepted",
        description: "The buyer has been notified. You can now chat with them.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to accept offer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    const success = await updateOfferStatus(offerId, 'rejected');
    
    if (success) {
      toast({
        title: "Offer Rejected",
        description: "The buyer has been notified of your decision.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to reject offer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChatWithBuyer = (offer: any) => {
    navigateToChat(offer.car_id, `buyer${offer.id}`);
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

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-4 md:p-6">
        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer) => {
              const percentageDiff = calculatePercentageDiff(offer.offer_amount, offer.asking_price);
              
              return (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{offer.car_title}</h3>
                        <p className="text-sm text-gray-500">Posted {offer.created_at}</p>
                      </div>
                      {getStatusBadge(offer.status)}
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Asking Price</p>
                        <p className="font-semibold text-lg">{formatPrice(offer.asking_price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Buyer</p>
                        <p className="font-medium">{offer.buyer_name}</p>
                      </div>
                    </div>

                    {/* Offer Amount */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Offer Amount</p>
                          <p className="font-bold text-xl text-primary">{formatPrice(offer.offer_amount)}</p>
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
                          Offer rejected on {offer.created_at}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">No offers received yet</p>
        )}
      </Card>
    </div>
  );
};

export default ReceivedOffersTab;
