import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { ChatMessage } from '@/types/chat';
import { Car } from '@/types/car';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/components/chat/ChatHeader';
import type { Seller } from '@/types/car';
import { useToast } from '@/components/ui/use-toast';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import Chats from './Chats';
import { useMessages } from '@/hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import { playSound } from '@/utils/sounds';

function toSeller(user: any): Seller {
  return {
    id: user?.id || '',
    name: user?.name || '',
    type: user?.type || 'individual',
    phone: user?.phone || '',
    email: user?.email || '',
    verified: user?.verified || false,
    dealerVerified: user?.dealerVerified || false,
    rating: user?.rating || 0,
    totalSales: user?.totalSales || 0,
    memberSince: user?.memberSince || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    businessName: user?.businessName || '',
  };
}

// Map database snake_case to UI camelCase
function mapDbMessageToUi(msg: any): ChatMessage {
  return {
    id: msg.id,
    chatId: msg.chat_id,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id,
    content: msg.content,
    timestamp: msg.created_at,
    seen: msg.seen ?? false,
    type: msg.message_type || 'text',
  };
}

const ChatDetail = ({ onBack }: { onBack?: () => void }) => {
  const { chatId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [carImages, setCarImages] = useState<any[]>([]);
  const [carImagesLoading, setCarImagesLoading] = useState(false);
  const [loading, setLoading] = useState(true); // <-- Add loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Optimistic message sending
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);

  useRealtimeRefetch('chat_messages', ['chatMessages']);
  useRealtimeRefetch('chats', ['chats']);

  const { messages, isLoading } = useMessages(chatId!, user?.id);

  useEffect(() => {
    if (!chatId || !user) return;

    const fetchChatData = async () => {
      // Step 1: Fetch chat, car, and users
      const { data: chatData } = await supabase
        .from('chats')
        .select(`
          *,
          car:cars!car_id(*),
          buyer:users!buyer_id(id, name, avatar),
          seller:users!seller_id(id, name, avatar)
        `)
        .eq('id', chatId)
        .single();
      if (!chatData) return;
      setChat(chatData);
      setOtherUser(user.id === chatData.buyer_id ? toSeller(chatData.seller) : toSeller(chatData.buyer));
      // Compose a minimal Car object for ChatHeader
      const carData = chatData.car;
      setCar({
        id: carData.id,
        title: `${carData.year} ${carData.make} ${carData.model}`,
        brand: carData.make,
        model: carData.model,
        variant: carData.variant,
        year: carData.year,
        price: carData.price,
        images: [], // Not used, but required by type
        mileage: carData.kilometers_driven || 0,
        kilometersDriven: carData.kilometers_driven || 0,
        fuelType: carData.fuel_type,
        transmission: carData.transmission,
        ownership: carData.number_of_owners || 1,
        ownershipNumber: carData.number_of_owners || 1,
        location: [carData.area, carData.city].filter(Boolean).join(', '),
        description: carData.description || '',
        seller: toSeller(chatData.seller),
        seller_type: toSeller(chatData.seller).type,
        color: carData.color,
        landmark: carData.landmark,
        seatingCapacity: carData.seating_capacity,
        isRentAvailable: carData.is_rent_available,
        rentPrice: undefined,
        rentPolicies: undefined,
        rentType: undefined,
        verified: carData.verified,
        featured: carData.featured,
        views: carData.views || 0,
        createdAt: carData.created_at,
        registrationYear: carData.registration_year,
        registrationState: carData.registration_state,
        fitnessCertificateValidTill: carData.fitness_certificate_valid_till,
        noAccidentHistory: carData.no_accident_history,
        acceptOffers: carData.accept_offers,
        offerPercentage: carData.offer_percentage,
        insuranceValid: carData.insurance_valid,
        insuranceValidTill: carData.insurance_valid_till,
        insuranceType: carData.insurance_type,
        lastServiceDate: carData.last_service_date,
        serviceCenterType: carData.service_center_type,
        serviceAtAuthorized: carData.authorized_service_center,
        rtoTransferSupport: carData.rto_transfer_support,
        insurance: undefined,
        serviceHistory: undefined,
      });
      // Step 2: Fetch car_images for this car
      setCarImagesLoading(true);
      let carImages: any[] = [];
      if (carData?.id) {
        const { data: images } = await supabase
          .from('car_images')
          .select('id, car_id, image_url, is_cover, sort_order')
          .eq('car_id', carData.id);
        carImages = images || [];
      }
      setCarImages(carImages);
      setCarImagesLoading(false);

      // Get existing messages
      // fetchMessages(chatId); // This is now handled by useMessages
    };
    fetchChatData();
  }, [chatId, user]);

  // Real-time subscription for all chat message events
  useEffect(() => {
    if (!chatId) return;
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        () => {
          // This will trigger a re-fetch of messages via useMessages
        }
      )
      // Also listen to changes in the parent chat row
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `id=eq.${chatId}`
        },
        () => {
          // Refetch chat, car, and users
          if (user) {
            (async () => {
              const { data: chatData } = await supabase
                .from('chats')
                .select(`
                  *,
                  car:cars!car_id(*),
                  buyer:users!buyer_id(id, name, avatar),
                  seller:users!seller_id(id, name, avatar)
                `)
                .eq('id', chatId)
                .single();
              if (!chatData) return;
              setChat(chatData);
              setOtherUser(user.id === chatData.buyer_id ? toSeller(chatData.seller) : toSeller(chatData.buyer));
              const carData = chatData.car;
              setCar({
                id: carData.id,
                title: `${carData.year} ${carData.make} ${carData.model}`,
                brand: carData.make,
                model: carData.model,
                variant: carData.variant,
                year: carData.year,
                price: carData.price,
                images: [],
                mileage: carData.kilometers_driven || 0,
                kilometersDriven: carData.kilometers_driven || 0,
                fuelType: carData.fuel_type,
                transmission: carData.transmission,
                ownership: carData.number_of_owners || 1,
                ownershipNumber: carData.number_of_owners || 1,
                location: [carData.area, carData.city].filter(Boolean).join(', '),
                description: carData.description || '',
                seller: toSeller(chatData.seller),
                seller_type: toSeller(chatData.seller).type,
                color: carData.color,
                landmark: carData.landmark,
                seatingCapacity: carData.seating_capacity,
                isRentAvailable: carData.is_rent_available,
                rentPrice: undefined,
                rentPolicies: undefined,
                rentType: undefined,
                verified: carData.verified,
                featured: carData.featured,
                views: carData.views || 0,
                createdAt: carData.created_at,
                registrationYear: carData.registration_year,
                registrationState: carData.registration_state,
                fitnessCertificateValidTill: carData.fitness_certificate_valid_till,
                noAccidentHistory: carData.no_accident_history,
                acceptOffers: carData.accept_offers,
                offerPercentage: carData.offer_percentage,
                insuranceValid: carData.insurance_valid,
                insuranceValidTill: carData.insurance_valid_till,
                insuranceType: carData.insurance_type,
                lastServiceDate: carData.last_service_date,
                serviceCenterType: carData.service_center_type,
                serviceAtAuthorized: carData.authorized_service_center,
                rtoTransferSupport: carData.rto_transfer_support,
                insurance: undefined,
                serviceHistory: undefined,
              });
            })();
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user]);

  // Mark all messages as seen when chat is opened or messages are updated
  useEffect(() => {
    if (!chatId || !user) return;
    const markMessagesAsSeen = async () => {
      try {
        // Log user.id and all receiverIds for debug
        const userIdStr = String(user.id).trim();
        const allReceiverIds = messages.map(m => String(m.receiverId).trim());
        if (!allReceiverIds.includes(userIdStr)) {
        }
        // Use normalized string comparison for unseenMessages
        const unseenMessages = messages.filter(m => String(m.receiverId).trim() === userIdStr && !m.seen);
        const { data, error } = await supabase
          .from('chat_messages')
          .update({ seen: true })
          .eq('chat_id', chatId)
          .eq('receiver_id', userIdStr)
          .eq('seen', false);
        if (error) {
          if (toast) {
            toast({ title: 'Failed to mark messages as seen', description: error.message, variant: 'destructive' });
          } else {
          }
        }
        // Fallback: manually refetch unread count in header if available
        if ((window as any).__unskipUnreadRefetch) {
          (window as any).__unskipUnreadRefetch();
        }
      } catch (err) {
        if (toast) {
          toast({ title: 'Error marking messages as seen', description: String(err), variant: 'destructive' });
        }
      }
    };
    if (messages.length > 0) {
      markMessagesAsSeen();
    }
  }, [chatId, user, messages]);

  // Mark all messages as read when opening a chat
  useEffect(() => {
    if (!chatId || !user) return;
    // Mark all messages as read
    const markAsRead = async () => {
      await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('receiver_id', user.id)
        .is('read_at', null);
    };
    markAsRead();
  }, [chatId, user]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Optimistic send
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !otherUser || !chatId) return;
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      chat_id: chatId,
      sender_id: user.id,
      receiver_id: otherUser.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      seen: false,
      read_at: null,
      pending: true,
    };
    // Optimistically add to cache
    queryClient.setQueryData(['messages', chatId], (old = []) => ([...(old as any[]), tempMessage]));
    setNewMessage('');
    // Send to server
    const { data, error } = await supabase.from('chat_messages').insert({
      chat_id: chatId,
      sender_id: user.id,
      receiver_id: otherUser.id,
      content: tempMessage.content,
    }).select().single();
    if (data) {
      queryClient.setQueryData(['messages', chatId], (old = []) =>
        (old as any[]).map(msg => msg.id === tempId ? data : msg)
      );
      playSound('sent');
    } else if (error) {
      queryClient.setQueryData(['messages', chatId], (old = []) =>
        (old as any[]).map(msg =>
          msg.id === tempId
            ? { ...msg, pending: false, failed: true }
            : msg
        )
      );
    }
  };

  // Quick reply
  const handleQuickReply = (text: string) => {
    setNewMessage(text);
  };

  // Test drive scheduling
  const handleTestDrive = () => {
    const message = "I'd like to schedule a test drive. When are you available?";
    setNewMessage(message);
  };

  // Merge messages and pendingMessages for display
  const allMessages = [...messages, ...pendingMessages];

  const HEADER_HEIGHT = 64; // px
  const INPUT_HEIGHT = 80; // px

  // WhatsApp-like layout with sticky header/input and scrollable messages
  if (messages && messages.length > 0) {
    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header (no back arrow, 3-dot menu on right) */}
        <ChatHeader
          car={car}
          otherUser={otherUser}
          currentUser={user}
          chat={chat}
          carImages={carImages}
          onReportChat={() => toast({ title: 'Report chat', description: 'Feature coming soon!' })}
          onBlockUser={() => toast({ title: 'Block user', description: 'Feature coming soon!' })}
          onDeleteConversation={() => toast({ title: 'Delete conversation', description: 'Feature coming soon!' })}
          onBack={onBack || (() => navigate('/chats'))}
        />
        {/* Messages */}
        <ChatMessages messages={messages} isTyping={isTyping} user={user} otherUser={otherUser} car={car} />
        {/* Input */}
        <ChatInput
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          onSendMessage={handleSendMessage}
          onQuickReply={handleQuickReply}
          onTestDrive={handleTestDrive}
          isBuyer={user?.id === chat?.buyer_id}
        />
      </div>
    );
  }
  return <div className="flex-1 flex flex-col h-full items-center justify-center text-gray-500">No messages yet.</div>;
};

export default ChatDetail;
