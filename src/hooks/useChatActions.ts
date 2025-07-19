import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export function useReportChat() {
  const { user } = useUser();
  return useMutation({
    mutationFn: async ({ chatId, reportedUserId, reason }: { chatId: string, reportedUserId: string, reason: string }) => {
      // @ts-ignore: custom table
      const { error } = await (supabase.from as any)('chat_reports')
        .insert({
          chat_id: chatId,
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          reason
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Chat reported successfully', variant: 'default' });
    },
    onError: (error: any) => {
      toast({ title: error.message || 'Failed to report chat', variant: 'destructive' });
    }
  });
}

export function useBlockUser() {
  const { user } = useUser();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ blockedUserId, chatId }: { blockedUserId: string, chatId: string }) => {
      // @ts-ignore: custom table
      const { error } = await (supabase.from as any)('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: blockedUserId,
          chat_id: chatId
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'User blocked successfully', variant: 'default' });
      navigate('/chats');
    },
    onError: (error: any) => {
      toast({ title: error.message || 'Failed to block user', variant: 'destructive' });
    }
  });
}

export function useDeleteChat() {
  const { user } = useUser();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ chatId, userRole }: { chatId: string, userRole: 'buyer' | 'seller' }) => {
      const updateColumn = userRole === 'buyer' ? 'deleted_for_buyer' : 'deleted_for_seller';
      const { error } = await supabase
        .from('chats')
        .update({ [updateColumn]: true })
        .eq('id', chatId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Conversation deleted', variant: 'default' });
      navigate('/chats');
    },
    onError: (error: any) => {
      toast({ title: error.message || 'Failed to delete conversation', variant: 'destructive' });
    }
  });
} 