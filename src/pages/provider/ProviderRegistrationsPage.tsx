import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TrainingRegistration, TrainingRegistrationStatus, UserRole, TrainingProgram } from '@/types';
import Spinner from '@/components/Spinner';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { APP_ROUTES } from '@/constants';
import { logUserActivity } from '@/utils/activityLogger';
import { useRealtimeTrainingRegistrations, useRealtimeTrainingPrograms } from '@/hooks/useRealtime';

const ProviderRegistrationsPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [filterProgramId, setFilterProgramId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Use realtime hooks
  const { registrations, loading: registrationsLoading } = useRealtimeTrainingRegistrations({
    providerId: currentUser?.uid,
    programId: filterProgramId || undefined,
  });

  const { programs: providerPrograms, loading: programsLoading } = useRealtimeTrainingPrograms({
    providerId: currentUser?.uid,
    isActive: true,
  });

  const handleStatusChange = async (registrationId: string, newStatus: TrainingRegistrationStatus) => {
    if (!auth.currentUser) return;
    try {
      const regDocRef = doc(db, 'trainingRegistrations', registrationId);
      await updateDoc(regDocRef, {
        status: newStatus,
        // Potentially add completionDate if status is COMPLETED
        ...(newStatus === TrainingRegistrationStatus.COMPLETED && { completionDate: serverTimestamp() })
      });
      
      const regDetails = registrations.find(r => r.id === registrationId);
      await logUserActivity(auth, db, 'TRAINING_REGISTRATION_STATUS_UPDATE', { 
        registrationId, 
        programTitle: regDetails?.programTitle, 
        newStatus 
      });
    } catch (err: any) {
      console.error("Error updating registration status:", err);
      setError("Gagal memperbarui status pendaftaran.");
      await logUserActivity(auth, db, 'TRAINING_REGISTRATION_STATUS_UPDATE_FAILURE', { registrationId, newStatus, error: err.message });
    }
  };
  
  const getStatusClass = (status: TrainingRegistrationStatus) => {
    switch (status) {
      case TrainingRegistrationStatus.CONFIRMED: return 'bg-green-100 text-green-800';
      case TrainingRegistrationStatus.COMPLETED: return 'bg-blue-100 text-blue-800';
      case TrainingRegistrationStatus.PENDING_PAYMENT: return 'bg-yellow-100 text-yellow-800';
      case TrainingRegistrationStatus.CANCELLED_USER: case TrainingRegistrationStatus.CANCELLED_PROVIDER: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || (registrationsLoading && registrations.length === 0)) return <Spinner fullPage />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Pendaftaran Pelatihan</h1>
          <p className="text-gray-600">Kelola dan pantau pendaftar program pelatihan Anda <span className="text-blue-600 ml-2">🔄 Live</span></p>
        </div>
        <div>
          <label htmlFor="programFilter" className="sr-only">Filter berdasarkan Program</label>
          <select 
            id="programFilter"
            value={filterProgramId}
            onChange={(e) => setFilterProgramId(e.target.value)}
            className="input-std text-sm"
            aria-label="Filter berdasarkan program pelatihan"
          >
            <option value="">Semua Program</option>
            {providerPrograms.map(program => (
              <option key={program.id} value={program.id}>{program.title}</option>
            ))}
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {registrationsLoading && registrations.length > 0 && <Spinner/>}

      {registrations.length === 0 && !registrationsLoading ? (
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <i className="fas fa-users-slash fa-3x text-sky-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Pendaftar</h2>
          <p className="text-gray-500">
            {filterProgramId 
              ? "Tidak ada pendaftaran untuk program yang dipilih." 
              : "Tidak ada pendaftaran yang ditemukan untuk program yang Anda kelola."
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Pelatihan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map(reg => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.userEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <Link to={APP_ROUTES.TRAINING_DETAIL.replace(':programId', reg.programId)} className="hover:underline text-blue-600">
                      {reg.programTitle}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reg.registrationDate).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(reg.status)}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select 
                      value={reg.status} 
                      onChange={(e) => handleStatusChange(reg.id, e.target.value as TrainingRegistrationStatus)}
                      className="input-std text-xs p-1.5"
                      aria-label={`Ubah status untuk ${reg.userName}`}
                    >
                      {Object.values(TrainingRegistrationStatus).map(statusVal => (
                        <option key={statusVal} value={statusVal}>{statusVal}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistics */}
      {registrations.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {registrations.filter(reg => reg.status === TrainingRegistrationStatus.PENDING_PAYMENT).length}
            </div>
            <div className="text-sm text-gray-500">Menunggu Pembayaran</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {registrations.filter(reg => reg.status === TrainingRegistrationStatus.CONFIRMED).length}
            </div>
            <div className="text-sm text-gray-500">Terkonfirmasi</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {registrations.filter(reg => reg.status === TrainingRegistrationStatus.COMPLETED).length}
            </div>
            <div className="text-sm text-gray-500">Selesai</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {registrations.filter(reg => reg.status === TrainingRegistrationStatus.CANCELLED_USER || reg.status === TrainingRegistrationStatus.CANCELLED_PROVIDER).length}
            </div>
            <div className="text-sm text-gray-500">Dibatalkan</div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Fitur lanjutan seperti sertifikat digital, sistem penilaian, dan integrasi pembayaran akan ditambahkan di masa mendatang.
          <span className="block text-blue-600 mt-1">🔄 Status pendaftar diperbarui secara realtime</span>
        </p>
      </div>
    </div>
  );
};

export default ProviderRegistrationsPage;
