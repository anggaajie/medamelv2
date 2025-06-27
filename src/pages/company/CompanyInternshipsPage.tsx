import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InternshipProgram, UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import * as Icons from '@/components/icons/PhosphorIcons';
import { useRealtimeInternshipPrograms } from '@/hooks/useRealtime';

const CompanyInternshipsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Use realtime hook for internships
  const { internships, loading } = useRealtimeInternshipPrograms({
    companyId: currentUser?.uid,
  });

  const handleDeleteInternship = async (internshipId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus program magang ini?")) return;
    try {
      // Delete logic (tetap manual, karena realtime akan update otomatis)
      // ...
    } catch (err) {
      console.error("Error deleting internship:", err);
      setError("Gagal menghapus program magang. Silakan coba lagi.");
    }
  };

  const formatStipend = (stipend?: number) => {
    if (!stipend || stipend === 0) return 'Unpaid';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stipend);
  };

  if (loading) return <Spinner fullPage={true} />;
  if (error) return <p className="text-red-400 text-center p-4">{error}</p>;

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title mb-2">Program Magang Saya</h1>
          <p className="text-secondary">Kelola program magang yang Anda posting <span className="text-blue-400 ml-2">🔄 Live</span></p>
        </div>
        <Link to={APP_ROUTES.POST_INTERNSHIP} className="btn-primary">
          <Icons.PlusCircleIcon size={20} />
          <span className="ml-2">Posting Program Baru</span>
        </Link>
      </div>
      
      {internships.length === 0 ? (
        <div className="content-card text-center py-12">
          <div className="text-slate-400 mb-4">
            <Icons.BriefcaseIcon size={64} />
          </div>
          <h3 className="section-title mb-2">Belum Ada Program Magang</h3>
          <p className="text-secondary mb-6">Anda belum memposting program magang apapun.</p>
          <Link to={APP_ROUTES.POST_INTERNSHIP} className="btn-primary">
            <Icons.PlusCircleIcon size={20} />
            <span className="ml-2">Posting Program Pertama</span>
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead className="table-thead">
              <tr>
                <th className="table-th">
                  Program
                </th>
                <th className="table-th">
                  Kategori
                </th>
                <th className="table-th">
                  Stipend
                </th>
                <th className="table-th">
                  Pelamar
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
              {internships.map(internship => (
                <tr key={internship.id}>
                  <td className="table-td">
                    <Link 
                      to={APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', internship.id)} 
                      className="text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      {internship.title}
                    </Link>
                  </td>
                  <td className="table-td text-slate-200">
                    {internship.category}
                  </td>
                  <td className="table-td text-slate-200">
                    {formatStipend(internship.stipend)}
                  </td>
                  <td className="table-td text-slate-200">
                    {internship.currentApplicants}
                    {internship.maxApplicants && ` / ${internship.maxApplicants}`}
                  </td>
                  <td className="table-td">
                    <span className={`px-2 py-1 rounded text-sm ${
                      internship.isActive ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'
                    }`}>
                      {internship.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="table-td space-x-2">
                    <Link 
                      to={APP_ROUTES.EDIT_INTERNSHIP.replace(':internshipId', internship.id)} 
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Ubah
                    </Link>
                    <button 
                      onClick={() => handleDeleteInternship(internship.id)} 
                      className="text-red-400 hover:text-red-300"
                    >
                      Hapus
                    </button>
                    <Link 
                      to={APP_ROUTES.COMPANY_INTERNSHIP_APPLICATIONS} 
                      className="text-green-400 hover:text-green-300"
                    >
                      Pelamar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyInternshipsPage; 
