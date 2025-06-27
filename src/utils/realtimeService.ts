import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  JobListing, 
  JobApplication, 
  InternshipProgram, 
  InternshipApplication, 
  TrainingProgram, 
  TrainingRegistration,
  Notification,
  User,
  Message,
  Conversation
} from '@/types';

class RealtimeService {
  private listeners: Map<string, () => void> = new Map();

  // Clean up all listeners
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners.clear();
  }

  // Clean up specific listener
  unsubscribe(listenerId: string): void {
    const unsubscribe = this.listeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(listenerId);
    }
  }

  // Job Postings Realtime
  subscribeToJobPostings(
    callback: (jobs: JobListing[]) => void,
    filters?: {
      companyId?: string;
      isActive?: boolean;
      category?: string;
      limit?: number;
    }
  ): string {
    let q = query(collection(db, 'jobPostings'), orderBy('postedAt', 'desc'));
    
    if (filters?.companyId) {
      q = query(q, where('companyId', '==', filters.companyId));
    }
    if (filters?.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobs: JobListing[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        jobs.push({
          id: doc.id,
          ...data,
          postedAt: data.postedAt instanceof Timestamp ? data.postedAt.toMillis() : data.postedAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : data.updatedAt,
        } as unknown as JobListing);
      });
      callback(jobs);
    });

    const listenerId = `jobPostings_${filters?.companyId || 'all'}_${Date.now()}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Job Applications Realtime
  subscribeToJobApplications(
    callback: (applications: JobApplication[]) => void,
    filters: {
      applicantId?: string;
      companyId?: string;
      jobId?: string;
      status?: string;
    }
  ): string {
    let q = query(collection(db, 'jobApplications'), orderBy('appliedAt', 'desc'));
    
    if (filters.applicantId) {
      q = query(q, where('applicantId', '==', filters.applicantId));
    }
    if (filters.companyId) {
      q = query(q, where('companyId', '==', filters.companyId));
    }
    if (filters.jobId) {
      q = query(q, where('jobId', '==', filters.jobId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const applications: JobApplication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        applications.push({
          id: doc.id,
          ...data,
          appliedAt: data.appliedAt instanceof Timestamp ? data.appliedAt.toMillis() : data.appliedAt,
          lastAssessmentUpdate: data.lastAssessmentUpdate instanceof Timestamp ? data.lastAssessmentUpdate.toMillis() : data.lastAssessmentUpdate,
        } as JobApplication);
      });
      callback(applications);
    });

    const listenerId = `jobApplications_${filters.applicantId || filters.companyId || 'all'}_${Date.now()}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Internship Programs Realtime
  subscribeToInternshipPrograms(
    callback: (internships: InternshipProgram[]) => void,
    filters?: {
      companyId?: string;
      isActive?: boolean;
      category?: string;
      limit?: number;
    }
  ): string {
    let q = query(collection(db, 'internshipPrograms'), orderBy('postedAt', 'desc'));
    
    if (filters?.companyId) {
      q = query(q, where('companyId', '==', filters.companyId));
    }
    if (filters?.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const internships: InternshipProgram[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        internships.push({
          id: doc.id,
          ...data,
          postedAt: data.postedAt instanceof Timestamp ? data.postedAt.toMillis() : data.postedAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : data.updatedAt,
        } as InternshipProgram);
      });
      callback(internships);
    });

    const listenerId = `internshipPrograms_${filters?.companyId || 'all'}_${Date.now()}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Internship Applications Realtime
  subscribeToInternshipApplications(
    callback: (applications: InternshipApplication[]) => void,
    filters: {
      applicantId?: string;
      companyId?: string;
      internshipId?: string;
      status?: string;
    }
  ): string {
    let q = query(collection(db, 'internshipApplications'), orderBy('appliedAt', 'desc'));
    
    if (filters.applicantId) {
      q = query(q, where('applicantId', '==', filters.applicantId));
    }
    if (filters.companyId) {
      q = query(q, where('companyId', '==', filters.companyId));
    }
    if (filters.internshipId) {
      q = query(q, where('internshipId', '==', filters.internshipId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const applications: InternshipApplication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        applications.push({
          id: doc.id,
          ...data,
          appliedAt: data.appliedAt instanceof Timestamp ? data.appliedAt.toMillis() : data.appliedAt,
          lastAssessmentUpdate: data.lastAssessmentUpdate instanceof Timestamp ? data.lastAssessmentUpdate.toMillis() : data.lastAssessmentUpdate,
        } as InternshipApplication);
      });
      callback(applications);
    });

    const listenerId = `internshipApplications_${filters.applicantId || filters.companyId || 'all'}_${Date.now()}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Training Programs Realtime
  subscribeToTrainingPrograms(
    callback: (programs: TrainingProgram[]) => void,
    filters?: {
      providerId?: string;
      isActive?: boolean;
      category?: string;
      limit?: number;
    }
  ): string {
    let q = query(collection(db, 'trainingPrograms'), orderBy('postedAt', 'desc'));
    
    if (filters?.providerId) {
      q = query(q, where('providerId', '==', filters.providerId));
    }
    if (filters?.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const programs: TrainingProgram[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        programs.push({
          id: doc.id,
          ...data,
          postedAt: data.postedAt instanceof Timestamp ? data.postedAt.toMillis() : data.postedAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : data.updatedAt,
        } as TrainingProgram);
      });
      callback(programs);
    });

    const listenerId = `trainingPrograms_${filters?.providerId || 'all'}_${Date.now()}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Training Registrations Realtime
  subscribeToTrainingRegistrations(
    callback: (registrations: TrainingRegistration[]) => void,
    filters: {
      userId?: string;
      providerId?: string;
      programId?: string;
      status?: string;
    }
  ): string {
    let q = query(collection(db, 'trainingRegistrations'), orderBy('registeredAt', 'desc'));
    
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    if (filters.providerId) {
      q = query(q, where('providerId', '==', filters.providerId));
    }
    if (filters.programId) {
      q = query(q, where('programId', '==', filters.programId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const registrations: TrainingRegistration[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        registrations.push({
          id: doc.id,
          ...data,
          registeredAt: data.registeredAt instanceof Timestamp ? data.registeredAt.toMillis() : data.registeredAt,
          completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toMillis() : data.completedAt,
        } as unknown as TrainingRegistration);
      });
      callback(registrations);
    });

    const listenerId = `trainingRegistrations_${filters.userId || filters.providerId || 'all'}_${Date.now()}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // User Profile Realtime
  subscribeToUserProfile(
    userId: string,
    callback: (user: User | null) => void
  ): string {
    const userDocRef = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const user: User = {
          uid: docSnapshot.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
          profileLastUpdated: data.profileLastUpdated instanceof Timestamp ? data.profileLastUpdated.toMillis() : data.profileLastUpdated,
        } as User;
        callback(user);
      } else {
        callback(null);
      }
    });

    const listenerId = `userProfile_${userId}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Application Status Changes Realtime
  subscribeToApplicationStatus(
    applicationId: string,
    callback: (status: string) => void
  ): string {
    const appDocRef = doc(db, 'jobApplications', applicationId);
    
    const unsubscribe = onSnapshot(appDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        callback(data.status);
      }
    });

    const listenerId = `applicationStatus_${applicationId}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Internship Application Status Changes Realtime
  subscribeToInternshipApplicationStatus(
    applicationId: string,
    callback: (status: string) => void
  ): string {
    const appDocRef = doc(db, 'internshipApplications', applicationId);
    
    const unsubscribe = onSnapshot(appDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        callback(data.status);
      }
    });

    const listenerId = `internshipApplicationStatus_${applicationId}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Training Registration Status Changes Realtime
  subscribeToTrainingRegistrationStatus(
    registrationId: string,
    callback: (status: string) => void
  ): string {
    const regDocRef = doc(db, 'trainingRegistrations', registrationId);
    
    const unsubscribe = onSnapshot(regDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        callback(data.status);
      }
    });

    const listenerId = `trainingRegistrationStatus_${registrationId}`;
    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }
}

export const realtimeService = new RealtimeService(); 