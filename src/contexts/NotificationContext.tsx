import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  type: 'offer' | 'chat' | 'listing' | 'system' | 'test_drive';
  title: string;
  message: string;
  userId: string;
  relatedId?: string; // car_id, chat_id, etc.
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string; // URL to navigate to when clicked
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;

}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load existing notifications from database
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        return;
      }

      const formattedNotifications: Notification[] = (data || []).map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        userId: item.user_id,
        relatedId: item.related_id,
        isRead: item.is_read,
        createdAt: new Date(item.created_at),
        actionUrl: item.action_url,
        priority: item.priority || 'medium'
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      // Silent error handling
    }
  }, [user?.id]);

  // Subscribe to real-time notifications
  const subscribeToNotifications = useCallback(() => {
    if (!user?.id) return;

    const channel = supabase.channel(`notifications-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const newNotification: Notification = {
          id: payload.new.id,
          type: payload.new.type,
          title: payload.new.title,
          message: payload.new.message,
          userId: payload.new.user_id,
          relatedId: payload.new.related_id,
          isRead: false,
          createdAt: new Date(payload.new.created_at),
          actionUrl: payload.new.action_url,
          priority: payload.new.priority || 'medium'
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show toast notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
          variant: newNotification.priority === 'high' ? 'destructive' : 'default'
        });
      })
      .subscribe();

    setSubscription(channel);
  }, [user?.id, toast]);

  const unsubscribeFromNotifications = useCallback(() => {
    if (subscription) {
      supabase.removeChannel(subscription);
      setSubscription(null);
    }
  }, [subscription]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        return;
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      // Silent error handling
    }
  }, [user?.id]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        return;
      }

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      // Silent error handling
    }
  }, [user?.id]);

  // Add new notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          user_id: notification.userId,
          related_id: notification.relatedId,
          action_url: notification.actionUrl,
          priority: notification.priority,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        return;
      }

      const newNotification: Notification = {
        id: data.id,
        type: data.type,
        title: data.title,
        message: data.message,
        userId: data.user_id,
        relatedId: data.related_id,
        isRead: false,
        createdAt: new Date(data.created_at),
        actionUrl: data.action_url,
        priority: data.priority || 'medium'
      };

      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      // Silent error handling
    }
  }, [user?.id]);

  // Remove notification
  const removeNotification = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        return;
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      // Silent error handling
    }
  }, [user?.id]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        return;
      }

      setNotifications([]);
    } catch (error) {
      // Silent error handling
    }
  }, [user?.id]);



  // Load notifications and subscribe when user changes
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      subscribeToNotifications();
    } else {
      setNotifications([]);
      unsubscribeFromNotifications();
    }

    return () => {
      unsubscribeFromNotifications();
    };
  }, [user?.id, loadNotifications, subscribeToNotifications, unsubscribeFromNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications,
    subscribeToNotifications,
    unsubscribeFromNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 