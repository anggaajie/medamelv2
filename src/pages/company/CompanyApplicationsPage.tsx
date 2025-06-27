import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { InternshipApplication, InternshipApplicationStatus, UserRole } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import * as Icons from '@/components/icons/PhosphorIcons';
import { useRealtimeInternshipApplications, useRealtimeInternshipPrograms } from '@/hooks/useRealtime';
import InternshipApplicationStatusBadge from '@/components/InternshipApplicationStatusBadge';

const CompanyInternshipApplicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [filterInternshipId, setFilterInternshipId] = useState<string>('');

  const { applications, loading: applicationsLoading } = useRealtimeInternshipApplications({
    companyId: currentUser?.uid,
    internshipId: filterInternshipId || undefined,
  });

  const { internships: companyInternships, loading: internshipsLoading } = useRealtimeInternshipPrograms({
    companyId: currentUser?.uid,
    isActive: true,
  });

  if (internshipsLoading && companyInternships.length === 0) return <Spinner fullPage={true} />;
  if (applicationsLoading && applications.length === 0) return <Spinner fullPage={true} />;

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="page-title mb-2">Pelamar Magang</h1>
          <p className="text-secondary">Kelola dan pantau pelamar program magang Anda <span className="text-blue-400 ml-2">🔄 Live</span></p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div>
            <label htmlFor="internshipFilter" className="sr-only">Filter berdasarkan Program Magang</label>
            <select 
              id="internshipFilter"
              value={filterInternshipId}
              onChange={(e) => setFilterInternshipId(e.target.value)}
              className="form-select text-sm"
              aria-label="Filter berdasarkan program magang"
            >
              <option value="">Semua Program Magang</option>
              {companyInternships.map(internship => (
                <option key={internship.id} value={internship.id}>{internship.title}</option>
              ))}
            </select>
          </div>
          <Link to={APP_ROUTES.COMPANY_INTERNSHIPS} className="btn-secondary">
            <Icons.ArrowLeftIcon size={20} />
            <span className="ml-2">Kembali ke Program</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Icons.WarningIcon size={20} className="text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {applicationsLoading && applications.length > 0 && <Spinner />}

      {applications.length === 0 && !applicationsLoading ? (
        <div className="content-card text-center py-12">
          <div className="text-slate-400 mb-4">
            <Icons.UsersIcon size={64} />
          </div>
          <h3 className="section-title mb-2">Belum Ada Pelamar</h3>
          <p className="text-secondary mb-6">
            {filterInternshipId 
              ? "Tidak ada pelamar untuk program magang yang dipilih." 
              : "Tidak ada pelamar untuk program magang Anda."
            }
          </p>
          <Link to={APP_ROUTES.COMPANY_INTERNSHIPS} className="btn-primary">
            <Icons.BriefcaseIcon size={20} />
            <span className="ml-2">Lihat Program Magang</span>
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead className="table-thead">
              <tr>
                <th className="table-th">
                  Pelamar
                </th>
                <th className="table-th">
                  Program Magang
                </th>
                <th className="table-th">
                  Tanggal Lamar
                </th>
                <th className="table-th">
                  Status
                </th>
                <th className="table-th">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {applications.map(application => (
                <tr key={application.id}>
                  <td className="table-td">
                    <div className="text-sm font-medium text-slate-100">{application.applicantName}</div>
                    <div className="text-sm text-secondary">{application.applicantEmail}</div>
                  </td>
                  <td className="table-td">
                    <Link 
                      to={APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', application.internshipId)} 
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {application.internshipTitle}
                    </Link>
                  </td>
                  <td className="table-td text-secondary">
                    {new Date(application.appliedAt).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="table-td">
                    <InternshipApplicationStatusBadge 
                      applicationId={application.id} 
                      initialStatus={application.status}
                    />
                  </td>
                  <td className="table-td space-x-2">
                    <Link 
                      to={APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', application.internshipId)} 
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Detail
                    </Link>
                    {application.resumeUrl && (
                      <a 
                        href={application.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-green-400 hover:text-green-300"
                      >
                        CV
                      </a>
                    )}
                    {application.portfolioUrl && (
                      <a 
                        href={application.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Portfolio
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistics */}
      {applications.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="content-card p-4 text-center">
            <div className="text-2xl font-bold text-slate-100 mb-1">
              {applications.filter(app => app.status === InternshipApplicationStatus.PENDING).length}
            </div>
            <div className="text-sm text-secondary">Menunggu Review</div>
          </div>
          <div className="content-card p-4 text-center">
            <div className="text-2xl font-bold text-slate-100 mb-1">
              {applications.filter(app => app.status === InternshipApplicationStatus.SHORTLISTED).length}
            </div>
            <div className="text-sm text-secondary">Shortlisted</div>
          </div>
          <div className="content-card p-4 text-center">
            <div className="text-2xl font-bold text-slate-100 mb-1">
              {applications.filter(app => app.status === InternshipApplicationStatus.INTERVIEW_SCHEDULED).length}
            </div>
            <div className="text-sm text-secondary">Interview</div>
          </div>
          <div className="content-card p-4 text-center">
            <div className="text-2xl font-bold text-slate-100 mb-1">
              {applications.filter(app => app.status === InternshipApplicationStatus.ACCEPTED).length}
            </div>
            <div className="text-sm text-secondary">Diterima</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInternshipApplicationsPage;