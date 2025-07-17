
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
