import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { auth, db, storage } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Spinner from '@/components/Spinner';
import { User, Address, SocialMediaLinks, EducationEntry, LanguageSkill, WorkHistoryEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { logUserActivity } from '@/utils/activityLogger';
import { errorHandler } from '@/utils/errorHandler';
import { showNotification } from '@/utils/notificationService';
import * as Icons from '@/components/icons/PhosphorIcons';

const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUserFullProfile, loading: authLoading } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan' | 'Lainnya' | ''>('');
  const [maritalStatus, setMaritalStatus] = useState<'Belum Menikah' | 'Menikah' | 'Bercerai' | 'Janda/Duda' | ''>('');
  const [religion, setReligion] = useState('');
  const [nationality, setNationality] = useState('');
  const [motherName, setMotherName] = useState('');
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [currentNationalIdUrl, setCurrentNationalIdUrl] = useState<string | undefined>(undefined);
  const [currentNationalIdFileName, setCurrentNationalIdFileName] = useState<string | undefined>(undefined);
  const [taxIdFile, setTaxIdFile] = useState<File | null>(null);
  const [currentTaxIdUrl, setCurrentTaxIdUrl] = useState<string | undefined>(undefined);
  const [currentTaxIdFileName, setCurrentTaxIdFileName] = useState<string | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState<Address>({ street: '', city: '', province: '', zipCode: '' });
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>({ linkedIn: '', instagram: '', tiktok: '', facebook: '' });
  const [educationHistory, setEducationHistory] = useState<EducationEntry[]>([]);
  const [languageSkills, setLanguageSkills] = useState<LanguageSkill[]>([]);
  const [workHistory, setWorkHistory] = useState<WorkHistoryEntry[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');

  const resetFormStates = useCallback((userData: User | null) => {
    if (!userData) return;
    setDisplayName(userData.displayName || '');
    setEmail(userData.email || '');
    setProfilePhotoPreview(userData.photoURL || null);
    setProfilePhotoFile(null);

    setDateOfBirth(userData.dateOfBirth || '');
    setGender(userData.gender || '');
    setMaritalStatus(userData.maritalStatus || '');
    setReligion(userData.religion || '');
    setNationality(userData.nationality || '');
    setMotherName(userData.motherName || '');

    setCurrentNationalIdUrl(userData.nationalIdUrl);
    setCurrentNationalIdFileName(userData.nationalIdFileName);
    setNationalIdFile(null);
    setCurrentTaxIdUrl(userData.taxIdUrl);
    setCurrentTaxIdFileName(userData.taxIdFileName);
    setTaxIdFile(null);
    
    setPhoneNumber(userData.phoneNumber || '');
    setAddress(userData.address || { street: '', city: '', province: '', zipCode: '' });
    setSocialMedia(userData.socialMedia || { linkedIn: '', instagram: '', tiktok: '', facebook: '' });
    
    setEducationHistory(userData.educationHistory?.map(edu => ({...edu, certificateFile: null})) || []);
    setLanguageSkills(userData.languageSkills || []);
    setWorkHistory(userData.workHistory || []);

    setCurrentPassword('');
    setError(null);
    setSuccessMessage(null);
  }, []);

  useEffect(() => {
    if (currentUser && !isEditing) {
      setLoading(true);
      const userDocRef = doc(db, "users", currentUser.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const fullUserData = { ...currentUser, ...docSnap.data() } as User;
          resetFormStates(fullUserData);
        } else {
          resetFormStates(currentUser);
        }
      }).catch(err => {
        console.error("Error fetching user profile:", err);
        setError("Gagal memuat data profil.");
        resetFormStates(currentUser);
      }).finally(() => setLoading(false));
    }
  }, [currentUser, isEditing, resetFormStates]);


  const handleFileUpload = async (file: File, path: string): Promise<{ url: string, name: string }> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, name: file.name };
  };
  
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fbUser = auth.currentUser;
    if (!currentUser || !fbUser) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (email !== fbUser.email && !currentPassword) {
        setError("Kata sandi saat ini diperlukan untuk mengubah email.");
        setLoading(false);
        return;
      }
      
      if (currentPassword && email !== fbUser.email && fbUser.email) {
        const credential = EmailAuthProvider.credential(fbUser.email, currentPassword);
        await reauthenticateWithCredential(fbUser, credential);
      }

      const userDataToSave: Partial<User> = {};
      let updatedAuthDisplayName = fbUser.displayName;
      let updatedAuthPhotoURL = fbUser.photoURL;

      if (profilePhotoFile) {
        const photoPath = `users/${fbUser.uid}/profilePhoto/${profilePhotoFile.name}`;
        const { url } = await handleFileUpload(profilePhotoFile, photoPath);
        userDataToSave.photoURL = url;
        updatedAuthPhotoURL = url;
      }

      if (displayName !== fbUser.displayName || updatedAuthPhotoURL !== fbUser.photoURL) {
          await updateProfile(fbUser, {
              displayName: displayName !== fbUser.displayName ? displayName : updatedAuthDisplayName,
              photoURL: updatedAuthPhotoURL
            });
          updatedAuthDisplayName = displayName;
      }
      userDataToSave.displayName = displayName;

      if (email !== fbUser.email) {
        await updateEmail(fbUser, email);
        userDataToSave.email = email;
      } else {
        userDataToSave.email = fbUser.email || '';
      }

      Object.assign(userDataToSave, { dateOfBirth, gender, maritalStatus, religion, nationality, motherName });
      
      if (nationalIdFile) {
        if(currentNationalIdUrl) { try { await deleteObject(ref(storage, currentNationalIdUrl)); } catch(err){ console.warn("Old KTP not found or deletion failed", err)}}
        const { url, name } = await handleFileUpload(nationalIdFile, `users/${fbUser.uid}/documents/nationalId_${nationalIdFile.name}`);
        userDataToSave.nationalIdUrl = url;
        userDataToSave.nationalIdFileName = name;
      }
      if (taxIdFile) {
        if(currentTaxIdUrl) { try { await deleteObject(ref(storage, currentTaxIdUrl)); } catch(err){ console.warn("Old NPWP not found or deletion failed", err)}}
        const { url, name } = await handleFileUpload(taxIdFile, `users/${fbUser.uid}/documents/taxId_${taxIdFile.name}`);
        userDataToSave.taxIdUrl = url;
        userDataToSave.taxIdFileName = name;
      }

      Object.assign(userDataToSave, { phoneNumber, address, socialMedia });
      
      const processedEducationHistory = await Promise.all(
        educationHistory.map(async (edu) => {
          if (edu.certificateFile) {
            if(edu.certificateUrl) { try { await deleteObject(ref(storage, edu.certificateUrl)); } catch(err){ console.warn("Old certificate not found or deletion failed", err)}}
            const { url, name } = await handleFileUpload(edu.certificateFile, `users/${fbUser.uid}/documents/education_${edu.id}_${edu.certificateFile.name}`);
            return { ...edu, certificateUrl: url, certificateFileName: name, certificateFile: null };
          }
          return edu;
        })
      );
      userDataToSave.educationHistory = processedEducationHistory;
      userDataToSave.languageSkills = languageSkills;
      userDataToSave.workHistory = workHistory;
      userDataToSave.profileLastUpdated = Date.now();

      const userDocRef = doc(db, "users", fbUser.uid);
      await setDoc(userDocRef, userDataToSave, { merge: true });
      
      const updatedUserForContext: User = {
        ...(currentUser || {} as User),
        uid: fbUser.uid,
        email: fbUser.email, // Use updated email from fbUser
        displayName: updatedAuthDisplayName,
        photoURL: updatedAuthPhotoURL,
        role: currentUser!.role,
        status: currentUser!.status,
        ...userDataToSave,
        educationHistory: processedEducationHistory,
      };
      
      setCurrentUserFullProfile(updatedUserForContext);

      await logUserActivity(auth, db, 'PROFILE_UPDATE_SUCCESS', { userId: fbUser.uid });
      setSuccessMessage('Profil berhasil diperbarui!');
      setIsEditing(false);
      setCurrentPassword('');

    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil.');
      console.error("Profile update error:", err);
      await logUserActivity(auth, db, 'PROFILE_UPDATE_FAILURE', { userId: currentUser?.uid, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addEducationEntry = () => setEducationHistory([...educationHistory, { id: uuidv4(), school: '', degree: '', fieldOfStudy: '', gpa: '', graduationYear: '', certificateFile: null, certificateUrl: '', certificateFileName: '' }]);
  const removeEducationEntry = (id: string) => setEducationHistory(educationHistory.filter(e => e.id !== id));
  const handleEducationChange = (id: string, field: keyof EducationEntry, value: any) => {
    setEducationHistory(educationHistory.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
   const handleEducationFileChange = (id: string, file: File | null) => {
    setEducationHistory(educationHistory.map(e => e.id === id ? { ...e, certificateFile: file } : e));
  };

  const addLanguageSkill = () => setLanguageSkills([...languageSkills, { id: uuidv4(), language: '', proficiency: 'Dasar' }]);
  const removeLanguageSkill = (id: string) => setLanguageSkills(languageSkills.filter(l => l.id !== id));
  const handleLanguageChange = (id: string, field: keyof LanguageSkill, value: any) => {
    setLanguageSkills(languageSkills.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const addWorkHistoryEntry = () => setWorkHistory([...workHistory, { id: uuidv4(), organization: '', role: '', startDate: '', endDate: '', description: '' }]);
  const removeWorkHistoryEntry = (id: string) => setWorkHistory(workHistory.filter(w => w.id !== id));
  const handleWorkHistoryChange = (id: string, field: keyof WorkHistoryEntry, value: any) => {
    setWorkHistory(workHistory.map(w => w.id === id ? { ...w, [field]: value } : w));
  };
  
  if (authLoading || (!currentUser && !isEditing)) {
    return <div className="text-center p-8"><Spinner fullPage={true} /> <p className="mt-2">Memuat profil...</p></div>;
  }
  if (!currentUser) return <p>Silakan login untuk melihat profil.</p>;

  let formattedLastUpdatedDate: string | null = null;
  if (currentUser && currentUser.profileLastUpdated) {
    const timestamp = currentUser.profileLastUpdated;
    try {
      const date = new Date(Number(timestamp));
      if (!isNaN(date.getTime())) {
        formattedLastUpdatedDate = date.toLocaleString('id-ID');
      } else {
        formattedLastUpdatedDate = "Tanggal tidak valid";
      }
    } catch (error) {
      console.error("Error formatting profileLastUpdated:", error);
      formattedLastUpdatedDate = "Kesalahan tanggal";
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="content-card p-8 mb-10 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="page-title text-3xl font-bold mb-1">Profil Saya</h1>
            <p className="text-muted text-base mb-0">Kelola informasi pribadi dan pengaturan akun Anda</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Icons.PencilIcon size={20} className="mr-2" />
              Edit Profil
            </button>
          )}
        </div>
      </div>
      <div className="space-y-10">
        {error && <div className="alert-error">{error}</div>}
        {successMessage && <div className="alert-success">{successMessage}</div>}

        {!isEditing ? (
          /* Display Mode */
          <div className="space-y-10">
            {/* Profile Header */}
            <div className="content-card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:shadow-lg transition-all duration-300">
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                {currentUser.photoURL ? 
                  <img src={currentUser.photoURL} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-indigo-100 hover:shadow-xl transition-shadow duration-300" /> :
                  <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-indigo-100 hover:shadow-xl transition-shadow duration-300">
                    {currentUser.displayName?.charAt(0).toUpperCase() || 'M'}
                  </div>
                }
              </div>
              <div className="flex-1 text-center sm:text-left flex flex-col gap-2 justify-center">
                <h2 className="section-title text-2xl font-bold mb-1">{currentUser.displayName || 'Pengguna Medamel'}</h2>
                <p className="text-muted text-base mb-1">{currentUser.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Peran:</span>
                    <span className="badge-primary text-sm px-3 py-1 rounded">{currentUser.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Status:</span>
                    <span className={`badge text-sm px-3 py-1 rounded ${currentUser.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{currentUser.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span>
                  </div>
                </div>
                {formattedLastUpdatedDate && (
                  <p className="text-xs text-muted mt-2">Terakhir diperbarui: {formattedLastUpdatedDate}</p>
                )}
              </div>
            </div>

            {/* Profile Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Data */}
              <div className="content-card p-6 flex flex-col gap-2 hover:shadow-lg transition-all duration-300">
                <h3 className="section-title text-lg font-semibold mb-4">Data Pribadi</h3>
                <dl className="space-y-3">
                  {currentUser.dateOfBirth && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">Tanggal Lahir:</dt>
                      <dd className="text-sm text-slate-900">{new Date(currentUser.dateOfBirth).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                    </div>
                  )}
                  {currentUser.gender && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">Jenis Kelamin:</dt>
                      <dd className="text-sm text-slate-900">{currentUser.gender}</dd>
                    </div>
                  )}
                  {currentUser.maritalStatus && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">Status Pernikahan:</dt>
                      <dd className="text-sm text-slate-900">{currentUser.maritalStatus}</dd>
                    </div>
                  )}
                  {currentUser.religion && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">Agama:</dt>
                      <dd className="text-sm text-slate-900">{currentUser.religion}</dd>
                    </div>
                  )}
                  {currentUser.nationality && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">Kewarganegaraan:</dt>
                      <dd className="text-sm text-slate-900">{currentUser.nationality}</dd>
                    </div>
                  )}
                  {currentUser.motherName && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted">Nama Ibu Kandung:</dt>
                      <dd className="text-sm text-slate-900">{currentUser.motherName}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Contact Information */}
              <div className="content-card p-6 flex flex-col gap-2 hover:shadow-lg transition-all duration-300">
                <h3 className="section-title text-lg font-semibold mb-4">Informasi Kontak</h3>
                <dl className="space-y-3">
                  {currentUser.phoneNumber && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">Nomor Telepon:</dt>
                      <dd className="text-sm text-slate-900">{currentUser.phoneNumber}</dd>
                    </div>
                  )}
                  {(currentUser.address?.street || currentUser.address?.city || currentUser.address?.province) && (
                    <div>
                      <dt className="text-sm font-medium text-muted mb-2">Alamat Lengkap:</dt>
                      <dd className="text-sm text-slate-900 leading-relaxed">
                        {[currentUser.address?.street, currentUser.address?.city, currentUser.address?.province, currentUser.address?.zipCode].filter(Boolean).join(', ')}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Documents */}
              <div className="content-card p-6 flex flex-col gap-2 hover:shadow-lg transition-all duration-300">
                <h3 className="section-title text-lg font-semibold mb-4">Dokumen</h3>
                <dl className="space-y-3">
                  {currentUser.nationalIdUrl && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">KTP:</dt>
                      <dd><a href={currentUser.nationalIdUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline text-sm transition-colors duration-200">{currentUser.nationalIdFileName || "Lihat KTP"}</a></dd>
                    </div>
                  )}
                  {currentUser.taxIdUrl && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted">NPWP:</dt>
                      <dd><a href={currentUser.taxIdUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline text-sm transition-colors duration-200">{currentUser.taxIdFileName || "Lihat NPWP"}</a></dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Social Media */}
              <div className="content-card p-6 flex flex-col gap-2 hover:shadow-lg transition-all duration-300">
                <h3 className="section-title text-lg font-semibold mb-4">Media Sosial</h3>
                <dl className="space-y-3">
                  {currentUser.socialMedia?.linkedIn && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">LinkedIn:</dt>
                      <dd><a href={currentUser.socialMedia.linkedIn} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline text-sm transition-colors duration-200">Profil LinkedIn</a></dd>
                    </div>
                  )}
                  {currentUser.socialMedia?.instagram && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">Instagram:</dt>
                      <dd><a href={currentUser.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline text-sm transition-colors duration-200">Profil Instagram</a></dd>
                    </div>
                  )}
                  {currentUser.socialMedia?.tiktok && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <dt className="text-sm font-medium text-muted">TikTok:</dt>
                      <dd><a href={currentUser.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline text-sm transition-colors duration-200">Profil TikTok</a></dd>
                    </div>
                  )}
                  {currentUser.socialMedia?.facebook && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted">Facebook:</dt>
                      <dd><a href={currentUser.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline text-sm transition-colors duration-200">Profil Facebook</a></dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Education History */}
            {currentUser.educationHistory && currentUser.educationHistory.length > 0 && (
              <div className="content-card p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="heading-subsection mb-4 text-blue-600 text-lg font-semibold">Riwayat Pendidikan</h3>
                <div className="space-y-6">
                  {currentUser.educationHistory.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 hover:border-blue-300 transition-colors duration-200">
                      <h4 className="heading-card text-slate-900 text-base font-bold mb-1">{edu.school}</h4>
                      {edu.degree && <p className="text-meta text-slate-600">Gelar: {edu.degree}</p>}
                      {edu.fieldOfStudy && <p className="text-meta text-slate-600">Bidang Studi: {edu.fieldOfStudy}</p>}
                      {edu.gpa && <p className="text-meta text-slate-600">IPK: {edu.gpa}</p>}
                      {edu.graduationYear && <p className="text-meta text-slate-600">Tahun Lulus: {edu.graduationYear}</p>}
                      {edu.certificateUrl && <p className="text-meta"><a href={edu.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition-colors duration-200">{edu.certificateFileName || "Lihat Sertifikat"}</a></p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language Skills */}
            {currentUser.languageSkills && currentUser.languageSkills.length > 0 && (
              <div className="content-card p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="heading-subsection mb-4 text-blue-600 text-lg font-semibold">Keterampilan Bahasa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.languageSkills.map((lang) => (
                    <div key={lang.id} className="flex justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <span className="text-meta text-slate-900">{lang.language}</span>
                      <span className="text-meta font-semibold text-blue-600">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work History */}
            {currentUser.workHistory && currentUser.workHistory.length > 0 && (
              <div className="content-card p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="heading-subsection mb-4 text-blue-600 text-lg font-semibold">Riwayat Pekerjaan</h3>
                <div className="space-y-6">
                  {currentUser.workHistory.map((work, index) => (
                    <div key={index} className="border-l-4 border-green-200 pl-4 hover:border-green-300 transition-colors duration-200">
                      <h4 className="heading-card text-slate-900 text-base font-bold mb-1">{work.role} di {work.organization}</h4>
                      {(work.startDate || work.endDate) && (
                        <p className="text-meta text-slate-600">
                          Periode: {work.startDate ? new Date(work.startDate + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'short'}) : ''} - {work.endDate ? new Date(work.endDate + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'short'}) : 'Sekarang'}
                        </p>
                      )}
                      {work.description && <p className="text-meta text-slate-600 mt-1">{work.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleProfileUpdate} className="form-section space-y-10 w-full px-2">
            {/* Account Information */}
            <div className="content-card p-6 flex flex-col gap-6 hover:shadow-lg transition-all duration-300 w-full rounded-lg" style={{ background: '#253144' }}>
              <h3 className="text-h4 mb-2 text-white text-xl font-bold">Informasi Akun & Foto Profil</h3>
              <p className="text-body-small text-slate-300 mb-2">Perbarui informasi akun dasar dan foto profil Anda.</p>
              <div className="form-grid-2 gap-6">
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="displayName" className="form-label text-sm font-medium text-slate-300">Nama Lengkap</label>
                  <input type="text" name="displayName" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="email" className="form-label text-sm font-medium text-slate-300">Alamat Email</label>
                  <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
              </div>
              {email !== currentUser.email && (
                <div className="form-group mt-6 flex flex-col gap-2">
                  <label htmlFor="currentPasswordForEmail" className="form-label text-sm font-medium text-slate-300">Kata Sandi Saat Ini (untuk mengubah email)</label>
                  <input type="password" name="currentPasswordForEmail" id="currentPasswordForEmail" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} placeholder="Diperlukan jika mengubah email" />
                </div>
              )}
              <div className="form-group mt-6 flex flex-col gap-2">
                <label htmlFor="profilePhoto" className="form-label text-sm font-medium text-slate-300">Foto Profil</label>
                <div className="mt-1 flex items-center gap-4">
                  {(profilePhotoPreview || currentUser.photoURL) && (
                    <img src={profilePhotoPreview || currentUser.photoURL || undefined} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                  )}
                  <input type="file" id="profilePhoto" accept="image/*" onChange={handleProfilePhotoChange} className="form-input text-base py-3 px-4 flex-1 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
              </div>
            </div>

            {/* Personal Data */}
            <div className="content-card p-6 flex flex-col gap-6 hover:shadow-lg transition-all duration-300 w-full rounded-lg" style={{ background: '#253144' }}>
              <h3 className="text-h4 mb-2 text-white text-xl font-bold">Data Pribadi</h3>
              <div className="form-grid-3 gap-6">
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="dateOfBirth" className="form-label text-sm font-medium text-slate-300">Tanggal Lahir</label>
                  <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="gender" className="form-label text-sm font-medium text-slate-300">Jenis Kelamin</label>
                  <select id="gender" value={gender} onChange={e => setGender(e.target.value as any)} className="form-select text-base py-2 px-3 h-10 w-32 appearance-none rounded-md" style={{ background: '#0f172a', backgroundImage: 'none', border: '1px solid #334155' }}>
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="maritalStatus" className="form-label text-sm font-medium text-slate-300">Status Pernikahan</label>
                  <select id="maritalStatus" value={maritalStatus} onChange={e => setMaritalStatus(e.target.value as any)} className="form-select text-base py-2 px-3 h-10 w-32 appearance-none rounded-md" style={{ background: '#0f172a', backgroundImage: 'none', border: '1px solid #334155' }}>
                    <option value="">Pilih</option>
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Bercerai">Bercerai</option>
                    <option value="Janda/Duda">Janda/Duda</option>
                  </select>
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="religion" className="form-label text-sm font-medium text-slate-300">Agama</label>
                  <input type="text" id="religion" value={religion} onChange={e => setReligion(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="nationality" className="form-label text-sm font-medium text-slate-300">Kewarganegaraan</label>
                  <input type="text" id="nationality" value={nationality} onChange={e => setNationality(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="motherName" className="form-label text-sm font-medium text-slate-300">Nama Ibu Kandung</label>
                  <input type="text" id="motherName" value={motherName} onChange={e => setMotherName(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="content-card p-6 flex flex-col gap-6 hover:shadow-lg transition-all duration-300 w-full rounded-lg" style={{ background: '#253144' }}>
              <h3 className="text-h4 mb-2 text-white text-xl font-bold flex items-center"><span className="mr-2">📞</span> Informasi Kontak</h3>
              <div className="form-grid-2 gap-6">
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="phoneNumber" className="form-label text-sm font-medium text-slate-300">Nomor Telepon</label>
                  <input type="tel" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="street" className="form-label text-sm font-medium text-slate-300">Alamat Jalan</label>
                  <input type="text" id="street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="city" className="form-label text-sm font-medium text-slate-300">Kota</label>
                  <input type="text" id="city" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="province" className="form-label text-sm font-medium text-slate-300">Provinsi</label>
                  <input type="text" id="province" value={address.province} onChange={e => setAddress({...address, province: e.target.value})} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label htmlFor="zipCode" className="form-label text-sm font-medium text-slate-300">Kode Pos</label>
                  <input type="text" id="zipCode" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="form-input text-base py-3 px-4 rounded-md" style={{ background: '#0f172a', border: '1px solid #334155' }} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-start gap-4 pt-6 border-t border-white/20 w-full">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Menyimpan...</span>
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
              <button type="button" onClick={() => { setIsEditing(false); resetFormStates(currentUser); }} className="btn-secondary">
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
