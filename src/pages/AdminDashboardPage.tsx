import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';
import Spinner from '@/components/Spinner';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

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
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoadingStats(true);
      try {
        const usersCol = collection(db, "users");
        const jobsCol = collection(db, "jobListings");
        const trainingsCol = collection(db, "trainingPrograms");
        const applicationsCol = collection(db, "jobApplications");

        const [
          totalUsersSnap,
          jobSeekersSnap,
          companiesSnap,
          trainingProvidersSnap,
          totalJobsSnap,
          activeJobsSnap,
          totalApplicationsSnap,
          totalTrainingsSnap,
          activeTrainingsSnap
        ] = await Promise.all([
          getCountFromServer(usersCol),
          getCountFromServer(query(usersCol, where("role", "==", "Pencari Kerja"))),
          getCountFromServer(query(usersCol, where("role", "==", "Perusahaan"))),
          getCountFromServer(query(usersCol, where("role", "==", "Penyedia Pelatihan"))),
          getCountFromServer(jobsCol),
          getCountFromServer(query(jobsCol, where("isActive", "==", true))),
          getCountFromServer(applicationsCol),
          getCountFromServer(trainingsCol),
          getCountFromServer(query(trainingsCol, where("isActive", "==", true))),
        ]);

        setStats({
          totalUsers: totalUsersSnap.data().count,
          totalJobSeekers: jobSeekersSnap.data().count,
          totalCompanies: companiesSnap.data().count,
          totalTrainingProviders: trainingProvidersSnap.data().count,
          totalJobPostings: totalJobsSnap.data().count,
          activeJobPostings: activeJobsSnap.data().count,
          totalApplications: totalApplicationsSnap.data().count,
          totalTrainingPrograms: totalTrainingsSnap.data().count,
          activeTrainingPrograms: activeTrainingsSnap.data().count,
        });

      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (currentUser?.role === 'Admin') {
      fetchAdminStats();
    } else {
      setLoadingStats(false);
    }
  }, [currentUser]);


  if (!currentUser || currentUser.role !== 'Admin') {
    return <p className="text-lg text-red-700 p-8">Akses ditolak. Halaman ini hanya untuk Administrator.</p>;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-3xl font-bold text-red-600 mb-8">Dasbor Admin</h1>
      
      {/* Data Visualization Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Visualisasi Data Platform</h2>
        {loadingStats ? <Spinner/> : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Stats */}
                <div className="bg-sky-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-sky-700 mb-2"><i className="fas fa-users mr-2"></i>Statistik Pengguna</h3>
                    <p className="text-sm text-gray-600">Total Pengguna: <span className="font-bold">{stats.totalUsers}</span></p>
                    <p className="text-sm text-gray-600">Pencari Kerja: <span className="font-bold">{stats.totalJobSeekers}</span></p>
                    <p className="text-sm text-gray-600">Perusahaan: <span className="font-bold">{stats.totalCompanies}</span></p>
                    <p className="text-sm text-gray-600">Penyedia Pelatihan: <span className="font-bold">{stats.totalTrainingProviders}</span></p>
                    <p className="text-xs text-gray-400 mt-2">(Grafik distribusi peran segera hadir)</p>
                </div>
                {/* Job Stats */}
                <div className="bg-green-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-green-700 mb-2"><i className="fas fa-briefcase mr-2"></i>Statistik Lowongan</h3>
                    <p className="text-sm text-gray-600">Total Lowongan: <span className="font-bold">{stats.totalJobPostings}</span></p>
                    <p className="text-sm text-gray-600">Lowongan Aktif: <span className="font-bold">{stats.activeJobPostings}</span></p>
                    <p className="text-sm text-gray-600">Total Lamaran: <span className="font-bold">{stats.totalApplications}</span></p>
                    <p className="text-xs text-gray-400 mt-2">(Grafik tren lamaran segera hadir)</p>
                </div>
                {/* Training Stats */}
                <div className="bg-purple-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-purple-700 mb-2"><i className="fas fa-chalkboard-teacher mr-2"></i>Statistik Pelatihan</h3>
                    <p className="text-sm text-gray-600">Total Program: <span className="font-bold">{stats.totalTrainingPrograms}</span></p>
                    <p className="text-sm text-gray-600">Program Aktif: <span className="font-bold">{stats.activeTrainingPrograms}</span></p>
                    <p className="text-xs text-gray-400 mt-2">(Grafik metrik pendaftaran segera hadir)</p>
                </div>
            </div>
        ) : (
            <p className="text-gray-500">Gagal memuat statistik.</p>
        )}
      </section>

      {/* Management Modules Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Modul Manajemen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to={APP_ROUTES.ADMIN_USER_MANAGEMENT} className="block bg-rose-500 hover:bg-rose-600 text-white p-6 rounded-lg shadow-md transition-colors">
                <div className="flex items-center">
                    <i className="fas fa-users-cog fa-2x mr-4"></i>
                    <div>
                        <h3 className="text-lg font-semibold">Manajemen Pengguna</h3>
                        <p className="text-sm opacity-90">Kelola semua pengguna terdaftar, peran, dan status.</p>
                    </div>
                </div>
            </Link>
            <div className="bg-amber-500 hover:bg-amber-600 text-white p-6 rounded-lg shadow-md transition-colors cursor-not-allowed opacity-70">
                 <div className="flex items-center">
                    <i className="fas fa-eye fa-2x mr-4"></i>
                    <div>
                        <h3 className="text-lg font-semibold">Pantauan Aktivitas</h3>
                        <p className="text-sm opacity-90">Lihat aktivitas terbaru (Segera Hadir).</p>
                    </div>
                </div>
            </div>
             <div className="bg-teal-500 hover:bg-teal-600 text-white p-6 rounded-lg shadow-md transition-colors cursor-not-allowed opacity-70">
                <div className="flex items-center">
                    <i className="fas fa-cogs fa-2x mr-4"></i>
                    <div>
                        <h3 className="text-lg font-semibold">Pengaturan Sistem</h3>
                        <p className="text-sm opacity-90">Konfigurasi platform (Segera Hadir).</p>
                    </div>
                </div>
            </div>
            <div className="bg-indigo-500 hover:bg-indigo-600 text-white p-6 rounded-lg shadow-md transition-colors cursor-not-allowed opacity-70">
                <div className="flex items-center">
                    <i className="fas fa-flag fa-2x mr-4"></i>
                    <div>
                        <h3 className="text-lg font-semibold">Laporan & Moderasi</h3>
                        <p className="text-sm opacity-90">Moderasi konten (Segera Hadir).</p>
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      <p className="mt-8 text-sm text-gray-500">
        Ini adalah area khusus untuk administrasi. Harap gunakan dengan hati-hati.
      </p>
    </div>
  );
};

export default AdminDashboardPage;