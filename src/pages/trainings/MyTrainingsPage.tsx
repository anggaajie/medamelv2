import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TrainingRegistration, TrainingRegistrationStatus } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { BookOpenIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from '@/components/icons/SidebarIcons';
import { useRealtimeTrainingRegistrations } from '@/hooks/useRealtime';

const MyTrainingsPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Use realtime hook for training registrations
  const { registrations, loading } = useRealtimeTrainingRegistrations({
    userId: currentUser?.uid,
  });

  const getStatusColor = (status: TrainingRegistrationStatus) => {
    switch (status) {
      case TrainingRegistrationStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-200';
      case TrainingRegistrationStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case TrainingRegistrationStatus.PENDING_PAYMENT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TrainingRegistrationStatus.CANCELLED_USER:
      case TrainingRegistrationStatus.CANCELLED_PROVIDER:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-slate-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: TrainingRegistrationStatus) => {
    switch (status) {
      case TrainingRegistrationStatus.CONFIRMED:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case TrainingRegistrationStatus.COMPLETED:
        return <CheckCircleIcon className="w-4 h-4" />;
      case TrainingRegistrationStatus.PENDING_PAYMENT:
        return <ClockIcon className="w-4 h-4" />;
      case TrainingRegistrationStatus.CANCELLED_USER:
      case TrainingRegistrationStatus.CANCELLED_PROVIDER:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (authLoading || (loading && registrations.length === 0)) return <Spinner fullPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Pelatihan Saya
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Pantau perkembangan pelatihan yang telah Anda daftar dan akses materi pembelajaran.
            <span className="block text-blue-600 mt-2">🔄 Status diperbarui secara realtime</span>
          </p>
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

        {registrations.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Belum Ada Pelatihan Terdaftar</h2>
            <p className="text-white mb-6">Anda belum mendaftar untuk program pelatihan apapun. Jelajahi katalog pelatihan kami untuk menemukan program yang sesuai dengan kebutuhan Anda.</p>
            <Link 
              to={APP_ROUTES.TRAINING_CATALOG} 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Jelajahi Katalog Pelatihan
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map(reg => (
              <div key={reg.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-100 hover:text-blue-400 transition-colors">
                      <Link to={APP_ROUTES.TRAINING_DETAIL.replace(':programId', reg.programId)}>
                        {reg.programTitle}
                      </Link>
                    </h3>
                    <div className="flex items-center mt-2 text-white">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Daftar: {new Date(reg.registrationDate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(reg.status)}`}>
                      {getStatusIcon(reg.status)}
                      <span className="ml-1">
                        {reg.status.replace(/_/g, ' ')}
                      </span>
                    </span>
                  </div>
                </div>
                
                {reg.paymentDetails && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">Pembayaran:</span>
                      <span className="font-semibold text-slate-100">
                        {reg.paymentDetails.method} - Rp {reg.paymentDetails.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <Link 
                    to={APP_ROUTES.TRAINING_DETAIL.replace(':programId', reg.programId)} 
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    Lihat Detail Program
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrainingsPage;
