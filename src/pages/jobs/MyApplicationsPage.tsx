import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { JobApplication, ApplicationStatus } from '@/types';
import Spinner from '@/components/Spinner';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { APP_ROUTES } from '@/constants';
import { DocumentTextIcon, BuildingOffice2Icon, CalendarIcon, ClockIcon } from '@/components/icons/SidebarIcons';
import { useRealtimeJobApplications } from '@/hooks/useRealtime';

const MyApplicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Use realtime hook for applications
  const { applications, loading } = useRealtimeJobApplications({
    applicantId: currentUser?.uid,
  });

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case ApplicationStatus.REJECTED:
      case ApplicationStatus.WITHDRAWN:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case ApplicationStatus.OFFERED:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case ApplicationStatus.INTERVIEWING:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-700 text-white border-slate-600';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case ApplicationStatus.REJECTED:
      case ApplicationStatus.WITHDRAWN:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case ApplicationStatus.OFFERED:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ApplicationStatus.INTERVIEWING:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
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

  if (loading) return <Spinner fullPage />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Lamaran Saya
          </h1>
          <p className="text-lg text-slate-100 max-w-2xl mx-auto">
            Pantau status lamaran pekerjaan Anda dan lihat perkembangan aplikasi yang telah Anda kirimkan.
            <span className="block text-sm text-blue-400 mt-2">
              🔄 Data diperbarui secara realtime
            </span>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {applications.length === 0 && !loading ? (
          <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Belum Ada Lamaran</h2>
            <p className="text-slate-100 mb-6">Anda belum mengirimkan lamaran pekerjaan apapun. Mulai cari lowongan dan kirim lamaran Anda sekarang!</p>
            <Link 
              to={APP_ROUTES.JOBS} 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Lowongan
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:shadow-2xl hover:border-slate-600 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-100 hover:text-blue-400 transition-colors">
                      <Link to={APP_ROUTES.JOB_DETAIL.replace(':jobId', app.jobId)}>
                        {app.jobTitle}
                      </Link>
                    </h3>
                    <div className="flex items-center mt-2 text-slate-100">
                      <BuildingOffice2Icon className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{app.companyName}</span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1">
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-slate-100">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Lamar: {new Date(app.appliedAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  {app.lastStatusUpdate && (
                    <div className="flex items-center text-slate-100">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Update: {new Date(app.lastStatusUpdate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )}
                </div>
                
                {app.resumeUrl && (
                  <div className="border-t border-slate-700 pt-4">
                    <a 
                      href={app.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      <DocumentTextIcon className="w-4 h-4 mr-1" />
                      Lihat CV yang dikirim
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
