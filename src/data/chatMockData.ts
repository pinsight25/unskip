
import { Chat, ChatMessage, TestDriveBooking, QuickReply } from '@/types/chat';

export const quickReplies: QuickReply[] = [
  { id: '1', text: 'Available for test drive', category: 'meeting' },
  { id: '2', text: "What's your best price?", category: 'price' },
  { id: '3', text: 'All documents ready?', category: 'documents' },
  { id: '4', text: 'When can we meet?', category: 'meeting' },
];

// Generate chat IDs based on car ID and user ID
export const generateChatId = (carId: string, userId: string = 'buyer1') => {
  return `chat_${carId}_${userId}`;
};

export const mockChats: Chat[] = [
  {
    id: generateChatId('1'),
    carId: '1',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    unreadCount: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    status: 'active'
  },
  {
    id: generateChatId('2'),
    carId: '2',
    buyerId: 'buyer1',
    sellerId: 'seller2',
    unreadCount: 0,
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T16:20:00Z',
    status: 'active'
  },
  {
    id: generateChatId('3'),
    carId: '3',
    buyerId: 'buyer1',
    sellerId: 'seller3',
    unreadCount: 1,
    createdAt: '2024-01-13T15:20:00Z',
    updatedAt: '2024-01-13T18:45:00Z',
    status: 'active'
  },
  {
    id: generateChatId('4'),
    carId: '4',
    buyerId: 'buyer1',
    sellerId: 'seller4',
    unreadCount: 0,
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-12T14:15:00Z',
    status: 'active'
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    chatId: generateChatId('1'),
    senderId: 'seller1',
    receiverId: 'buyer1',
    content: "Hi! Thanks for your interest in my 2022 Maruti Swift. It's in excellent condition.",
    timestamp: '2024-01-15T10:00:00Z',
    seen: true,
    type: 'text'
  },
  {
    id: '2',
    chatId: generateChatId('1'),
    senderId: 'buyer1',
    receiverId: 'seller1',
    content: 'Great! Can I schedule a test drive for this weekend?',
    timestamp: '2024-01-15T14:30:00Z',
    seen: false,
    type: 'text'
  },
  {
    id: '3',
    chatId: generateChatId('2'),
    senderId: 'seller2',
    receiverId: 'buyer1',
    content: "Hello! I see you're interested in my Honda City. Feel free to ask any questions.",
    timestamp: '2024-01-14T09:00:00Z',
    seen: true,
    type: 'text'
  },
  {
    id: '4',
    chatId: generateChatId('2'),
    senderId: 'buyer1',
    receiverId: 'seller2',
    content: 'What is the service history like?',
    timestamp: '2024-01-14T16:20:00Z',
    seen: true,
    type: 'text'
  }
];

export const mockTestDrives: TestDriveBooking[] = [
  {
    id: '1',
    carId: '1',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    chatId: generateChatId('1'),
    scheduledDate: '2024-01-20',
    timeSlot: '10:00 AM',
    buyerName: 'John Doe',
    buyerPhone: '+91 98765 43210',
    status: 'pending',
    createdAt: '2024-01-15T15:00:00Z'
  }
];

export const timeSlots = [
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: true },
  { time: '4:00 PM', available: false },
  { time: '5:00 PM', available: true },
  { time: '6:00 PM', available: true },
];
