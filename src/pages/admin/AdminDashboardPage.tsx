import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import Spinner from '@/components/Spinner';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import * as Icons from '@/components/icons/PhosphorIcons';

interface AdminStats {
  totalUsers: number;
  totalJobSeekers: number;
  totalCompanies: number;
  totalTrainingProviders: number;
  totalJobPostings: number;
  activeJobPostings: number;
  totalApplications: number;
  totalTrainingPrograms: number;
  activeTrainingPrograms: number;
}

const AdminDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user counts
        const usersSnapshot = await getCountFromServer(collection(db, 'users'));
        const jobSeekersSnapshot = await getCountFromServer(query(collection(db, 'users'), where('role', '==', UserRole.JOB_SEEKER)));
        const companiesSnapshot = await getCountFromServer(query(collection(db, 'users'), where('role', '==', UserRole.COMPANY)));
        const providersSnapshot = await getCountFromServer(query(collection(db, 'users'), where('role', '==', UserRole.TRAINING_PROVIDER)));

        // Fetch job counts
        const jobsSnapshot = await getCountFromServer(collection(db, 'jobListings'));
        const activeJobsSnapshot = await getCountFromServer(query(collection(db, 'jobListings'), where('isActive', '==', true)));

        // Fetch application counts
        const applicationsSnapshot = await getCountFromServer(collection(db, 'jobApplications'));

        // Fetch training counts
        const trainingSnapshot = await getCountFromServer(collection(db, 'trainingPrograms'));
        const activeTrainingSnapshot = await getCountFromServer(query(collection(db, 'trainingPrograms'), where('isActive', '==', true)));

        setStats({
          totalUsers: usersSnapshot.data().count,
          totalJobSeekers: jobSeekersSnapshot.data().count,
          totalCompanies: companiesSnapshot.data().count,
          totalTrainingProviders: providersSnapshot.data().count,
          totalJobPostings: jobsSnapshot.data().count,
          activeJobPostings: activeJobsSnapshot.data().count,
          totalApplications: applicationsSnapshot.data().count,
          totalTrainingPrograms: trainingSnapshot.data().count,
          activeTrainingPrograms: activeTrainingSnapshot.data().count,
        });
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError('Gagal memuat statistik platform: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-96">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-slate-400 mt-4">Memuat dashboard admin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
                    Dashboard Admin
                  </h1>
                  <p className="text-lg text-slate-300 mt-2">
                    Selamat datang, {currentUser?.displayName || 'Admin'}. Kelola sistem dan pengguna platform.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-400 font-medium">Data diperbarui secara realtime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Total Pengguna</div>
                  <div className="text-3xl font-bold text-slate-100">{stats.totalUsers}</div>
                </div>
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Icons.UsersIcon size={28} weight="regular" className="text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Pencari Kerja</div>
                  <div className="text-3xl font-bold text-slate-100">{stats.totalJobSeekers}</div>
                </div>
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <Icons.UserCircleIcon size={28} weight="regular" className="text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Perusahaan</div>
                  <div className="text-3xl font-bold text-slate-100">{stats.totalCompanies}</div>
                </div>
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Icons.BuildingsIcon size={28} weight="regular" className="text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Penyedia Pelatihan</div>
                  <div className="text-3xl font-bold text-slate-100">{stats.totalTrainingProviders}</div>
                </div>
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Icons.GraduationCapIcon size={28} weight="regular" className="text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Lowongan Aktif</div>
                  <div className="text-3xl font-bold text-slate-100">{stats.activeJobPostings}</div>
                  <div className="text-xs text-slate-500">dari {stats.totalJobPostings} total</div>
                </div>
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Icons.BriefcaseIcon size={28} weight="regular" className="text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Lamaran</div>
                  <div className="text-3xl font-bold text-slate-100">{stats.totalApplications}</div>
                </div>
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <Icons.DocumentTextIcon size={28} weight="regular" className="text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Program Pelatihan Aktif</div>
                  <div className="text-3xl font-bold text-slate-100">{stats.activeTrainingPrograms}</div>
                  <div className="text-xs text-slate-500">dari {stats.totalTrainingPrograms} total</div>
                </div>
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Icons.AcademicCapIcon size={28} weight="regular" className="text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-400">Status Sistem</div>
                  <div className="text-3xl font-bold text-emerald-400">Online</div>
                </div>
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <Icons.ShieldCheckIcon size={28} weight="regular" className="text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="text-center text-slate-400">
              Gagal memuat statistik platform.
            </div>
          </div>
        )}

        {/* Management Modules Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Modul Manajemen</h2>
            <p className="text-slate-400">Akses fitur-fitur administrasi sistem</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to={APP_ROUTES.ADMIN_USER_MANAGEMENT} className="group">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/20">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-300">
                    <Icons.UsersIcon size={28} className="text-red-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors duration-300">
                      Manajemen Pengguna
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Kelola semua pengguna terdaftar, peran, dan status akun
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-700/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </Link>

            <Link to={APP_ROUTES.ADMIN_ACTIVITY_LOG} className="group">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/20">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Icons.ChartLineIcon size={28} className="text-amber-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors duration-300">
                      Pantauan Aktivitas
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Lihat dan analisis log aktivitas pengguna sistem
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-700/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
