import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, FirebaseUser, FirebaseAuth } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User, UserRole, EducationEntry } from '@/types';
import Spinner from '@/components/Spinner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  setCurrentUserFullProfile: (user: User) => void;
  clearCurrentUser: () => void;
  firebaseAuth: FirebaseAuth; // Expose auth instance if needed elsewhere, or remove
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          
          let processedEducationHistory: EducationEntry[] = [];
          const rawEducationHistory = firestoreData.educationHistory;
          if (Array.isArray(rawEducationHistory)) {
            processedEducationHistory = rawEducationHistory.filter(
              (item): item is EducationEntry => 
                typeof item === 'object' && item !== null &&
                typeof item.id === 'string' && typeof item.school === 'string'
            );
          } else if (rawEducationHistory) {
            console.warn('AuthContext: firestoreData.educationHistory was not an array, setting to empty. Value:', rawEducationHistory);
          }

          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: firestoreData.role || UserRole.JOB_SEEKER,
            status: firestoreData.status || 'active',
            dateOfBirth: firestoreData.dateOfBirth,
            nationalIdUrl: firestoreData.nationalIdUrl,
            nationalIdFileName: firestoreData.nationalIdFileName,
            taxIdUrl: firestoreData.taxIdUrl,
            taxIdFileName: firestoreData.taxIdFileName,
            gender: firestoreData.gender,
            maritalStatus: firestoreData.maritalStatus,
            religion: firestoreData.religion,
            nationality: firestoreData.nationality,
            motherName: firestoreData.motherName,
            phoneNumber: firestoreData.phoneNumber,
            address: firestoreData.address,
            socialMedia: firestoreData.socialMedia,
            educationHistory: processedEducationHistory,
            languageSkills: Array.isArray(firestoreData.languageSkills) ? firestoreData.languageSkills : [],
            workHistory: Array.isArray(firestoreData.workHistory) ? firestoreData.workHistory : [],
            profileLastUpdated: firestoreData.profileLastUpdated,
            createdAt: firestoreData.createdAt,
          });
        } else {
          const storedRole = localStorage.getItem(`userRole_${firebaseUser.uid}`);
          const role = storedRole ? JSON.parse(storedRole) as UserRole : UserRole.JOB_SEEKER;
          
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: role,
            status: 'active',
            educationHistory: [],
            languageSkills: [],
            workHistory: [],
          });
        }
      } else {
        if (currentUser) localStorage.removeItem(`userRole_${currentUser.uid}`);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrentUserFullProfile = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(`userRole_${user.uid}`, JSON.stringify(user.role));
  };
  
  const clearCurrentUser = () => {
    auth.signOut();
    if (currentUser) localStorage.removeItem(`userRole_${currentUser.uid}`);
    setCurrentUser(null);
  }

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, setCurrentUserFullProfile, clearCurrentUser, firebaseAuth: auth }}>
      {children}
    </AuthContext.Provider>
  );
};
