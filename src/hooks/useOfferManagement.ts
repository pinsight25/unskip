import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useOfferManagement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAcceptOffer = async (offer: any, car: any) => {
    try {
      // 1. Update offer status to accepted
      const { error: offerError } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offer.id);

      if (offerError) {
        toast({
          title: "Error",
          description: "Failed to accept offer. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // 2. Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('car_id', offer.car_id)
        .eq('buyer_id', offer.buyer_id)
        .eq('seller_id', car.seller_id)
        .single();

      let chatId = existingChat?.id;

      // 3. Create chat if it doesn't exist
      if (!chatId) {
        const { data: newChat, error: chatError } = await supabase
          .from('chats')
          .insert({
            car_id: offer.car_id,
            buyer_id: offer.buyer_id,
            seller_id: car.seller_id,
            status: 'active'
          })
          .select('id')
          .single();

        if (chatError) {
          toast({
            title: "Warning",
            description: "Offer accepted but chat creation failed. Please try messaging the buyer manually.",
            variant: "destructive"
          });
          return;
        }

        chatId = newChat.id;

        // 4. Send initial system message
        await supabase
          .from('chat_messages')
          .insert({
            chat_id: chatId,
            sender_id: car.seller_id,
            receiver_id: offer.buyer_id,
            content: `Offer of ₹${offer.amount.toLocaleString()} accepted! You can now discuss the details.`,
            message_type: 'system'
          });
      }

      // 5. Refresh UI data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['offers'] }),
        queryClient.invalidateQueries({ queryKey: ['receivedOffers'] }),
        queryClient.invalidateQueries({ queryKey: ['chats'] }),
        queryClient.invalidateQueries({ queryKey: ['userListings'] })
      ]);

      // 6. Show success and navigate
      toast({
        title: "Offer Accepted! ✅",
        description: "The buyer has been notified. You can now chat with them.",
      });

      // Navigate to chat after short delay
      setTimeout(() => {
        navigate(`/chats/${chatId}`); // Use the UUID from database
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['offers'] });

      toast({
        title: "Offer Rejected",
        description: "The buyer has been notified.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject offer.",
        variant: "destructive"
      });
    }
  };

  return {
    handleAcceptOffer,
    handleRejectOffer
  };
}; 