import { useState, useEffect, useCallback } from 'react';
import { realtimeService } from '@/utils/realtimeService';
import { User, JobListing, JobApplication, TrainingProgram, TrainingRegistration, InternshipProgram, InternshipApplication, Notification, Message, Conversation } from '@/types';
import { db } from '@/config/firebase';

// Hook for realtime job postings
export const useRealtimeJobPostings = (filters?: {
  companyId?: string;
  isActive?: boolean;
  category?: string;
  limit?: number;
}) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const listenerId = realtimeService.subscribeToJobPostings(
      (jobs) => {
        setJobs(jobs);
        setLoading(false);
      },
      filters
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [filters?.companyId, filters?.isActive, filters?.category, filters?.limit]);

  return { jobs, loading, error };
};

// Hook for realtime job applications
export const useRealtimeJobApplications = (filters: {
  applicantId?: string;
  companyId?: string;
  jobId?: string;
  status?: string;
}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const listenerId = realtimeService.subscribeToJobApplications(
      (applications) => {
        setApplications(applications);
        setLoading(false);
      },
      filters
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [filters.applicantId, filters.companyId, filters.jobId, filters.status]);

  return { applications, loading, error };
};

// Hook for realtime internship programs
export const useRealtimeInternshipPrograms = (filters?: {
  companyId?: string;
  isActive?: boolean;
  category?: string;
  limit?: number;
}) => {
  const [internships, setInternships] = useState<InternshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const listenerId = realtimeService.subscribeToInternshipPrograms(
      (internships) => {
        setInternships(internships);
        setLoading(false);
      },
      filters
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [filters?.companyId, filters?.isActive, filters?.category, filters?.limit]);

  return { internships, loading, error };
};

// Hook for realtime internship applications
export const useRealtimeInternshipApplications = (filters: {
  applicantId?: string;
  companyId?: string;
  internshipId?: string;
  status?: string;
}) => {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const listenerId = realtimeService.subscribeToInternshipApplications(
      (applications) => {
        setApplications(applications);
        setLoading(false);
      },
      filters
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [filters.applicantId, filters.companyId, filters.internshipId, filters.status]);

  return { applications, loading, error };
};

// Hook for realtime training programs
export const useRealtimeTrainingPrograms = (filters?: {
  providerId?: string;
  isActive?: boolean;
  category?: string;
  limit?: number;
}) => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const listenerId = realtimeService.subscribeToTrainingPrograms(
      (programs) => {
        setPrograms(programs);
        setLoading(false);
      },
      filters
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [filters?.providerId, filters?.isActive, filters?.category, filters?.limit]);

  return { programs, loading, error };
};

// Hook for realtime training registrations
export const useRealtimeTrainingRegistrations = (filters: {
  userId?: string;
  providerId?: string;
  programId?: string;
  status?: string;
}) => {
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const listenerId = realtimeService.subscribeToTrainingRegistrations(
      (registrations) => {
        setRegistrations(registrations);
        setLoading(false);
      },
      filters
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [filters.userId, filters.providerId, filters.programId, filters.status]);

  return { registrations, loading, error };
};

// Hook for realtime user profile
export const useRealtimeUserProfile = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const listenerId = realtimeService.subscribeToUserProfile(
      userId,
      (user) => {
        setUser(user);
        setLoading(false);
      }
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [userId]);

  return { user, loading, error };
};

// Hook for realtime application status
export const useRealtimeApplicationStatus = (applicationId: string) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) {
      setStatus(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const listenerId = realtimeService.subscribeToApplicationStatus(
      applicationId,
      (status) => {
        setStatus(status);
        setLoading(false);
      }
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [applicationId]);

  return { status, loading };
};

// Hook for realtime internship application status
export const useRealtimeInternshipApplicationStatus = (applicationId: string) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) {
      setStatus(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const listenerId = realtimeService.subscribeToInternshipApplicationStatus(
      applicationId,
      (status) => {
        setStatus(status);
        setLoading(false);
      }
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [applicationId]);

  return { status, loading };
};

// Hook for realtime training registration status
export const useRealtimeTrainingRegistrationStatus = (registrationId: string) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!registrationId) {
      setStatus(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const listenerId = realtimeService.subscribeToTrainingRegistrationStatus(
      registrationId,
      (status) => {
        setStatus(status);
        setLoading(false);
      }
    );

    return () => {
      realtimeService.unsubscribe(listenerId);
    };
  }, [registrationId]);

  return { status, loading };
};

// Cleanup hook for component unmount
export const useRealtimeCleanup = () => {
  useEffect(() => {
    return () => {
      realtimeService.cleanup();
    };
  }, []);
}; 