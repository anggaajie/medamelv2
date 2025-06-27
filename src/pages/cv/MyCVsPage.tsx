import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/config/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { UserCV } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { ClipboardDocumentListIcon, PlusCircleIcon, CalendarIcon, ClockIcon } from '@/components/icons/SidebarIcons';

const MyCVsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userCVs, setUserCVs] = useState<UserCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchCVs = async () => {
      setLoading(true);
      setError(null);
      try {
        const cvsQuery = query(
          collection(db, 'userCVs'),
          where('userId', '==', currentUser.uid),
          orderBy('updatedAt', 'desc')
        );
        const querySnapshot = await getDocs(cvsQuery);
        const cvs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserCV));
        setUserCVs(cvs);
      } catch (err: any) {
        console.error("Error fetching user CVs:", err);
        setError(err.message || "Gagal memuat daftar CV Anda.");
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, [currentUser]);

  const handleDeleteCV = async (cvId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus CV ini? Tindakan ini tidak dapat diurungkan.")) {
      return;
    }
    setLoading(true); // Indicate activity
    try {
      await deleteDoc(doc(db, 'userCVs', cvId));
      setUserCVs(prevCVs => prevCVs.filter(cv => cv.id !== cvId));
      // Optionally show success message
    } catch (err: any) {
      console.error("Error deleting CV:", err);
      setError(err.message || "Gagal menghapus CV.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && userCVs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-96">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-slate-400 mt-4">Memuat CV...</p>
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
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📄</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
                    CV Saya
                  </h1>
                  <p className="text-lg text-slate-300 mt-2">
                    Kelola dan buat CV profesional untuk melamar pekerjaan
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-400 font-medium">Data diperbarui secara realtime</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate(APP_ROUTES.CV_BUILDER)}
              className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buat CV Baru
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-6">
            <p className="text-red-300 font-medium text-center">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-slate-400">Memuat CV...</p>
          </div>
        ) : userCVs.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-slate-600/20 flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Belum ada CV</h2>
            <p className="text-slate-400 mb-6">Buat CV pertama Anda untuk mulai melamar pekerjaan</p>
            <button
              onClick={() => navigate(APP_ROUTES.CV_BUILDER)}
              className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buat CV Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Daftar CV</h2>
              <p className="text-slate-400">Kelola CV profesional Anda</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCVs.map((cv) => (
                <div key={cv.id} className="group">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/20 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-300">
                        <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-lg">
                        v{cv.version}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">
                      {cv.title}
                    </h3>
                    
                    <div className="space-y-3 mb-6 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-indigo-400" />
                        <span>Dibuat: {new Date(cv.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-indigo-400" />
                        <span>Diperbarui: {new Date(cv.updatedAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClipboardDocumentListIcon className="w-4 h-4 text-indigo-400" />
                        <span>{cv.sections.length} bagian</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-700/50 pt-4 space-y-3 mt-auto">
                      <button
                        onClick={() => navigate(APP_ROUTES.CV_BUILDER_EDIT.replace(':cvId', cv.id))}
                        className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-600/50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Ubah
                      </button>
                      
                      <button
                        onClick={() => navigate(APP_ROUTES.CV_BUILDER_EDIT.replace(':cvId', cv.id))}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Pratinjau
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCV(cv.id)}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCVsPage;