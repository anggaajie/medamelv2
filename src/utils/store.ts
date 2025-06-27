import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { db } from '@/config/firebase';

// Auth Store
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// UI Store
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      theme: 'dark',
      notifications: [],
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        // Auto remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        })),
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme })
    }
  )
);

// Job Applications Store
interface JobApplicationsState {
  applications: Array<{
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    status: string;
    appliedAt: number;
  }>;
  isLoading: boolean;
  error: string | null;
  setApplications: (applications: JobApplicationsState['applications']) => void;
  addApplication: (application: JobApplicationsState['applications'][0]) => void;
  updateApplication: (id: string, updates: Partial<JobApplicationsState['applications'][0]>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useJobApplicationsStore = create<JobApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],
      isLoading: false,
      error: null,
      setApplications: (applications) => set({ applications }),
      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, application]
        })),
      updateApplication: (id, updates) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          )
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'job-applications-storage',
      partialize: (state) => ({ applications: state.applications })
    }
  )
);

// Internship Applications Store
interface InternshipApplicationsState {
  applications: Array<{
    id: string;
    internshipId: string;
    internshipTitle: string;
    companyName: string;
    status: string;
    appliedAt: number;
  }>;
  isLoading: boolean;
  error: string | null;
  setApplications: (applications: InternshipApplicationsState['applications']) => void;
  addApplication: (application: InternshipApplicationsState['applications'][0]) => void;
  updateApplication: (id: string, updates: Partial<InternshipApplicationsState['applications'][0]>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInternshipApplicationsStore = create<InternshipApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],
      isLoading: false,
      error: null,
      setApplications: (applications) => set({ applications }),
      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, application]
        })),
      updateApplication: (id, updates) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          )
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'internship-applications-storage',
      partialize: (state) => ({ applications: state.applications })
    }
  )
);

// Training Registrations Store
interface TrainingRegistrationsState {
  registrations: Array<{
    id: string;
    programId: string;
    programTitle: string;
    providerName: string;
    status: string;
    registrationDate: number;
  }>;
  isLoading: boolean;
  error: string | null;
  setRegistrations: (registrations: TrainingRegistrationsState['registrations']) => void;
  addRegistration: (registration: TrainingRegistrationsState['registrations'][0]) => void;
  updateRegistration: (id: string, updates: Partial<TrainingRegistrationsState['registrations'][0]>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTrainingRegistrationsStore = create<TrainingRegistrationsState>()(
  persist(
    (set, get) => ({
      registrations: [],
      isLoading: false,
      error: null,
      setRegistrations: (registrations) => set({ registrations }),
      addRegistration: (registration) =>
        set((state) => ({
          registrations: [...state.registrations, registration]
        })),
      updateRegistration: (id, updates) =>
        set((state) => ({
          registrations: state.registrations.map((reg) =>
            reg.id === id ? { ...reg, ...updates } : reg
          )
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'training-registrations-storage',
      partialize: (state) => ({ registrations: state.registrations })
    }
  )
);

// Global Store Selectors
export const useUserRole = () => useAuthStore((state) => state.user?.role);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useUserProfile = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useTheme = () => useUIStore((state) => state.theme);
export const useNotifications = () => useUIStore((state) => state.notifications); 