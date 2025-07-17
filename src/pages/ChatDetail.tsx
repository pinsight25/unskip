
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

const ChatDetail = () => {
  const { chatId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [carImages, setCarImages] = useState<any[]>([]);
  const [carImagesLoading, setCarImagesLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat details and messages
  const fetchMessages = async (chatId: string) => {
    const messagesData = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    setMessages(Array.isArray(messagesData?.data) ? messagesData.data.map(mapDbMessageToUi) : []);
  };

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
      fetchMessages(chatId);
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
          fetchMessages(chatId);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Mark all messages as seen when chat is opened or messages are updated
  useEffect(() => {
    if (!chatId || !user) return;
    const markMessagesAsSeen = async () => {
      await supabase
        .from('chat_messages')
        .update({ seen: true })
        .eq('chat_id', chatId)
        .eq('receiver_id', user.id)
        .eq('seen', false);
    };
    if (messages.length > 0) {
      markMessagesAsSeen();
    }
  }, [chatId, user, messages]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !otherUser || !chatId) return;

    // Create optimistic message with correct shape
    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId: chatId,
      senderId: user.id,
      receiverId: otherUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      seen: false,
      type: 'text'
    };
    
    // Add to UI immediately
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    // Send to database (snake_case)
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        receiver_id: otherUser.id,
        content: newMessage.trim(),
        message_type: 'text'
      });

    if (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      setNewMessage(newMessage); // Restore input
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

  if (!chat || !car || !otherUser || carImagesLoading) {
    return <div className="flex items-center justify-center h-screen">Loading chat...</div>;
  }

  const isBuyer = user?.id === chat?.buyer_id;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-200px)] md:max-h-[600px]">
        <ChatHeader 
          car={car}
          otherUser={otherUser}
          currentUser={user}
          chat={chat}
          onBack={() => navigate('/chats')}
          onReportChat={() => console.log('Report chat')}
          onBlockUser={() => console.log('Block user')}
          onDeleteConversation={() => console.log('Delete conversation')}
          carImages={carImages}
        />
        <div className="h-[400px] overflow-y-auto flex-1">
          <ChatMessages 
            messages={messages}
            isTyping={isTyping}
          />
          <div ref={messagesEndRef} />
        </div>
        <ChatInput
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          onSendMessage={handleSendMessage}
          onQuickReply={handleQuickReply}
          onTestDrive={handleTestDrive}
          isBuyer={isBuyer}
        />
      </div>
    </div>
  );
};

export default ChatDetail;
