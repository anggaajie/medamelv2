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
  getDocs,
  limit,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Message, Conversation, MessageType } from '@/types';

class MessageService {
  private listeners: Map<string, () => void> = new Map();

  // Create a new conversation
  async createConversation(participants: string[], isGroupChat: boolean = false, groupName?: string): Promise<string> {
    try {
      const conversationData: Omit<Conversation, 'id'> = {
        participants,
        lastActivity: Date.now(),
        unreadCount: {},
        isGroupChat,
        groupName,
        createdAt: Date.now(),
      };

      // Initialize unread count for all participants
      participants.forEach(userId => {
        conversationData.unreadCount[userId] = 0;
      });

      const docRef = await addDoc(collection(db, 'conversations'), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    type: MessageType = MessageType.TEXT,
    senderAvatar?: string,
    attachments?: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
      size: number;
    }>
  ): Promise<string> {
    try {
      const messageData: Omit<Message, 'id'> = {
        conversationId,
        senderId,
        senderName,
        senderAvatar,
        content,
        type,
        timestamp: Date.now(),
        isRead: false,
        attachments,
      };

      const messageRef = await addDoc(collection(db, 'messages'), messageData);

      // Update conversation's last message and activity
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: messageData,
        lastActivity: Date.now(),
      });

      // Update unread count for other participants
      const conversationDoc = await getDocs(query(
        collection(db, 'conversations'),
        where('__name__', '==', conversationId)
      ));
      
      if (!conversationDoc.empty) {
        const conversation = conversationDoc.docs[0].data() as Conversation;
        const unreadCount = { ...conversation.unreadCount };
        
        conversation.participants.forEach(participantId => {
          if (participantId !== senderId) {
            unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
          }
        });

        await updateDoc(conversationRef, { unreadCount });
      }

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark messages as read in a conversation
  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      // Mark all unread messages as read
      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId),
        where('isRead', '==', false)
      );

      const messagesSnapshot = await getDocs(messagesQuery);
      const batch = writeBatch(db);

      messagesSnapshot.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
      });

      await batch.commit();

      // Reset unread count for this user
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDocs(query(
        collection(db, 'conversations'),
        where('__name__', '==', conversationId)
      ));

      if (!conversationDoc.empty) {
        const conversation = conversationDoc.docs[0].data() as Conversation;
        const unreadCount = { ...conversation.unreadCount };
        unreadCount[userId] = 0;

        await updateDoc(conversationRef, { unreadCount });
      }
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }

  // Subscribe to messages in a conversation
  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void,
    messageLimit: number = 50
  ): () => void {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
        } as Message);
      });
      // Sort by timestamp ascending for display
      messages.sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    });

    this.listeners.set(`messages_${conversationId}`, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to user's conversations
  subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ): () => void {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastActivity', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversations: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          ...data,
          lastActivity: data.lastActivity instanceof Timestamp ? data.lastActivity.toMillis() : data.lastActivity,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
        } as Conversation);
      });
      callback(conversations);
    });

    this.listeners.set(`conversations_${userId}`, unsubscribe);
    return unsubscribe;
  }

  // Get unread message count for a user
  subscribeToUnreadMessageCount(
    userId: string,
    callback: (count: number) => void
  ): () => void {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let totalUnread = 0;
      querySnapshot.forEach((doc) => {
        const conversation = doc.data() as Conversation;
        totalUnread += conversation.unreadCount[userId] || 0;
      });
      callback(totalUnread);
    });

    this.listeners.set(`unread_messages_${userId}`, unsubscribe);
    return unsubscribe;
  }

  // Delete a message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      // Delete all messages in the conversation
      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      const batch = writeBatch(db);

      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete the conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      batch.delete(conversationRef);

      await batch.commit();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  // Clean up all listeners
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners.clear();
  }

  // Helper method to find or create a direct conversation between two users
  async findOrCreateDirectConversation(userId1: string, userId2: string): Promise<string> {
    try {
      // Check if conversation already exists
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId1),
        where('isGroupChat', '==', false)
      );

      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        const conversation = doc.data() as Conversation;
        if (conversation.participants.includes(userId2) && conversation.participants.length === 2) {
          return doc.id;
        }
      }

      // Create new conversation if none exists
      return await this.createConversation([userId1, userId2], false);
    } catch (error) {
      console.error('Error finding or creating conversation:', error);
      throw error;
    }
  }
}

export const messageService = new MessageService(); 