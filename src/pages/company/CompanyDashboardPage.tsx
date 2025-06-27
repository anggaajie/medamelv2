import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { APP_ROUTES } from '@/constants';
import Spinner from '@/components/Spinner';
import { UserRole } from '@/types';
import CreateInterviewRoomModal from '@/components/company/CreateInterviewRoomModal';
import * as Icons from '@/components/icons/PhosphorIcons';

interface CompanyStats {
  activeJobs: number;
  totalApplications: number;
}

const CompanyDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser || (currentUser.role !== UserRole.COMPANY && currentUser.role !== UserRole.ADMIN)) {
        setLoadingStats(false);
        return;
      }

      setLoadingStats(true);
      try {
        let activeJobsCount = 0;
        let totalApplicationsCount = 0;

        const jobsQuery = currentUser.role === UserRole.ADMIN 
            ? query(collection(db, 'jobListings'), where('isActive', '==', true))
            : query(collection(db, 'jobListings'), where('companyId', '==', currentUser.uid), where('isActive', '==', true));
        const activeJobsSnapshot = await getCountFromServer(jobsQuery);
        activeJobsCount = activeJobsSnapshot.data().count;

        const applicationsQuery = currentUser.role === UserRole.ADMIN
            ? collection(db, 'jobApplications')
            : query(collection(db, 'jobApplications'), where('companyId', '==', currentUser.uid));
        const totalApplicationsSnapshot = await getCountFromServer(applicationsQuery);
        totalApplicationsCount = totalApplicationsSnapshot.data().count;
        
        setStats({
          activeJobs: activeJobsCount,
          totalApplications: totalApplicationsCount,
        });
      } catch (error) {
        console.error("Error fetching company stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (!currentUser) return <Spinner fullPage />;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="content-card p-8 mb-8">
        <h1 className="page-title mb-2">Dasbor Perusahaan</h1>
        <p className="text-muted">Kelola lowongan kerja dan proses rekrutmen perusahaan Anda</p>
      </div>

      {/* Stats Cards */}
      {loadingStats ? (
        <div className="content-card p-8 text-center mb-8">
          <Spinner />
          <p className="mt-4 text-muted">Memuat statistik...</p>
        </div>
      ) : stats ? (
        <div className="grid-3 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-card-label">Lowongan Aktif</div>
                <div className="stat-card-value">{stats.activeJobs}</div>
              </div>
              <div className="stat-card-icon bg-indigo-100">
                <Icons.BriefcaseIcon size={24} className="icon-indigo" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-card-label">Total Pelamar</div>
                <div className="stat-card-value">{stats.totalApplications}</div>
              </div>
              <div className="stat-card-icon bg-green-100">
                <Icons.UsersIcon size={24} className="icon-green" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="stat-card-label">Wawancara Video</div>
                  <div className="text-lg font-semibold text-slate-900">LiveKit</div>
                </div>
                <div className="stat-card-icon bg-purple-100">
                  <Icons.VideoCameraIcon size={24} className="icon-purple" />
                </div>
              </div>
              <button 
                onClick={() => setIsCreateRoomModalOpen(true)}
                className="btn-primary text-sm py-2"
              >
                <Icons.PlusCircleIcon size={16} className="mr-2" />
                Buat Ruang Wawancara
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert-error mb-8">
          Tidak dapat memuat statistik saat ini.
        </div>
      )}

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="section-title mb-6">Aksi Cepat</h2>
        <div className="grid-3">
          <Link to={APP_ROUTES.POST_JOB} className="action-card group">
            <div className="action-card-icon bg-indigo-100">
              <Icons.PlusCircleIcon size={24} className="icon-indigo" />
            </div>
            <div className="action-card-title">Posting Lowongan Baru</div>
            <div className="action-card-description">
              Buat dan publikasikan lowongan untuk menarik kandidat
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link to={APP_ROUTES.COMPANY_JOBS} className="action-card group">
            <div className="action-card-icon bg-blue-100">
              <Icons.MenuIcon size={24} className="icon-blue" />
            </div>
            <div className="action-card-title">Kelola Lowongan</div>
            <div className="action-card-description">
              Lihat, edit, atau nonaktifkan lowongan yang sudah ada
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link to={APP_ROUTES.COMPANY_APPLICATIONS} className="action-card group">
            <div className="action-card-icon bg-green-100">
              <Icons.CheckCircleIcon size={24} className="icon-green" />
            </div>
            <div className="action-card-title">Tinjau Pelamar</div>
            <div className="action-card-description">
              Lihat dan kelola status pelamar untuk lowongan Anda
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* Advanced Features */}
      <div className="content-card p-8">
        <h2 className="section-title mb-4">Fitur Rekrutmen Lanjutan</h2>
        <p className="text-muted mb-6">
          Tingkatkan proses rekrutmen Anda dengan fitur-fitur canggih:
        </p>
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 mt-1">
              <Icons.VideoCameraIcon size={20} className="icon-purple" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Wawancara Video LiveKit</h4>
              <p className="text-sm text-muted">
                Lakukan wawancara langsung dengan kandidat melalui platform video terintegrasi. 
                Klik tombol "Buat Ruang Wawancara" di atas untuk memulai.
              </p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 mt-1">
              <Icons.ChartLineIcon size={20} className="icon-yellow" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Analitik Rekrutmen (Segera Hadir)</h4>
              <p className="text-sm text-muted">
                Dapatkan wawasan mendalam tentang efektivitas rekrutmen Anda, sumber kandidat, 
                waktu pengisian posisi, dan lainnya.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreateInterviewRoomModal 
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
      />
    </div>
  );
};

export default CompanyDashboardPage;