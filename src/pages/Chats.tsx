
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MessageCircle, Clock } from 'lucide-react';
import { mockChats, mockMessages } from '@/data/chatMockData';
import { mockCars } from '@/data/mockData';
import { Chat, ChatMessage } from '@/types/chat';

const Chats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Simulate loading chats with last messages
    const chatsWithMessages = mockChats.map(chat => {
      const lastMessage = mockMessages
        .filter(msg => msg.chatId === chat.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      return {
        ...chat,
        lastMessage
      };
    });
    
    setChats(chatsWithMessages);
    setFilteredChats(chatsWithMessages);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = chats.filter(chat => {
        const car = mockCars.find(c => c.id === chat.carId);
        return car?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               car?.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchQuery, chats]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getChatInfo = (chat: Chat) => {
    const car = mockCars.find(c => c.id === chat.carId);
    return {
      carTitle: car?.title || 'Unknown Car',
      carImage: car?.images[0] || '/placeholder.svg',
      otherPersonName: car?.seller.name || 'Unknown Seller'
    };
  };

  return (
    <ResponsiveLayout>
      <div className="pt-16 md:pt-20 pb-28 md:pb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">My Chats</h1>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="space-y-3">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const { carTitle, carImage, otherPersonName } = getChatInfo(chat);
                  
                  return (
                    <Card 
                      key={chat.id} 
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/chat/${chat.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Car Image */}
                        <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={carImage} 
                            alt={carTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{carTitle}</h3>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{otherPersonName}</p>
                          {chat.lastMessage && (
                            <p className="text-xs text-gray-500 truncate">
                              {chat.lastMessage.content}
                            </p>
                          )}
                        </div>

                        {/* Time */}
                        <div className="flex flex-col items-end gap-2">
                          {chat.lastMessage && (
                            <span className="text-xs text-gray-400">
                              {formatTime(chat.lastMessage.timestamp)}
                            </span>
                          )}
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {otherPersonName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No chats yet</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'No chats match your search.' : 'Start making offers to begin chatting with sellers!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Chats;
