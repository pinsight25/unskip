
import { useNavigate } from 'react-router-dom';
import { generateChatId } from '@/utils/chatHelpers';
import { Chat } from '@/types/chat';
import { supabase } from '@/lib/supabase';

export const useChatManager = () => {
  const navigate = useNavigate();

  // Async version for real chat creation
  const createOrGetChat = async (carId: string, buyerId: string, sellerId: string, toast?: (opts: any) => void) => {
    try {
      console.log('[ChatManager] Checking for existing chat:', { carId, buyerId, sellerId });
      const { data: existing, error } = await supabase
        .from('chats')
        .select('id')
        .eq('car_id', carId)
        .eq('buyer_id', buyerId)
        .eq('seller_id', sellerId)
        .maybeSingle();
      if (error) {
        console.error('[ChatManager] Error checking chat:', error);
        if (toast) toast({ title: 'Error checking chat', description: error.message, variant: 'destructive' });
        throw error;
      }
      if (existing) {
        console.log('[ChatManager] Existing chat found:', existing.id);
        return existing.id;
      }
      // Create new chat
      console.log('[ChatManager] Creating new chat:', { carId, buyerId, sellerId });
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert({
          car_id: carId,
          buyer_id: buyerId,
          seller_id: sellerId,
          status: 'active',
          unread_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      if (createError) {
        console.error('[ChatManager] Error creating chat:', createError);
        if (toast) toast({ title: 'Failed to create chat', description: createError.message, variant: 'destructive' });
        throw createError;
      }
      console.log('[ChatManager] New chat created:', newChat.id);
      return newChat.id;
    } catch (err) {
      console.error('[ChatManager] Unexpected error:', err);
      if (toast) toast({ title: 'Unexpected error', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  // Async navigation to chat
  const navigateToChat = async (carId: string, buyerId: string, sellerId: string, toast?: (opts: any) => void) => {
    try {
      const chatId = await createOrGetChat(carId, buyerId, sellerId, toast);
      navigate(`/chats/${chatId}`);
    } catch (err) {
      console.error('[ChatManager] Failed to navigate to chat:', err);
      if (toast) toast({ title: 'Failed to open chat', description: err.message, variant: 'destructive' });
    }
  };

  const getChatId = (carId: string, userId: string = 'buyer1') => {
    return generateChatId(carId, userId);
  };

  return {
    createOrGetChat,
    navigateToChat,
    getChatId
  };
};
