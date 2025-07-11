
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';

interface ChatHandlers {
  handleChatClick: (car: any) => void;
}

interface UseHomeChatHandlersProps {
  getOfferStatus: (carId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
}

export const useHomeChatHandlers = ({ getOfferStatus }: UseHomeChatHandlersProps): ChatHandlers => {
  const { toast } = useToast();
  const { navigateToChat } = useChatManager();

  const handleChatClick = (car: any) => {
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Waiting for seller response",
        description: "Please wait for the seller to respond to your offer before chatting.",
      });
      return;
    }
    
    if (status === 'accepted') {
      navigateToChat(car.id);
    }
  };

  return {
    handleChatClick
  };
};
