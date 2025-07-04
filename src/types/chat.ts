
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  seen: boolean;
  type: 'text' | 'system' | 'test_drive';
}

export interface Chat {
  id: string;
  carId: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'blocked' | 'archived';
}

export interface TestDriveBooking {
  id: string;
  carId: string;
  buyerId: string;
  sellerId: string;
  chatId: string;
  scheduledDate: string;
  timeSlot: string;
  buyerName: string;
  buyerPhone: string;
  alternatePhone?: string;
  specialRequests?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface QuickReply {
  id: string;
  text: string;
  category: 'general' | 'price' | 'meeting' | 'documents';
}
