import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase'; 
import { useAuth } from '@/hooks/useAuth';
import { JobListing, UserRole } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import JobApplicationModal from '@/components/jobs/JobApplicationModal'; 
import { logUserActivity } from '@/utils/activityLogger'; 
import { useRealtimeJobPostings } from '@/hooks/useRealtime';
import * as Icons from '@/components/icons/PhosphorIcons';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false); 

  // Use realtime hook for job detail
  const { jobs, loading } = useRealtimeJobPostings({
    isActive: true,
  });

  // Get the specific job
  const job = jobs.find(j => j.id === jobId);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Gaji tidak dicantumkan';
    const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `Mulai dari ${formatter.format(min)}`;
    if (max) return `Hingga ${formatter.format(max)}`;
    return 'Gaji tidak dicantumkan';
  };
  
  const handleDeleteJob = async () => {
    if (!jobId || !job || !(currentUser?.role === UserRole.ADMIN || currentUser?.uid === job.companyId) || !auth.currentUser ) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak dapat diurungkan.")) {
        try {
            await deleteDoc(doc(db, 'jobListings', jobId));
            await logUserActivity(auth, db, 'JOB_DELETE_SUCCESS', { jobId, jobTitle: job.title });
            navigate(APP_ROUTES.JOBS);
        } catch (err: any) {
            console.error("Error deleting job:", err);
            setError("Gagal menghapus lowongan. Silakan coba lagi.");
            await logUserActivity(auth, db, 'JOB_DELETE_FAILURE', { jobId, jobTitle: job.title, error: err.message });
        }
    }
  };

  if (loading) return <Spinner fullPage={true} />;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;
  if (!job) return <p className="text-center p-8">Lowongan tidak ditemukan.</p>;

  const canEditOrDelete = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.uid === job.companyId);

  return (
    <div className="page-container">
      <div className="content-card p-6 md:p-8">
        {!job.isActive && (
            <div className="mb-4 p-3 bg-yellow-900/50 text-yellow-200 rounded-md text-sm">
                <Icons.WarningIcon size={16} className="inline mr-2" />
                Lowongan ini saat ini tidak aktif dan tidak terlihat oleh pencari kerja umum.
            </div>
        )}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-6 border-b border-slate-700">
          <div className="flex items-start space-x-4 mb-4 md:mb-0">
            {job.companyLogoUrl ? (
              <img src={job.companyLogoUrl} alt={`${job.companyName} logo`} className="w-20 h-20 object-contain rounded-lg border border-slate-600 p-1" />
            ) : (
              <div className="w-20 h-20 bg-blue-900 text-blue-300 flex items-center justify-center rounded-lg text-3xl font-bold">
                {job.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-100">{job.title}</h1>
              <p className="text-xl text-slate-300">{job.companyName}</p>
              <p className="text-md text-slate-400">
                <Icons.MapPinIcon size={16} className="inline mr-2 text-blue-400" />
                {job.location}
              </p>
              <div className="flex items-center mt-2 text-blue-400 text-sm">
                <Icons.ArrowRightIcon size={16} className="mr-1" />
                <span>Data diperbarui secara realtime</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col md:items-end space-y-3">
            {currentUser?.role === UserRole.JOB_SEEKER && job.isActive && (
                 <button 
                    onClick={() => setShowApplicationModal(true)} 
                    className="btn-primary w-full md:w-auto py-2 px-6 text-lg"
                  >
                   <Icons.ArrowRightIcon size={20} className="mr-2" />
                   Lamar Sekarang
                 </button>
            )}
            {canEditOrDelete && (
                <div className="flex space-x-2 w-full md:w-auto">
                    <Link 
                        to={APP_ROUTES.EDIT_JOB.replace(':jobId', job.id)}
                        className="btn-secondary w-full md:w-auto py-2 px-4 text-sm"
                    >
                        <Icons.PencilIcon size={16} className="mr-2" />
                        Ubah Lowongan
                    </Link>
                    <button 
                        onClick={handleDeleteJob}
                        className="btn-danger w-full md:w-auto py-2 px-4 text-sm"
                    >
                        <Icons.TrashIcon size={16} className="mr-2" />
                        Hapus
                    </button>
                </div>
            )}
            <p className="text-xs text-slate-500 text-center md:text-right">
              Diposting: {new Date(job.postedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-900/50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-300 mb-1">
              <Icons.BriefcaseIcon size={16} className="inline mr-2" />
              Tipe Pekerjaan
            </h3>
            <p className="text-slate-200">{job.jobType}</p>
          </div>
          <div className="bg-blue-900/50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-300 mb-1">
              <Icons.ChartLineIcon size={16} className="inline mr-2" />
              Tingkat Pengalaman
            </h3>
            <p className="text-slate-200">{job.experienceLevel}</p>
          </div>
          <div className="bg-emerald-900/50 p-4 rounded-lg">
            <h3 className="font-semibold text-emerald-300 mb-1">
              <Icons.DollarIcon size={16} className="inline mr-2" />
              Gaji
            </h3>
            <p className="text-slate-200">{formatSalary(job.salaryMin, job.salaryMax)}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">Deskripsi Pekerjaan</h2>
          <div className="prose max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>

        {/* Requirements */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">Kualifikasi</h2>
          <div className="prose max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: job.requirements }} />
        </div>
        
        {/* Skills */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-100 mb-3">Keterampilan yang Dibutuhkan</h2>
                <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map(skill => (
                        <span key={skill} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Industry */}
        {job.industry && (
             <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-100 mb-3">Industri</h2>
                <p className="text-slate-300">{job.industry}</p>
            </div>
        )}
      </div>
      {showApplicationModal && job && ( 
        <JobApplicationModal 
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          jobId={job.id}
          jobTitle={job.title}
          companyId={job.companyId}
          companyName={job.companyName}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
