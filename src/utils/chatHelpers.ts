// Utility function to generate a chat ID based on car ID and user ID
export const generateChatId = (carId: string, userId: string = 'buyer1') => {
  return `chat_${carId}_${userId}`;
}; 