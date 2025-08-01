import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { playSound } from '@/utils/sounds';

export const useMessages = (chatId: string, userId?: string) => {
  const queryClient = useQueryClient();
  // Get cached data immediately, ensure type any[]
  const cachedMessages = queryClient.getQueryData(['messages', chatId]) as any[] | undefined;

  const query = useQuery<any[]>({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId || chatId === '') return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - match global config
    refetchOnMount: false, // Use global config
    refetchOnWindowFocus: false, // Use global config
    initialData: cachedMessages,
    retry: 1, // Only retry once on failure
    enabled: !!chatId && chatId !== '', // Only run query if chatId exists and is not empty
  });

  // Real-time subscription for new messages
  useEffect(() => {
    if (!chatId || chatId === '') return;
    const channel = supabase
      .channel(`room:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          // Update the messages cache immediately
          queryClient.setQueryData(['messages', chatId], (old: any[] = []) => {
            const updated = [...old, payload.new];
            // Play notification sound if not sent by current user
            if (userId && payload.new.sender_id !== userId) {
              playSound('received');
            }
            return updated;
          });
          
          // Also invalidate the query to ensure fresh data
          queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          // Update message seen/read status
          queryClient.setQueryData(['messages', chatId], (old: any[] = []) => {
            return old.map(msg => 
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            );
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient, userId]);

  return {
    messages: (query.data as any[]) || cachedMessages || [],
    isLoading: query.isLoading && !cachedMessages,
    error: query.error
  };
}; 