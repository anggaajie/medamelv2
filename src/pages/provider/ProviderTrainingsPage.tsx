import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { TrainingProgram, UserRole } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { useRealtimeTrainingPrograms } from '@/hooks/useRealtime';

const ProviderTrainingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Use realtime hook for training programs
  const { programs, loading } = useRealtimeTrainingPrograms({
    providerId: currentUser?.uid,
  });

  const handleDeleteProgram = async (programId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus program pelatihan ini? Semua data terkait (seperti pendaftaran) tidak akan terhapus otomatis namun program ini tidak akan terlihat lagi.")) return;
    try {
        await deleteDoc(doc(db, 'trainingPrograms', programId));
        // No need to manually update state - realtime hook will handle it
    } catch (err) {
        console.error("Error deleting training program:", err);
        setError("Gagal menghapus program. Silakan coba lagi.");
    }
  };
  
  const formatCost = (cost: number) => {
    if (cost === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(cost);
  };

  if (loading && programs.length === 0) return <Spinner fullPage={true} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Program Pelatihan Saya</h1>
          <p className="text-gray-600">Kelola program pelatihan yang Anda tawarkan <span className="text-blue-600 ml-2">🔄 Live</span></p>
        </div>
        <Link to={APP_ROUTES.POST_TRAINING} className="btn-primary">
            <i className="fas fa-plus mr-2"></i>Posting Program Baru
        </Link>
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
      
      {loading && programs.length > 0 && <Spinner />}
      
      {programs.length === 0 && !loading ? (
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
            <i className="fas fa-chalkboard-teacher fa-3x text-sky-500 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Program Pelatihan</h2>
            <p className="text-gray-500">Anda belum memposting program pelatihan apapun.</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biaya</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {programs.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={APP_ROUTES.TRAINING_DETAIL.replace(':programId', p.id)} className="text-sm font-medium text-sky-600 hover:text-sky-800">{p.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCost(p.cost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link to={APP_ROUTES.EDIT_TRAINING.replace(':programId', p.id)} className="text-indigo-600 hover:text-indigo-900">Ubah</Link>
                      <button onClick={() => handleDeleteProgram(p.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                      <Link to={APP_ROUTES.PROVIDER_REGISTRATIONS} className="text-teal-600 hover:text-teal-900">Pendaftar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics */}
          {programs.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {programs.length}
                </div>
                <div className="text-sm text-gray-500">Total Program</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {programs.filter(p => p.isActive).length}
                </div>
                <div className="text-sm text-gray-500">Program Aktif</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {programs.filter(p => p.cost === 0).length}
                </div>
                <div className="text-sm text-gray-500">Program Gratis</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {new Set(programs.map(p => p.category)).size}
                </div>
                <div className="text-sm text-gray-500">Kategori</div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Fitur lanjutan seperti analitik pendaftar, sistem penilaian, dan integrasi pembayaran akan ditambahkan di masa mendatang.
          <span className="block text-blue-600 mt-1">🔄 Data program diperbarui secara realtime</span>
        </p>
      </div>
    </div>
  );
};

export default ProviderTrainingsPage;
