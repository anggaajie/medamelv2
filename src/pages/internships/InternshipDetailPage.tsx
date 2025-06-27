import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { InternshipProgram, InternshipApplication, InternshipApplicationStatus, UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import * as Icons from '@/components/icons/PhosphorIcons';
import { logUserActivity } from '@/utils/activityLogger';
import { useRealtimeInternshipPrograms, useRealtimeInternshipApplications } from '@/hooks/useRealtime';

const InternshipDetailPage: React.FC = () => {
  const { internshipId } = useParams<{ internshipId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<string | null>(null);
  const [applicationLoading, setApplicationLoading] = useState(false);

  // Use realtime hook for internship detail
  const { internships, loading } = useRealtimeInternshipPrograms({
    isActive: true,
  });

  // Use realtime hook for user's applications
  const { applications: userApplications, loading: applicationsLoading } = useRealtimeInternshipApplications({
    applicantId: currentUser?.uid,
    internshipId: internshipId,
  });

  // Get the specific internship
  const internship = internships.find(i => i.id === internshipId);

  // Check if user has applied
  useEffect(() => {
    if (userApplications.length > 0 && internshipId) {
      const userApplication = userApplications.find(app => app.internshipId === internshipId);
      if (userApplication) {
        setUserHasApplied(true);
        setApplicationMessage(`Anda sudah melamar untuk program ini (Status: ${userApplication.status}).`);
      } else {
        setUserHasApplied(false);
        setApplicationMessage(null);
      }
    } else {
      setUserHasApplied(false);
      setApplicationMessage(null);
    }
  }, [userApplications, internshipId]);

  const formatStipend = (stipend?: number) => {
    if (!stipend || stipend === 0) return 'Unpaid';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stipend);
  };

  const handleApply = async () => {
    if (!currentUser || !internship || !auth.currentUser) {
      setError("Anda harus login untuk melamar.");
      return;
    }
    if (userHasApplied) {
      setApplicationMessage("Anda sudah melamar untuk program ini.");
      return;
    }

    setApplicationLoading(true);
    setError(null);
    setApplicationMessage(null);

    const applicationData: Omit<InternshipApplication, 'id'> = {
      internshipId: internship.id,
      internshipTitle: internship.title,
      applicantId: currentUser.uid,
      applicantName: currentUser.displayName || currentUser.email || 'Pelamar Medamel',
      applicantEmail: currentUser.email || '',
      companyId: internship.companyId,
      companyName: internship.companyName,
      appliedAt: Date.now(),
      status: InternshipApplicationStatus.PENDING,
      resumeUrl: '', // Will be filled by file upload
      resumeFileName: '',
    };

    try {
      await addDoc(collection(db, 'internshipApplications'), applicationData);
      await logUserActivity(auth, db, 'INTERNSHIP_APPLY_SUCCESS', { internshipId: internship.id, internshipTitle: internship.title });
      setUserHasApplied(true);
      setApplicationMessage(`Lamaran berhasil dikirim! Status Anda: ${applicationData.status}. Cek halaman 'Lamaran Magang Saya'.`);
    } catch (err: any) {
      console.error("Error applying for internship:", err);
      setError("Gagal mengirim lamaran. Silakan coba lagi.");
      await logUserActivity(auth, db, 'INTERNSHIP_APPLY_FAILURE', { internshipId: internship.id, internshipTitle: internship.title, error: err.message });
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleDeleteInternship = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus program magang ini?")) return;
    
    try {
      // Implementation for deleting internship
      navigate(APP_ROUTES.COMPANY_INTERNSHIPS);
    } catch (err) {
      console.error("Error deleting internship:", err);
      setError("Gagal menghapus program magang.");
    }
  };

  if (loading || applicationsLoading) return <Spinner fullPage={true} />;
  if (error && !internship) return <p className="text-red-500 text-center p-8">{error}</p>;
  if (!internship) return <p className="text-center p-8">Program magang tidak ditemukan.</p>;

  const canEditOrDelete = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.uid === internship.companyId);
  const canApply = currentUser && internship.isActive && currentUser.role === UserRole.JOB_SEEKER;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        {!internship.isActive && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
            <Icons.WarningIcon size={16} className="inline mr-2" />
            Program ini saat ini tidak aktif.
          </div>
        )}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        {applicationMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{applicationMessage}</p>}

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start space-x-4 mb-4 md:mb-0">
            {internship.companyLogoUrl ? (
              <img src={internship.companyLogoUrl} alt={`${internship.companyName} logo`} className="w-20 h-20 object-contain rounded-lg border p-1" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{internship.companyName.charAt(0)}</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{internship.title}</h1>
              <p className="text-xl text-gray-700">Diselenggarakan oleh: {internship.companyName}</p>
              <p className="text-md text-gray-500">Kategori: {internship.category}</p>
              <div className="flex items-center mt-2 text-blue-600 text-sm">
                <Icons.ArrowRightIcon size={16} className="mr-1" />
                <span>Data diperbarui secara realtime</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {canApply && !userHasApplied && (
              <button
                onClick={handleApply}
                disabled={applicationLoading}
                className="btn-primary px-6 py-3 text-lg"
              >
                {applicationLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Mengirim Lamaran...</span>
                  </>
                ) : (
                  <>
                    <Icons.ArrowRightIcon size={20} />
                    <span className="ml-2">Lamar Sekarang</span>
                  </>
                )}
              </button>
            )}
            
            {canEditOrDelete && (
              <div className="flex space-x-2">
                <Link
                  to={APP_ROUTES.POST_INTERNSHIP.replace(':internshipId', internship.id)}
                  className="btn-secondary px-4 py-2"
                >
                  <Icons.PencilIcon size={16} />
                  <span className="ml-2">Edit</span>
                </Link>
                <button
                  onClick={handleDeleteInternship}
                  className="btn-danger px-4 py-2"
                >
                  <Icons.TrashIcon size={16} />
                  <span className="ml-2">Hapus</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-1">
              <Icons.ClockIcon size={16} className="inline mr-2" />
              Durasi
            </h3>
            <p className="text-gray-800">{internship.duration}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-1">
              <Icons.MapPinIcon size={16} className="inline mr-2" />
              Lokasi
            </h3>
            <p className="text-gray-800">{internship.location}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-1">
              <Icons.DollarIcon size={16} className="inline mr-2" />
              Stipend
            </h3>
            <p className="text-gray-800">{formatStipend(internship.stipend)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-1">
              <Icons.BriefcaseIcon size={16} className="inline mr-2" />
              Tipe
            </h3>
            <p className="text-gray-800">{internship.internshipType}</p>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Deskripsi Program</h2>
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: internship.description }} />
        </section>

        {/* Responsibilities */}
        {internship.responsibilities && internship.responsibilities.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Tanggung Jawab</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {internship.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-gray-700">{responsibility}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Learning Objectives */}
        {internship.learningObjectives && internship.learningObjectives.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Tujuan Pembelajaran</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {internship.learningObjectives.map((objective, index) => (
                <li key={index} className="text-gray-700">{objective}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Requirements */}
        {internship.requirements && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Persyaratan</h2>
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: internship.requirements }} />
          </section>
        )}

        {/* Skills Required */}
        {internship.skillsRequired && internship.skillsRequired.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Skills yang Dibutuhkan</h2>
            <div className="flex flex-wrap gap-2">
              {internship.skillsRequired.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Preferred Skills */}
        {internship.preferredSkills && internship.preferredSkills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Skills yang Diutamakan</h2>
            <div className="flex flex-wrap gap-2">
              {internship.preferredSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Benefits */}
        {internship.benefits && internship.benefits.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Benefit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internship.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Icons.CheckCircleIcon size={20} className="text-green-600 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mentor Information */}
        {internship.mentorInfo && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Informasi Mentor</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{internship.mentorInfo}</p>
            </div>
          </section>
        )}

        {/* Application Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Informasi Pendaftaran</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Pelamar saat ini:</strong> {internship.currentApplicants}
              {internship.maxApplicants && ` / ${internship.maxApplicants} maksimal`}
            </p>
            {internship.applicationDeadline && (
              <p className="text-gray-700">
                <strong>Deadline pendaftaran:</strong> {new Date(internship.applicationDeadline).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InternshipDetailPage; 