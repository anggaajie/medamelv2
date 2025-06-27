import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { FIREBASE_CONFIG } from '@/constants';

// For debugging purposes:
console.log("Firebase Config Object:", FIREBASE_CONFIG);

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// IMPORTANT: Ensure you have set up environment variables for Firebase configuration
// (e.g., REACT_APP_FIREBASE_API_KEY) in your build system (like Vite or Create React App).
// The values in constants.ts are placeholders and should not be committed with real credentials.
// If not using a build system, you would need to replace placeholder values in constants.ts directly,
// which is insecure for production.

export { auth, db, storage, app as firebaseApp };
export type FirebaseUser = import('firebase/auth').User;
export type FirebaseAuth = import('firebase/auth').Auth;
