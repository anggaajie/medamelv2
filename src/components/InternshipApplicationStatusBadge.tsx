import React from 'react';
import { InternshipApplicationStatus } from '@/types';
import { useRealtimeInternshipApplicationStatus } from '@/hooks/useRealtime';

interface InternshipApplicationStatusBadgeProps {
  applicationId: string;
  initialStatus?: InternshipApplicationStatus;
  className?: string;
}

const InternshipApplicationStatusBadge: React.FC<InternshipApplicationStatusBadgeProps> = ({ 
  applicationId, 
  initialStatus,
  className = "" 
}) => {
  const { status, loading } = useRealtimeInternshipApplicationStatus(applicationId);
  
  const currentStatus = (status as InternshipApplicationStatus) || initialStatus || InternshipApplicationStatus.PENDING;

  const getStatusColor = (status: InternshipApplicationStatus) => {
    switch (status) {
      case InternshipApplicationStatus.ACCEPTED:
      case InternshipApplicationStatus.OFFERED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case InternshipApplicationStatus.REJECTED:
      case InternshipApplicationStatus.WITHDRAWN:
        return 'bg-red-100 text-red-800 border-red-200';
      case InternshipApplicationStatus.INTERVIEW_SCHEDULED:
      case InternshipApplicationStatus.INTERVIEW_COMPLETED:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case InternshipApplicationStatus.SHORTLISTED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case InternshipApplicationStatus.UNDER_REVIEW:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: InternshipApplicationStatus) => {
    switch (status) {
      case InternshipApplicationStatus.ACCEPTED:
      case InternshipApplicationStatus.OFFERED:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case InternshipApplicationStatus.REJECTED:
      case InternshipApplicationStatus.WITHDRAWN:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case InternshipApplicationStatus.INTERVIEW_SCHEDULED:
      case InternshipApplicationStatus.INTERVIEW_COMPLETED:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case InternshipApplicationStatus.SHORTLISTED:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case InternshipApplicationStatus.UNDER_REVIEW:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(currentStatus)}`}>
        {getStatusIcon(currentStatus)}
        <span className="ml-1">
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </span>
        {loading && (
          <div className="ml-2 w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        )}
      </span>
      {status && (
        <span className="ml-2 text-xs text-blue-600 animate-pulse">
          🔄 Live
        </span>
      )}
    </div>
  );
};

export default InternshipApplicationStatusBadge; 