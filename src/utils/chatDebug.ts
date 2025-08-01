import { supabase } from '@/lib/supabase';

export const debugChatIssues = async () => {
  try {
    // Test 1: Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🔍 Chat Debug - User authenticated:', !!user, user?.id);

    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Test 2: Check if chats table is accessible
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select('id')
      .limit(1);
    
    console.log('🔍 Chat Debug - Chats table accessible:', !chatsError, chats?.length);

    // Test 3: Check if chat_messages table is accessible
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('id')
      .limit(1);
    
    console.log('🔍 Chat Debug - Messages table accessible:', !messagesError, messages?.length);

    // Test 4: Check user's existing chats
    const { data: userChats, error: userChatsError } = await supabase
      .from('chats')
      .select('id, car_id, buyer_id, seller_id')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .limit(5);
    
    console.log('🔍 Chat Debug - User chats:', userChats?.length, userChatsError);

    return {
      user: user.id,
      chatsAccessible: !chatsError,
      messagesAccessible: !messagesError,
      userChats: userChats?.length || 0,
      errors: {
        chats: chatsError?.message,
        messages: messagesError?.message,
        userChats: userChatsError?.message
      }
    };
  } catch (error: any) {
    console.error('🔍 Chat Debug - Error:', error);
    return { error: error.message };
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).debugChatIssues = debugChatIssues;
} 