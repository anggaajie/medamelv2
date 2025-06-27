import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { PsychometricTestType, PsychometricTestDescriptions } from '@/types';
import { APP_ROUTES } from '@/constants';
import { BeakerIcon } from '@/components/icons/SidebarIcons';

const PsychometricTestsOverviewPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [completedTests, setCompletedTests] = useState<Set<PsychometricTestType>>(new Set());
  const [loading, setLoading] = useState(true);

  // Cek tes yang sudah diambil user
  useEffect(() => {
    const checkCompletedTests = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const testResultsRef = collection(db, 'psychometricTestResults');
        const q = query(testResultsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const completed = new Set<PsychometricTestType>();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.testType) {
            completed.add(data.testType as PsychometricTestType);
          }
        });
        
        setCompletedTests(completed);
      } catch (error) {
        console.error('Error checking completed tests:', error);
      } finally {
        setLoading(false);
      }
    };

    checkCompletedTests();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="content-card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="content-card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tes Psikometri</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-2">
              Temukan kepribadian dan potensi Anda melalui berbagai tes psikometri yang dirancang khusus. 
              Setiap tes hanya dapat diambil satu kali untuk memastikan keakuratan hasil.
            </p>
            <Link 
              to={APP_ROUTES.MY_PSYCHOMETRIC_RESULTS}
              className="inline-block mt-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Lihat Hasil Tes Saya
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(PsychometricTestType).map((testType) => {
              const testInfo = PsychometricTestDescriptions[testType];
              const testPath = `${APP_ROUTES.TAKE_PSYCHOMETRIC_TEST.replace(':testTypePath', testInfo.pathSuffix)}`;
              const isCompleted = completedTests.has(testType);
              return (
                <div key={testType} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                        <BeakerIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{testInfo.name}</h3>
                        {isCompleted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                            Sudah Diambil
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                      {testInfo.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>Durasi: ~15-20 menit</span>
                      <span>Pertanyaan: 20</span>
                    </div>
                    {testInfo.available ? (
                      isCompleted ? (
                        <div className="space-y-2">
                          <button disabled className="w-full bg-gray-600 text-gray-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed">
                            Sudah Diambil
                          </button>
                          <Link 
                            to={APP_ROUTES.MY_PSYCHOMETRIC_RESULTS}
                            className="block w-full text-center text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Lihat Hasil
                          </Link>
                        </div>
                      ) : (
                        <Link 
                          to={testPath}
                          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-center"
                        >
                          Mulai Tes
                        </Link>
                      )
                    ) : (
                      <button disabled className="w-full bg-gray-600 text-gray-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed">
                        Segera Hadir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {completedTests.size > 0 && (
            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Tes yang Sudah Diambil</h3>
              <p className="text-gray-300 text-sm">
                Anda telah menyelesaikan {completedTests.size} dari {Object.keys(PsychometricTestDescriptions).length} tes yang tersedia. 
                Hasil tes Anda telah otomatis tersimpan di profil dan CV.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PsychometricTestsOverviewPage;
