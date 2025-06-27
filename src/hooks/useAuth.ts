import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  // Expose the renamed function if needed, or adjust based on how ProfilePage calls it.
  // The ProfilePage will now call `setCurrentUserFullProfile`.
  return context; 
};
