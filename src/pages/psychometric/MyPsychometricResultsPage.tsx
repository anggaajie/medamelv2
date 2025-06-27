import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { PsychometricTestResult, PsychometricTestDescriptions, MBTIResultData } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { ChartBarIcon, CalendarIcon, BeakerIcon } from '@/components/icons/SidebarIcons';

const MyPsychometricResultsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [results, setResults] = useState<PsychometricTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false); // No user, no results to fetch
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, 'psychometricTestResults'),
          where('userId', '==', currentUser.uid),
          orderBy('testDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userResults = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PsychometricTestResult));
        setResults(userResults);
      } catch (err) {
        console.error("Error fetching user's test results:", err);
        setError("Gagal memuat riwayat hasil tes Anda.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [currentUser]);

  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'MBTI':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center rounded-lg shadow-md">
            <BeakerIcon className="w-6 h-6" />
          </div>
        );
      case 'KRAEPELIN':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-lg shadow-md">
            <ChartBarIcon className="w-6 h-6" />
          </div>
        );
      case 'PAPI_KOSTICK':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center rounded-lg shadow-md">
            <BeakerIcon className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 text-white flex items-center justify-center rounded-lg shadow-md">
            <BeakerIcon className="w-6 h-6" />
          </div>
        );
    }
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Riwayat Hasil Tes Psikometri
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Pantau dan analisis hasil tes psikometri yang telah Anda ambil untuk memahami perkembangan diri Anda.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {results.length === 0 && !loading ? (
          <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Belum Ada Hasil Tes</h2>
            <p className="text-white mb-6">Anda belum mengambil tes psikometri apapun. Mulai tes sekarang untuk memahami diri Anda lebih dalam.</p>
            <Link 
              to={APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW} 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
              <BeakerIcon className="w-5 h-5 mr-2" />
              Mulai Tes Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map(result => {
              const testMeta = PsychometricTestDescriptions[result.testType];
              let summary = 'Lihat Detail';
              let summaryColor = 'text-white';
              
              if (result.testType === 'MBTI' && result.resultData) {
                const mbtiData = result.resultData as MBTIResultData;
                summary = `Tipe: ${mbtiData.mbtiType} (${mbtiData.mbtiTitle || ''})`;
                summaryColor = 'text-purple-400 font-semibold';
              }

              return (
                <div key={result.id} className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getTestIcon(result.testType)}
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-slate-100">
                          {testMeta.name}
                        </h3>
                        <div className="flex items-center mt-1 text-white">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {new Date(result.testDate).toLocaleDateString('id-ID', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        <ChartBarIcon className="w-3 h-3 mr-1" />
                        Selesai
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-md ${summaryColor} mb-4`}>{summary}</p>
                  
                  <div className="border-t border-slate-700 pt-4">
                    <Link
                      to={APP_ROUTES.VIEW_PSYCHOMETRIC_RESULT.replace(':resultId', result.id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <ChartBarIcon className="w-4 h-4 mr-2" />
                      Lihat Detail Hasil
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPsychometricResultsPage;
