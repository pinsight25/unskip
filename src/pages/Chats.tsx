
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
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { Skeleton } from '@/components/ui/skeleton';

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

  useRealtimeRefetch('chat_messages', ['chats', user?.id]);
  useRealtimeRefetch('chats', ['chats', user?.id]);

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

  // Show skeleton loader only if there is no cached data (first visit)
  if ((isLoading || carImagesLoading) && (!chats || chats.length === 0)) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Chats</h1>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px] h-screen border-r border-gray-200 bg-white flex flex-col" style={{ minWidth: 0 }}>
      {/* Sidebar Header */}
      <div className="px-4 py-1 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center gap-2" style={{ marginTop: 0, paddingTop: 0 }}>
        <button onClick={() => navigate('/')} className="mr-1 text-gray-500 hover:text-primary focus:outline-none">
          <span className="text-xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">My Chats</h2>
      </div>
      {/* Search Bar */}
      <div className="relative p-2 border-b border-gray-100 bg-white" style={{ marginTop: 0, paddingTop: 0 }}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 py-2 text-sm rounded bg-gray-50 border border-gray-200"
        />
      </div>
      {/* Chats List */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ maxHeight: 'calc(100vh - 56px - 48px)' }}>
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery 
                ? 'No chats found matching your search'
                : 'Start a conversation by making an offer on a car'}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = user?.id === chat.buyer_id ? chat.seller : chat.buyer;
            const isBuyer = user?.id === chat.buyer_id;
            const carImage = chat.carImageUrl || '/placeholder-car.jpg';
            const isUnread = chat.unread_count > 0;
            return (
              <div
                key={chat.id}
                className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition group relative"
                style={{ minHeight: 56 }}
                onClick={() => navigate(`/chats/${chat.id}`)}
              >
                {/* Car Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={carImage}
                    alt={`${chat.car?.make || ''} ${chat.car?.model || ''}`}
                    className="w-11 h-11 rounded object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-car.jpg';
                    }}
                  />
                </div>
                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">
                      {(chat.car?.year || '')} {(chat.car?.make || '')} {(chat.car?.model || '')}
                    </h3>
                    {chat.last_message && (
                      <span className="text-xs text-gray-400 ml-2">
                        {formatTime(chat.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600 truncate max-w-[100px]">
                      {otherUser?.name || (isBuyer ? 'Seller' : 'Buyer')}
                    </span>
                  </div>
                  {chat.last_message && (
                    <p className="text-xs text-gray-500 truncate max-w-[180px] mt-0.5">
                      {chat.last_message.sender_id === user?.id && 'You: '}
                      {chat.last_message.content}
                    </p>
                  )}
                </div>
                {/* Unread badge (WhatsApp style) */}
                {isUnread && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center shadow">
                    {chat.unread_count}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chats;
