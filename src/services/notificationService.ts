import { supabase } from '@/lib/supabase';

export interface CreateNotificationParams {
  userId: string;
  type: 'offer' | 'chat' | 'listing' | 'system' | 'test_drive';
  title: string;
  message: string;
  relatedId?: string;
  actionUrl?: string;
  priority?: 'low' | 'medium' | 'high';
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(params: CreateNotificationParams) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: params.userId,
          type: params.type,
          title: params.title,
          message: params.message,
          related_id: params.relatedId,
          action_url: params.actionUrl,
          priority: params.priority || 'medium',
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error };
    }
  }

  /**
   * Create notification for new offer received
   */
  static async notifyNewOffer(sellerId: string, carId: string, carTitle: string, offerAmount: number) {
    return this.createNotification({
      userId: sellerId,
      type: 'offer',
      title: 'New Offer Received! 💰',
      message: `You received an offer of ₹${offerAmount.toLocaleString()} for your ${carTitle}`,
      relatedId: carId,
      actionUrl: `/profile?tab=offers`,
      priority: 'high'
    });
  }

  /**
   * Create notification for offer accepted
   */
  static async notifyOfferAccepted(buyerId: string, carId: string, carTitle: string) {
    return this.createNotification({
      userId: buyerId,
      type: 'offer',
      title: 'Offer Accepted! 🎉',
      message: `Great news! Your offer for ${carTitle} has been accepted. You can now chat with the seller.`,
      relatedId: carId,
      actionUrl: `/chat/${carId}`,
      priority: 'high'
    });
  }

  /**
   * Create notification for offer rejected
   */
  static async notifyOfferRejected(buyerId: string, carId: string, carTitle: string) {
    return this.createNotification({
      userId: buyerId,
      type: 'offer',
      title: 'Offer Update',
      message: `Your offer for ${carTitle} was not accepted. Keep browsing for other great deals!`,
      relatedId: carId,
      actionUrl: `/`,
      priority: 'medium'
    });
  }

  /**
   * Create notification for new chat message
   */
  static async notifyNewMessage(userId: string, carId: string, carTitle: string, senderName: string) {
    return this.createNotification({
      userId,
      type: 'chat',
      title: 'New Message 💬',
      message: `${senderName} sent you a message about ${carTitle}`,
      relatedId: carId,
      actionUrl: `/chat/${carId}`,
      priority: 'high'
    });
  }

  /**
   * Create notification for test drive request
   */
  static async notifyTestDriveRequest(sellerId: string, carId: string, carTitle: string, buyerName: string) {
    return this.createNotification({
      userId: sellerId,
      type: 'test_drive',
      title: 'Test Drive Request 🚙',
      message: `${buyerName} wants to schedule a test drive for ${carTitle}`,
      relatedId: carId,
      actionUrl: `/profile?tab=offers`,
      priority: 'medium'
    });
  }

  /**
   * Create notification for test drive confirmed
   */
  static async notifyTestDriveConfirmed(buyerId: string, carId: string, carTitle: string, date: string, time: string) {
    return this.createNotification({
      userId: buyerId,
      type: 'test_drive',
      title: 'Test Drive Confirmed! ✅',
      message: `Your test drive for ${carTitle} is confirmed for ${date} at ${time}`,
      relatedId: carId,
      actionUrl: `/profile?tab=offers`,
      priority: 'medium'
    });
  }

  /**
   * Create notification for listing published
   */
  static async notifyListingPublished(userId: string, carId: string, carTitle: string) {
    return this.createNotification({
      userId,
      type: 'listing',
      title: 'Listing Published! 🚗',
      message: `Your ${carTitle} listing is now live and visible to buyers`,
      relatedId: carId,
      actionUrl: `/profile?tab=listings`,
      priority: 'low'
    });
  }

  /**
   * Create notification for listing views milestone
   */
  static async notifyListingViews(userId: string, carId: string, carTitle: string, viewCount: number) {
    return this.createNotification({
      userId,
      type: 'listing',
      title: 'Great Interest! 👀',
      message: `Your ${carTitle} has received ${viewCount} views! Keep it up!`,
      relatedId: carId,
      actionUrl: `/profile?tab=listings`,
      priority: 'low'
    });
  }

  /**
   * Create notification for account verification
   */
  static async notifyAccountVerified(userId: string) {
    return this.createNotification({
      userId,
      type: 'system',
      title: 'Account Verified! ✅',
      message: 'Your account has been verified. You now have access to all features.',
      actionUrl: `/profile`,
      priority: 'medium'
    });
  }

  /**
   * Create notification for dealer registration approval
   */
  static async notifyDealerApproved(userId: string) {
    return this.createNotification({
      userId,
      type: 'system',
      title: 'Dealer Account Approved! 🏢',
      message: 'Congratulations! Your dealer account has been approved. You can now list cars as a dealer.',
      actionUrl: `/profile`,
      priority: 'high'
    });
  }

  /**
   * Create notification for price drop
   */
  static async notifyPriceDrop(userId: string, carId: string, carTitle: string, oldPrice: number, newPrice: number) {
    return this.createNotification({
      userId,
      type: 'listing',
      title: 'Price Drop Alert! 📉',
      message: `The price of ${carTitle} has dropped from ₹${oldPrice.toLocaleString()} to ₹${newPrice.toLocaleString()}`,
      relatedId: carId,
      actionUrl: `/car/${carId}`,
      priority: 'medium'
    });
  }

  /**
   * Create notification for saved car updates
   */
  static async notifySavedCarUpdate(userId: string, carId: string, carTitle: string, updateType: 'price_drop' | 'status_change' | 'new_photos') {
    const messages = {
      price_drop: `Price dropped for your saved car: ${carTitle}`,
      status_change: `Status updated for your saved car: ${carTitle}`,
      new_photos: `New photos added for your saved car: ${carTitle}`
    };

    return this.createNotification({
      userId,
      type: 'listing',
      title: 'Saved Car Update',
      message: messages[updateType],
      relatedId: carId,
      actionUrl: `/car/${carId}`,
      priority: 'low'
    });
  }

  /**
   * Create notification for system maintenance
   */
  static async notifySystemMaintenance(userId: string, message: string) {
    return this.createNotification({
      userId,
      type: 'system',
      title: 'System Maintenance',
      message,
      priority: 'medium'
    });
  }

  /**
   * Create notification for welcome message
   */
  static async notifyWelcome(userId: string, userName: string) {
    return this.createNotification({
      userId,
      type: 'system',
      title: 'Welcome to Unskip! 🎉',
      message: `Hi ${userName}! Welcome to Unskip. Start by browsing cars or listing your own vehicle.`,
      actionUrl: `/`,
      priority: 'low'
    });
  }

  /**
   * Create notification for profile completion reminder
   */
  static async notifyProfileIncomplete(userId: string) {
    return this.createNotification({
      userId,
      type: 'system',
      title: 'Complete Your Profile',
      message: 'Add more details to your profile to get better offers and responses.',
      actionUrl: `/profile`,
      priority: 'low'
    });
  }
} 