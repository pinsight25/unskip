
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockChats, mockMessages } from '@/data/chatMockData';
import { mockCars } from '@/data/mockData';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import TestDriveModal from '@/components/modals/TestDriveModal';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

const ChatDetail = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  
  const chat = mockChats.find(c => c.id === chatId);
  const car = chat ? mockCars.find(c => c.id === chat.carId) : null;
  
  useEffect(() => {
    if (chatId) {
      const chatMessages = mockMessages.filter(msg => msg.chatId === chatId);
      setMessages(chatMessages);
    }
  }, [chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chat || !car) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      chatId: chat.id,
      senderId: 'buyer1',
      receiverId: chat.sellerId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      seen: false,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate seller response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Thanks for your message!',
        'Let me check and get back to you.',
        'Sure, that sounds good.',
        'When would be a good time for you?'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const sellerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        chatId: chat.id,
        senderId: chat.sellerId,
        receiverId: 'buyer1',
        content: randomResponse,
        timestamp: new Date().toISOString(),
        seen: false,
        type: 'text'
      };
      
      setMessages(prev => [...prev, sellerMessage]);
    }, 2000);
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
  };

  const handleTestDriveScheduled = (booking: any) => {
    const testDriveMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId: chat!.id,
      senderId: 'buyer1',
      receiverId: chat!.sellerId,
      content: `Test drive scheduled for ${booking.date} at ${booking.timeSlot}`,
      timestamp: new Date().toISOString(),
      seen: false,
      type: 'test_drive'
    };
    
    setMessages(prev => [...prev, testDriveMessage]);
    
    toast({
      title: "Test Drive Scheduled! 🚗",
      description: `Your test drive is confirmed for ${booking.date} at ${booking.timeSlot}`,
    });
  };

  const handleReportChat = () => {
    toast({
      title: "Chat Reported",
      description: "This chat has been reported. We'll review it shortly.",
    });
  };

  const handleBlockUser = () => {
    toast({
      title: "User Blocked",
      description: "You have blocked this user. You won't receive messages from them.",
    });
  };

  const handleDeleteConversation = () => {
    toast({
      title: "Conversation Deleted",
      description: "This conversation has been deleted.",
    });
    navigate('/chats');
  };

  if (!chat || !car) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-2">Chat not found</h2>
          <Button onClick={() => navigate('/chats')}>Back to Chats</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl bg-white shadow-sm">
        <div className="flex flex-col h-screen">
          <ChatHeader
            car={car}
            onBack={() => navigate('/chats')}
            onReportChat={handleReportChat}
            onBlockUser={handleBlockUser}
            onDeleteConversation={handleDeleteConversation}
          />

          <ChatMessages
            messages={messages}
            isTyping={isTyping}
          />

          <ChatInput
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onQuickReply={handleQuickReply}
            onTestDrive={() => setShowTestDriveModal(true)}
          />
        </div>
      </div>

      <TestDriveModal
        isOpen={showTestDriveModal}
        onClose={() => setShowTestDriveModal(false)}
        car={car}
        onScheduled={handleTestDriveScheduled}
      />
    </div>
  );
};

export default ChatDetail;
