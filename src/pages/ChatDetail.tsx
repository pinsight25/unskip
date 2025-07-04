import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, MapPin, Phone, Camera, MoreVertical, Calendar } from 'lucide-react';
import { mockChats, mockMessages, quickReplies, generateChatId } from '@/data/chatMockData';
import { mockCars } from '@/data/mockData';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import TestDriveModal from '@/components/modals/TestDriveModal';

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  
  const chat = mockChats.find(c => c.id === id);
  const car = chat ? mockCars.find(c => c.id === chat.carId) : null;
  
  useEffect(() => {
    if (id) {
      const chatMessages = mockMessages.filter(msg => msg.chatId === id);
      setMessages(chatMessages);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chat || !car) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      chatId: chat.id,
      senderId: 'buyer1', // Current user
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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

  if (!chat || !car) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Chat not found</h2>
          <Button onClick={() => navigate('/chats')}>Back to Chats</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/chats')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="w-10 h-8 bg-gray-200 rounded overflow-hidden">
            <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{car.title}</h3>
            <p className="text-xs text-gray-600">{car.seller.name}</p>
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'buyer1' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.senderId === 'buyer1' ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.senderId === 'buyer1'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 rounded-bl-sm'
                } ${message.type === 'test_drive' ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
              >
                {message.type === 'test_drive' && (
                  <Calendar className="h-4 w-4 inline mr-2" />
                )}
                <p className="text-sm">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {formatTime(message.timestamp)}
                {message.senderId === 'buyer1' && (
                  <span className="ml-1">{message.seen ? '✓✓' : '✓'}</span>
                )}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {quickReplies.map((reply) => (
            <Button
              key={reply.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickReply(reply.text)}
              className="whitespace-nowrap text-xs"
            >
              {reply.text}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTestDriveModal(true)}
            className="whitespace-nowrap text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Schedule Test Drive
          </Button>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Camera className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MapPin className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
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
