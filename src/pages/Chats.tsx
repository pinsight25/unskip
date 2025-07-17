
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';

const Chats = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [carImagesMap, setCarImagesMap] = useState<Record<string, any[]>>({});
  const [carImagesLoading, setCarImagesLoading] = useState(false);

  // Fetch real chats from database
  const { data: chats = [], isLoading, refetch } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      // Step 1: Fetch chats with car and users (no car_images join)
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          car:cars(id, make, model, year, price),
          buyer:users!buyer_id(id, name, avatar),
          seller:users!seller_id(id, name, avatar),
          last_message:chat_messages!chat_id(
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });
      if (error) {
        console.error('Error fetching chats:', error);
        return [];
      }
      // Step 2: Fetch car_images for all cars in batch
      setCarImagesLoading(true);
      const carIds = (data || []).map((chat: any) => chat.car?.id).filter(Boolean);
      let carImagesMap: Record<string, any[]> = {};
      if (carIds.length > 0) {
        const { data: images } = await supabase
          .from('car_images')
          .select('id, car_id, image_url, is_cover, sort_order')
          .in('car_id', carIds);
        if (images) {
          for (const img of images) {
            if (!carImagesMap[img.car_id]) carImagesMap[img.car_id] = [];
            carImagesMap[img.car_id].push(img);
          }
        }
      }
      setCarImagesMap(carImagesMap);
      setCarImagesLoading(false);
      // Attach carImageUrl to each chat
      const chatsWithImages = (data || []).map((chat: any) => {
        let carImageUrl = null;
        const images = carImagesMap[chat.car?.id] || [];
        if (images.length > 0) {
          const cover = images.find((img: any) => img.is_cover);
          carImageUrl = cover ? cover.image_url : images[0].image_url;
        }
        return {
          ...chat,
          carImageUrl,
        };
      });
      // Get last message for each chat
      const chatsWithLastMessage = await Promise.all(
        chatsWithImages.map(async (chat) => {
          if (chat.last_message && Array.isArray(chat.last_message)) {
            chat.last_message = chat.last_message[0] || null;
          }
          return chat;
        })
      );
      return chatsWithLastMessage;
    },
    enabled: !!user?.id,
    // refetchInterval: 5000, // Remove polling, rely on real-time
  });

  // Supabase real-time subscription for chats and chat_messages
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel('realtime-chats-and-messages')
      // Listen to changes in chats table (buyer or seller)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `buyer_id=eq.${user.id}`
        },
        () => { refetch(); }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `seller_id=eq.${user.id}`
        },
        () => { refetch(); }
      )
      // Listen to changes in chat_messages table (receiver or sender)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => { refetch(); }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `sender_id=eq.${user.id}`
        },
        () => { refetch(); }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  const filteredChats = searchQuery
    ? chats.filter(chat => {
        const carName = `${chat.car?.year || ''} ${chat.car?.make || ''} ${chat.car?.model || ''}`.toLowerCase();
        const otherUser = user?.id === chat.buyer_id ? chat.seller : chat.buyer;
        const userName = otherUser?.name?.toLowerCase() || '';
        return carName.includes(searchQuery.toLowerCase()) || 
               userName.includes(searchQuery.toLowerCase());
      })
    : chats;

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (isLoading || carImagesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Chats</h1>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      {/* Chats List */}
      <div className="space-y-2">
        {filteredChats.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? 'No chats found matching your search'
                  : 'Start a conversation by making an offer on a car'}
              </p>
            </div>
          </Card>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = user?.id === chat.buyer_id ? chat.seller : chat.buyer;
            const isBuyer = user?.id === chat.buyer_id;
            const carImage = chat.carImageUrl || '/placeholder-car.jpg';
            const isUnread = chat.unread_count > 0;
            return (
              <Card 
                key={chat.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/chats/${chat.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Car Image */}
                  <div className="relative">
                    <img
                      src={carImage}
                      alt={`${chat.car?.make || ''} ${chat.car?.model || ''}`}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-car.jpg';
                      }}
                    />
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </div>
                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {(chat.car?.year || '')} {(chat.car?.make || '')} {(chat.car?.model || '')}
                      </h3>
                      {chat.last_message && (
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {otherUser?.name || (isBuyer ? 'Seller' : 'Buyer')}
                    </p>
                    {chat.last_message && (
                      <p className="text-sm text-gray-500 truncate">
                        {chat.last_message.sender_id === user?.id && 'You: '}
                        {chat.last_message.content}
                      </p>
                    )}
                  </div>
                  {/* Unread Badge */}
                  {isUnread && (
                    <Badge variant="destructive" className="ml-2">
                      {chat.unread_count}
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chats;
