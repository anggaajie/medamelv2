import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Notification, NotificationType } from '@/types';

class NotificationService {
  private listeners: Map<string, () => void> = new Map();

  // Create a new notification
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      querySnapshot.forEach((docSnapshot) => {
        batch.update(docSnapshot.ref, {
          isRead: true,
          readAt: serverTimestamp(),
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Subscribe to real-time notifications for a user
  subscribeToNotifications(
    userId: string, 
    callback: (notifications: Notification[]) => void
  ): () => void {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
          readAt: data.readAt instanceof Timestamp ? data.readAt.toMillis() : data.readAt,
        } as Notification);
      });
      callback(notifications);
    });

    this.listeners.set(userId, unsubscribe);
    return unsubscribe;
  }

  // Get unread count for a user
  subscribeToUnreadCount(
    userId: string, 
    callback: (count: number) => void
  ): () => void {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      callback(querySnapshot.size);
    });

    this.listeners.set(`${userId}_unread`, unsubscribe);
    return unsubscribe;
  }

  // Clean up all listeners
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners.clear();
  }

  // Helper method to create system notifications
  async createSystemNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    actionUrl?: string,
    actionText?: string
  ): Promise<string> {
    return this.createNotification({
      userId,
      title,
      message,
      type,
      isRead: false,
      actionUrl,
      actionText,
    });
  }

  // Create notification for job application status change
  async createJobApplicationNotification(
    userId: string,
    jobTitle: string,
    status: string,
    companyName: string
  ): Promise<string> {
    const title = `Update Lamaran: ${jobTitle}`;
    const message = `Lamaran Anda untuk posisi ${jobTitle} di ${companyName} telah ${status.toLowerCase()}.`;
    const type = status === 'ACCEPTED' ? NotificationType.SUCCESS : 
                 status === 'REJECTED' ? NotificationType.ERROR : 
                 NotificationType.INFO;
    
    return this.createSystemNotification(userId, title, message, type);
  }

  // Create notification for training registration
  async createTrainingNotification(
    userId: string,
    trainingTitle: string,
    action: 'registered' | 'started' | 'completed'
  ): Promise<string> {
    const title = `Pelatihan: ${trainingTitle}`;
    const message = `Anda telah ${action === 'registered' ? 'mendaftar' : 
                     action === 'started' ? 'memulai' : 'menyelesaikan'} pelatihan ${trainingTitle}.`;
    const type = action === 'completed' ? NotificationType.SUCCESS : NotificationType.INFO;
    
    return this.createSystemNotification(userId, title, message, type);
  }
}

export const notificationService = new NotificationService();

// Simple function for showing toast notifications
export const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string): void => {
  // For now, we'll use console.log and alert as a simple implementation
  // In a real app, you'd integrate with a toast library like react-toastify
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // Simple alert for now - replace with proper toast implementation
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else if (type === 'success') {
    alert(`Success: ${message}`);
  }
}; 