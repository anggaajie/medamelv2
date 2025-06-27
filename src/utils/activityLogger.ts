import { Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserActivityLog } from '@/types';
import type { Auth } from 'firebase/auth';
import { db, auth } from '@/config/firebase';

/**
 * Logs a user activity to Firestore.
 * @param authInstance Firebase Auth instance (modular)
 * @param db Firebase Firestore instance
 * @param action A string describing the action (e.g., "LOGIN_SUCCESS", "PROFILE_UPDATE")
 * @param details Optional object containing context-specific details about the activity
 */
export const logUserActivity = async (
  authInstance: Auth,
  db: Firestore,
  action: string,
  details?: Record<string, any>
): Promise<void> => {
  const currentUser = authInstance.currentUser;

  if (!currentUser) {
    // console.warn("No current user to log activity for:", action);
    return;
  }

  const logEntry: Omit<UserActivityLog, 'id'> = {
    userId: currentUser.uid,
    userDisplayName: currentUser.displayName,
    userEmail: currentUser.email,
    action: action,
    timestamp: serverTimestamp(),
    details: details || {},
  };

  try {
    await addDoc(collection(db, 'userActivityLogs'), logEntry);
  } catch (error) {
    console.error('Error logging user activity:', error, { action, details });
    // Optionally, you could try to log this failure to another system or retry
  }
};
