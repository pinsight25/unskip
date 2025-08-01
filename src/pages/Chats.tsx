
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useMessages } from '@/hooks/useMessages';

const Chats = ({ onBack }: { onBack?: () => void }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [carImagesMap, setCarImagesMap] = useState<Record<string, any[]>>({});
  const [carImagesLoading, setCarImagesLoading] = useState(false);
  const isMobile = useIsMobile();

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
        // console.error('Error fetching chats:', error);
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
    staleTime: 2 * 60 * 1000, // 2 minutes - match global config
    refetchOnMount: false, // Use global config
    refetchOnWindowFocus: false, // Use global config
    retry: 1, // Only retry once on failure
  });

  const { data: allMessages = [] } = useQuery({
    queryKey: ['allMessages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes - match global config
  });

  // Remove conflicting real-time refetch hooks - handle subscriptions manually

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
        () => { 
          // Debounced refetch to prevent excessive calls
          setTimeout(() => refetch(), 100);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `seller_id=eq.${user.id}`
        },
        () => { 
          // Debounced refetch to prevent excessive calls
          setTimeout(() => refetch(), 100);
        }
      )
      // Listen to changes in chat_messages table (receiver or sender)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => { 
          // Debounced refetch to prevent excessive calls
          setTimeout(() => refetch(), 100);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => { 
          // Debounced refetch to prevent excessive calls
          setTimeout(() => refetch(), 100);
        }
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

  // Render chat list for both desktop and mobile
  return (
    <div className="w-full max-w-[380px] h-screen border-r border-gray-200 bg-white flex flex-col" style={{ minWidth: 0 }}>
      {/* DESKTOP HEADER (always visible on md+) */}
      <div className="hidden md:flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={() => (onBack ? onBack() : navigate('/'))} className="mr-2 text-gray-500 hover:text-primary focus:outline-none">
          <span className="text-xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">My Chats</h2>
      </div>
      {/* DESKTOP SEARCH BAR (always visible on md+) */}
      <div className="hidden md:block relative p-2 border-b border-gray-100 bg-white">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 py-2 text-sm rounded bg-gray-50 border border-gray-200"
        />
      </div>
      {/* MOBILE HEADER (only visible on mobile) */}
      <div className="flex md:hidden items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={() => (onBack ? onBack() : navigate('/'))} className="mr-2 text-gray-500 hover:text-primary focus:outline-none">
          <span className="text-xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">My Chats</h2>
      </div>
      {/* MOBILE SEARCH BAR (only visible on mobile) */}
      <div className="block md:hidden relative p-2 border-b border-gray-100 bg-white">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-3 text-base rounded bg-gray-50 border border-gray-200 min-h-[44px]"
          style={{minHeight:44}}
        />
      </div>
      {/* Chat list container - always render for both desktop and mobile */}
      <div className="flex-1 overflow-y-auto min-h-0 pt-14 md:pt-0" style={{maxHeight:'calc(100dvh - 56px - 48px)'}}>
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No chats found matching your search' : 'Start a conversation by making an offer on a car'}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const carImage = chat.carImageUrl || '/placeholder-car.jpg';
            const unreadCount = allMessages.filter(
              m => m.chat_id === chat.id && m.sender_id !== user?.id && !m.read_at
            ).length;
            return (
              <div
                key={chat.id}
                className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition group relative min-h-[64px]"
                style={{minHeight:64, minWidth:0, touchAction:'manipulation'}}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                {/* Car Image */}
                <img
                  src={carImage}
                  alt={`${chat.car?.make || ''} ${chat.car?.model || ''}`}
                  className="w-12 h-12 rounded-full object-cover border"
                  style={{minWidth:48, minHeight:48}}
                  onError={(e) => { e.currentTarget.src = '/placeholder-car.jpg'; }}
                />
                {/* Car Info */}
                <div className="flex-1 ml-3 min-w-0">
                  <div className="font-semibold text-base truncate">
                    {(chat.car?.year || '')} {(chat.car?.make || '')} {(chat.car?.model || '')}
                  </div>
                  <div className="text-sm text-gray-600 truncate mt-1">
                    {chat.last_message?.content || 'No messages yet'}
                  </div>
                </div>
                {/* Time and Unread Badge */}
                <div className="text-right ml-2 flex flex-col items-end min-w-[56px]">
                  <div className="text-xs text-gray-500 mb-1">
                    {chat.last_message ? formatTime(chat.last_message.created_at) : ''}
                  </div>
                  {unreadCount > 0 && (
                    <div className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chats;
