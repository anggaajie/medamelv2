import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { TrainingProgram, UserRole, TrainingRegistration, TrainingRegistrationStatus } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { logUserActivity } from '@/utils/activityLogger';
import { useRealtimeTrainingPrograms, useRealtimeTrainingRegistrations } from '@/hooks/useRealtime';
import * as Icons from '@/components/icons/PhosphorIcons';

const TrainingDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [userHasRegistered, setUserHasRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

  // Use realtime hook for training program detail
  const { programs, loading } = useRealtimeTrainingPrograms({
    isActive: true,
  });

  // Use realtime hook for user's registrations
  const { registrations: userRegistrations, loading: registrationsLoading } = useRealtimeTrainingRegistrations({
    userId: currentUser?.uid,
    programId: programId,
  });

  // Get the specific program
  const program = programs.find(p => p.id === programId);

  // Check if user has registered
  useEffect(() => {
    if (userRegistrations.length > 0 && programId) {
      const userRegistration = userRegistrations.find(reg => reg.programId === programId);
      if (userRegistration) {
        setUserHasRegistered(true);
        setRegistrationMessage(`Anda sudah terdaftar untuk program ini (Status: ${userRegistration.status}).`);
      } else {
        setUserHasRegistered(false);
        setRegistrationMessage(null);
      }
    } else {
      setUserHasRegistered(false);
      setRegistrationMessage(null);
    }
  }, [userRegistrations, programId]);

  const formatCost = (cost: number) => {
    if (cost === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(cost);
  };

  const handleDeleteProgram = async () => {
    if (!programId || !program || !(currentUser?.role === UserRole.ADMIN || currentUser?.uid === program.providerId) || !auth.currentUser) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus program pelatihan ini? Tindakan ini tidak dapat diurungkan.")) {
        try {
            await deleteDoc(doc(db, 'trainingPrograms', programId));
            await logUserActivity(auth, db, 'TRAINING_DELETE_SUCCESS', { programId: program.id, programTitle: program.title });
            navigate(APP_ROUTES.TRAINING_CATALOG);
        } catch (err: any) {
            console.error("Error deleting training program:", err);
            setError("Gagal menghapus program pelatihan. Silakan coba lagi.");
            await logUserActivity(auth, db, 'TRAINING_DELETE_FAILURE', { programId: program.id, programTitle: program.title, error: err.message });
        }
    }
  };

  const handleRegister = async () => {
    if (!currentUser || !program || !auth.currentUser) {
        setError("Anda harus login untuk mendaftar.");
        return;
    }
    if (userHasRegistered) {
        setRegistrationMessage("Anda sudah terdaftar untuk program ini.");
        return;
    }

    setRegistrationLoading(true);
    setError(null);
    setRegistrationMessage(null);

    const registrationData: Omit<TrainingRegistration, 'id'> = {
        programId: program.id,
        programTitle: program.title,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email || 'Peserta Medamel',
        userEmail: currentUser.email || undefined,
        providerId: program.providerId,
        registrationDate: serverTimestamp(),
        status: program.cost === 0 ? TrainingRegistrationStatus.CONFIRMED : TrainingRegistrationStatus.PENDING_PAYMENT,
    };

    try {
        await addDoc(collection(db, 'trainingRegistrations'), registrationData);
        await logUserActivity(auth, db, 'TRAINING_REGISTER_SUCCESS', { programId: program.id, programTitle: program.title });
        setUserHasRegistered(true);
        setRegistrationMessage(`Pendaftaran berhasil! Status Anda: ${registrationData.status}. Cek halaman 'Pelatihan Saya'.`);
    } catch (err: any) {
        console.error("Error registering for training:", err);
        setError("Gagal melakukan pendaftaran. Silakan coba lagi.");
        await logUserActivity(auth, db, 'TRAINING_REGISTER_FAILURE', { programId: program.id, programTitle: program.title, error: err.message });
    } finally {
        setRegistrationLoading(false);
    }
  };

  if (loading || registrationsLoading) return <Spinner fullPage={true} />;
  if (error && !program) return <p className="text-red-500 text-center p-8">{error}</p>;
  if (!program) return <p className="text-center p-8">Program pelatihan tidak ditemukan.</p>;

  const canEditOrDelete = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.uid === program.providerId);
  const canRegister = currentUser && program.isActive;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        {!program.isActive && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
                <Icons.WarningIcon size={16} className="inline mr-2" />
                Program ini saat ini tidak aktif.
            </div>
        )}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        {registrationMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{registrationMessage}</p>}

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start space-x-4 mb-4 md:mb-0">
            {program.providerLogoUrl ? (
              <img src={program.providerLogoUrl} alt={`${program.providerName} logo`} className="w-20 h-20 object-contain rounded-lg border p-1" />
            ) : (
              <div className="w-20 h-20 bg-sky-100 text-sky-600 flex items-center justify-center rounded-lg text-3xl font-bold">
                {program.providerName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-100">{program.title}</h1>
              <p className="text-xl text-white">Diselenggarakan oleh: {program.providerName}</p>
              <p className="text-md text-white">Kategori: {program.category}</p>
              <div className="flex items-center mt-2 text-blue-600 text-sm">
                <Icons.ArrowRightIcon size={16} className="mr-1" />
                <span>Data diperbarui secara realtime</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col md:items-end space-y-3">
            {canRegister && !userHasRegistered && (
                 <button 
                    onClick={handleRegister}
                    disabled={registrationLoading}
                    className="btn-primary w-full md:w-auto py-2 px-6 text-lg"
                  >
                   {registrationLoading ? (
                     <>
                       <Spinner size="sm" />
                       <span className="ml-2">Mendaftar...</span>
                     </>
                   ) : (
                     <>
                       <Icons.UserPlusIcon size={20} className="mr-2" />
                       Daftar Program Ini
                     </>
                   )}
                 </button>
            )}
            {canRegister && userHasRegistered && (
                <button disabled className="btn-secondary w-full md:w-auto py-2 px-6 text-lg cursor-not-allowed">
                   <Icons.CheckCircleIcon size={20} className="mr-2" />
                   Sudah Terdaftar
                 </button>
            )}
            {canEditOrDelete && (
                <div className="flex space-x-2 w-full md:w-auto">
                    <Link 
                        to={APP_ROUTES.EDIT_TRAINING.replace(':programId', program.id)}
                        className="btn-secondary w-full md:w-auto py-2 px-4 text-sm"
                    >
                        <Icons.PencilIcon size={16} className="mr-2" />
                        Ubah Program
                    </Link>
                    <button 
                        onClick={handleDeleteProgram}
                        className="btn-danger w-full md:w-auto py-2 px-4 text-sm"
                    >
                        <Icons.TrashIcon size={16} className="mr-2" />
                        Hapus
                    </button>
                </div>
            )}
            <p className="text-xs text-slate-100 text-center md:text-right">
              Diposting: {new Date(program.postedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Program Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-1">
              <Icons.ClockIcon size={16} className="inline mr-2" />
              Durasi
            </h3>
            <p className="text-slate-100">{program.duration}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-1">
              <Icons.MapPinIcon size={16} className="inline mr-2" />
              Lokasi
            </h3>
            <p className="text-slate-100">{program.location}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-1">
              <Icons.DollarIcon size={16} className="inline mr-2" />
              Biaya
            </h3>
            <p className="text-slate-100">{formatCost(program.cost)}</p>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">Deskripsi Program</h2>
          <div className="prose max-w-none text-white" dangerouslySetInnerHTML={{ __html: program.description }} />
        </section>

        {/* Learning Objectives */}
        {program.learningObjectives && program.learningObjectives.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-3">Tujuan Pembelajaran</h2>
            <ul className="list-disc list-inside space-y-2 text-white">
              {program.learningObjectives.map((objective, index) => (
                <li key={index} className="text-white">{objective}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Prerequisites */}
        {program.prerequisites && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-3">Prasyarat</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-white">{program.prerequisites}</p>
            </div>
          </section>
        )}

        {/* Syllabus */}
        {program.syllabus && program.syllabus.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-3">Silabus / Materi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {program.syllabus.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Icons.CheckCircleIcon size={20} className="text-blue-600 mr-3" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Target Audience */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">Target Peserta</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-white">{program.targetAudience}</p>
          </div>
        </section>

        {/* Instructor Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">Informasi Instruktur</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-white">{program.instructorInfo}</p>
          </div>
        </section>

        {/* Certificate */}
        {program.certificateName && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-3">Sertifikat</h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-white">Peserta akan mendapatkan: <strong>{program.certificateName}</strong></p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TrainingDetailPage;
