import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InternshipApplication, InternshipApplicationStatus } from '@/types';
import { APP_ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import * as Icons from '@/components/icons/PhosphorIcons';
import { useRealtimeInternshipApplications } from '@/hooks/useRealtime';
import InternshipApplicationStatusBadge from '@/components/InternshipApplicationStatusBadge';
import { DocumentTextIcon, BuildingOffice2Icon, CalendarIcon, ClockIcon } from '@/components/icons/SidebarIcons';

const MyInternshipApplicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Use realtime hook for applications
  const { applications, loading } = useRealtimeInternshipApplications({
    applicantId: currentUser?.uid,
  });

  if (loading) return <Spinner fullPage={true} />;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Lamaran Magang Saya</h1>
        <p className="text-white">Kelola dan pantau status lamaran program magang Anda <span className="text-blue-400 ml-2">🔄 Live</span></p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-2xl flex flex-col items-center justify-center text-center py-12">
          <div className="flex items-center justify-center mb-4 w-full">
            <Icons.BriefcaseIcon size={64} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Lamaran</h3>
          <p className="text-white mb-6">Anda belum melamar untuk program magang apapun.</p>
          <Link to={APP_ROUTES.INTERNSHIPS} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200">
            <Icons.SearchIcon size={20} />
            <span className="ml-2">Cari Program Magang</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map(application => (
            <div key={application.id} className="bg-slate-800 border border-slate-700 shadow-lg rounded-xl p-6 hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                    <Link to={APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', application.internshipId)}>
                      {application.internshipTitle}
                    </Link>
                  </h3>
                  <p className="text-white mt-1">{application.companyName}</p>
                  <div className="flex items-center mt-2 text-slate-100">
                    <Icons.CalendarIcon size={16} className="mr-2" />
                    <span className="text-sm">
                      Lamar: {new Date(application.appliedAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <InternshipApplicationStatusBadge applicationId={application.id} initialStatus={application.status} />
                </div>
              </div>
              
              {application.interviewDate && (
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">Interview:</span>
                    <span className="font-semibold text-slate-100">
                      {new Date(application.interviewDate).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {application.interviewLocation && (
                    <div className="text-blue-300 text-sm mt-1">
                      Lokasi: {application.interviewLocation}
                    </div>
                  )}
                </div>
              )}
              
              {application.assessmentNotes && (
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 mb-4">
                  <div className="text-sm">
                    <span className="text-white font-semibold">Catatan:</span>
                    <p className="text-white mt-1">{application.assessmentNotes}</p>
                  </div>
                </div>
              )}
              
              <div className="border-t border-slate-700 pt-4">
                <Link 
                  to={APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', application.internshipId)} 
                  className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
                >
                  <Icons.EyeIcon size={16} className="mr-2" />
                  Lihat Detail Program
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInternshipApplicationsPage; 
