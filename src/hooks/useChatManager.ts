
import { useNavigate } from 'react-router-dom';
import { mockChats, generateChatId } from '@/data/chatMockData';
import { Chat } from '@/types/chat';

export const useChatManager = () => {
  const navigate = useNavigate();

  const createOrGetChat = (carId: string, userId: string = 'buyer1'): Chat => {
    const chatId = generateChatId(carId, userId);
    
    // Check if chat already exists
    let existingChat = mockChats.find(chat => chat.id === chatId);
    
    if (!existingChat) {
      // Create new chat entry (in a real app, this would be an API call)
      existingChat = {
        id: chatId,
        carId: carId,
        buyerId: userId,
        sellerId: `seller${carId}`, // Simple mapping for demo
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' as const
      };
      
      // Add to mock chats (in a real app, this would be persisted)
      mockChats.push(existingChat);
    }
    
    return existingChat;
  };

  const navigateToChat = (carId: string, userId: string = 'buyer1') => {
    const chat = createOrGetChat(carId, userId);
    // Fixed route - use /chats/ (with 's') to match the route definition
    navigate(`/chats/${chat.id}`);
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
