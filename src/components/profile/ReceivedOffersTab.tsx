import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import { useUserOffers } from '@/hooks/useUserOffers';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useReceivedOffers = () => {
  const { user } = useUser();
  return useQuery({
    queryKey: ['receivedOffers', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('offers')
        .select(`*, car:cars(*), buyer:users!buyer_id(*)`)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user?.id
  });
};

const ReceivedOffersTab = ({ onOffersCountChange }: { onOffersCountChange?: (count: number) => void }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const { offers, isLoading, error, updateOfferStatus } = useUserOffers();
  const { navigateToChat } = useChatManager();
  const queryClient = useQueryClient();

  const { data: receivedOffers = [], isLoading: offersLoading, refetch } = useQuery({
    queryKey: ['receivedOffers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          buyer:users!buyer_id(id, name, phone),
          car:cars(id, make, model, year, price)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      console.log('Received offers:', data);
      return data || [];
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Supabase real-time subscription for offers
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel('realtime-offers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  useEffect(() => {
    if (typeof onOffersCountChange === 'function') {
      onOffersCountChange(receivedOffers.length);
    }
  }, [receivedOffers.length, onOffersCountChange]);

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

  const handleAcceptOffer = async (offer: any) => {
    const success = await updateOfferStatus(offer.id, 'accepted');
    if (success) {
      // Create chat after accepting offer
      try {
        await navigateToChat(offer.car_id, offer.buyer_id || offer.buyer?.id, user.id, toast);
        await queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
      } catch (err) {
        toast({ title: 'Failed to create chat', description: err.message, variant: 'destructive' });
      }
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

  const handleChatWithBuyer = async (offer: any) => {
    const buyerId = offer.buyer_id || offer.buyer?.id;
    if (!buyerId) {
      toast({ title: 'Invalid offer data', variant: 'destructive' });
      return;
    }
    try {
      await navigateToChat(offer.car_id, buyerId, user.id, toast);
      await queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
    } catch (error) {
      toast({ title: 'Failed to open chat', description: error.message, variant: 'destructive' });
    }
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
        {receivedOffers.length > 0 ? (
          <div className="space-y-4">
            {receivedOffers.map((offer) => {
              const percentageDiff = calculatePercentageDiff(offer.amount, offer.car?.price);
              return (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{offer.car?.year} {offer.car?.make} {offer.car?.model}</h3>
                    <p className="text-sm text-gray-500">Asking Price: ₹{offer.car?.price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Buyer: {offer.buyer?.name}</p>
                    <p className="font-bold text-xl text-primary">Offer Amount: ₹{offer.amount?.toLocaleString()}</p>
                    <p className="text-lg font-semibold">Difference: {percentageDiff > 0 ? '+' : ''}{percentageDiff}%</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 mt-2">
                    {offer.status === 'pending' && (
                      <>
                        <Button onClick={() => handleAcceptOffer(offer)} className="flex-1 bg-green-600 hover:bg-green-700">Accept Offer</Button>
                        <Button onClick={() => handleRejectOffer(offer.id)} variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                      </>
                    )}
                    {offer.status === 'accepted' && (
                      <Button onClick={() => handleChatWithBuyer(offer)} className="flex-1">Chat with Buyer</Button>
                    )}
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
