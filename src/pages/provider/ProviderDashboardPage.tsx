import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';
import Spinner from '@/components/Spinner';
import { UserRole } from '@/types';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/config/firebase';


interface ProviderStats {
  activePrograms: number;
  totalRegistrations: number;
}

const ProviderDashboardPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser || (currentUser.role !== UserRole.TRAINING_PROVIDER && currentUser.role !== UserRole.ADMIN)) {
        setLoadingStats(false);
        return;
      }
      setLoadingStats(true);
      try {
        let activeProgramsCount = 0;
        let totalRegistrationsCount = 0;

        const programsQueryBase = collection(db, 'trainingPrograms');
        const programsCondition = currentUser.role === UserRole.ADMIN 
            ? where('isActive', '==', true)
            : where('providerId', '==', currentUser.uid); // Also implies isActive for a provider's own count
        
        const activeProgramsSnapshot = await getCountFromServer(query(programsQueryBase, programsCondition, where('isActive', '==', true)));
        activeProgramsCount = activeProgramsSnapshot.data().count;

        // Fetch total registrations count
        const registrationsQueryBase = collection(db, 'trainingRegistrations');
         const registrationsCondition = currentUser.role === UserRole.ADMIN
            ? query(registrationsQueryBase) // Admin sees all
            : query(registrationsQueryBase, where('providerId', '==', currentUser.uid)); // providerId needs to be added to TrainingRegistration
        
        // As providerId is not in TrainingRegistration yet, this part is commented out or simplified
        // For now, let's assume we can't get this stat accurately without providerId in registrations.
        // const totalRegistrationsSnapshot = await getCountFromServer(registrationsCondition);
        // totalRegistrationsCount = totalRegistrationsSnapshot.data().count;
        totalRegistrationsCount = 0; // Placeholder

        setStats({ activePrograms: activeProgramsCount, totalRegistrations: totalRegistrationsCount });

      } catch (error) {
        console.error("Error fetching provider stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [currentUser]);


  if (authLoading) return <Spinner fullPage />;
  if (!currentUser || (currentUser.role !== UserRole.TRAINING_PROVIDER && currentUser.role !== UserRole.ADMIN)) {
    return <p>Akses ditolak.</p>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dasbor Penyedia Pelatihan</h1>

      {loadingStats ? (
        <Spinner />
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-sky-100 text-sky-600 mr-4">
                <i className="fas fa-chalkboard-teacher fa-2x"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program Aktif</p>
                <p className="text-3xl font-semibold text-gray-800">{stats.activePrograms}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <i className="fas fa-users-cog fa-2x"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pendaftar (Segera)</p>
                <p className="text-3xl font-semibold text-gray-800">{stats.totalRegistrations > 0 ? stats.totalRegistrations : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
         <p className="text-gray-600 mb-8">Tidak dapat memuat statistik.</p>
      )}


      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to={APP_ROUTES.POST_TRAINING} className="block bg-sky-500 hover:bg-sky-600 text-white p-6 rounded-lg shadow-md transition-colors">
             <div className="flex items-center">
                <i className="fas fa-plus-circle fa-2x mr-4"></i>
                <div>
                    <h3 className="text-lg font-semibold">Posting Program Baru</h3>
                    <p className="text-sm opacity-90">Buat dan publikasikan program pelatihan Anda.</p>
                </div>
            </div>
          </Link>
          <Link to={APP_ROUTES.PROVIDER_TRAININGS} className="block bg-indigo-500 hover:bg-indigo-600 text-white p-6 rounded-lg shadow-md transition-colors">
            <div className="flex items-center">
                <i className="fas fa-list-ul fa-2x mr-4"></i>
                <div>
                    <h3 className="text-lg font-semibold">Kelola Program Pelatihan</h3>
                    <p className="text-sm opacity-90">Lihat, edit, atau nonaktifkan program yang sudah ada.</p>
                </div>
            </div>
          </Link>
          <Link to={APP_ROUTES.PROVIDER_REGISTRATIONS} className="block bg-teal-500 hover:bg-teal-600 text-white p-6 rounded-lg shadow-md transition-colors">
            <div className="flex items-center">
                <i className="fas fa-user-check fa-2x mr-4"></i>
                <div>
                    <h3 className="text-lg font-semibold">Lihat Pendaftaran (Segera)</h3>
                    <p className="text-sm opacity-90">Kelola peserta yang mendaftar program Anda.</p>
                </div>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Fitur Mendatang</h2>
        <ul className="list-disc list-inside text-gray-500 mt-2 space-y-1">
          <li>Manajemen pendaftaran peserta yang detail.</li>
          <li>Sistem pelacakan progres belajar peserta.</li>
          <li>Penerbitan sertifikat digital otomatis.</li>
          <li>Analitik untuk program pelatihan Anda.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;