import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { JobListing, JobType, ExperienceLevel, User, UserRole } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { logUserActivity } from '@/utils/activityLogger';
import { errorHandler } from '@/utils/errorHandler';
import { Validator } from '@/utils/validation';
import { trackEvent } from '@/utils/analytics';

const SimpleRichTextEditor: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string; }> = ({ value, onChange, placeholder }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={8}
      className="input-std w-full"
      aria-label={placeholder || "Rich text editor"}
    />
  );
};


const PostJobPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId?: string }>(); 
  const isEditMode = Boolean(jobId);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<JobType>(JobType.FULL_TIME);
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(ExperienceLevel.ENTRY_LEVEL);
  const [description, setDescription] = useState(''); 
  const [requirements, setRequirements] = useState(''); 
  const [industry, setIndustry] = useState('');
  const [skillsRequired, setSkillsRequired] = useState<string>(''); 
  const [isActive, setIsActive] = useState(true); 

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && jobId) {
      setLoading(true);
      const jobDocRef = doc(db, 'jobListings', jobId);
      getDoc(jobDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const jobData = docSnap.data() as JobListing;
          if (currentUser?.uid !== jobData.companyId && currentUser?.role !== UserRole.ADMIN) {
            setFormError("Anda tidak memiliki izin untuk mengedit lowongan ini.");
            navigate(APP_ROUTES.JOBS);
            return;
          }
          setTitle(jobData.title);
          setLocation(jobData.location);
          setJobType(jobData.jobType);
          setSalaryMin(jobData.salaryMin?.toString() || '');
          setSalaryMax(jobData.salaryMax?.toString() || '');
          setExperienceLevel(jobData.experienceLevel);
          setDescription(jobData.description);
          setRequirements(jobData.requirements);
          setIndustry(jobData.industry || '');
          setSkillsRequired(jobData.skillsRequired?.join(', ') || '');
          setIsActive(jobData.isActive); 
        } else {
          setFormError('Lowongan tidak ditemukan.');
          navigate(APP_ROUTES.JOBS);
        }
      }).catch(err => {
        console.error("Error fetching job for edit:", err);
        setFormError('Gagal memuat data lowongan.');
      }).finally(() => setLoading(false));
    }
  }, [isEditMode, jobId, currentUser, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) {
      setFormError('Anda harus masuk untuk memposting lowongan.');
      return;
    }
    setLoading(true);
    setFormError(null);

    // Validation
    const titleValidation = Validator.validateRequired(title, 'Judul Posisi');
    const locationValidation = Validator.validateRequired(location, 'Lokasi');
    const descriptionValidation = Validator.validateLength(description, 10, 2000, 'Deskripsi Pekerjaan');
    const requirementsValidation = Validator.validateLength(requirements, 10, 2000, 'Kualifikasi / Persyaratan');
    if (!titleValidation.isValid || !locationValidation.isValid || !descriptionValidation.isValid || !requirementsValidation.isValid) {
      setFormError([
        ...titleValidation.errors,
        ...locationValidation.errors,
        ...descriptionValidation.errors,
        ...requirementsValidation.errors
      ].join(' '));
      setLoading(false);
      return;
    }

    const skillsArray = skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill);

    const jobDataPayload: Partial<JobListing> = { 
      title,
      location,
      jobType,
      experienceLevel,
      description,
      requirements,
      isActive, 
      industry: industry || undefined,
      skillsRequired: skillsArray.length > 0 ? skillsArray : undefined,
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
    };

    try {
      if (isEditMode && jobId) {
        const jobDocRef = doc(db, 'jobListings', jobId);
        await updateDoc(jobDocRef, {
            ...jobDataPayload,
        });
        await logUserActivity(auth, db, 'JOB_UPDATE_SUCCESS', { jobId, title: jobDataPayload.title });
        trackEvent('job_updated', {
          jobId: jobId,
          jobTitle: title,
          jobType: jobType,
          experienceLevel: experienceLevel,
          hasSalary: !!(salaryMin || salaryMax)
        });
        navigate(APP_ROUTES.JOB_DETAIL.replace(':jobId', jobId));
      } else {
        const fullJobData: Omit<JobListing, 'id'> = {
            ...jobDataPayload,
            companyId: currentUser.uid,
            companyName: currentUser.displayName || (currentUser as User).email || 'Nama Perusahaan Tidak Ada',
            companyLogoUrl: currentUser.photoURL || undefined,
            postedAt: Date.now(), 
            isActive: true, 
        } as Omit<JobListing, 'id'>; 
        
        const docRef = await addDoc(collection(db, 'jobListings'), {
            ...fullJobData,
            postedAt: serverTimestamp() 
        });
        await logUserActivity(auth, db, 'JOB_CREATE_SUCCESS', { jobId: docRef.id, title: fullJobData.title });
        trackEvent('job_posted', {
          jobId: docRef.id,
          jobTitle: title,
          jobType: jobType,
          experienceLevel: experienceLevel,
          hasSalary: !!(salaryMin || salaryMax),
          hasSkills: skillsArray.length > 0
        });
        navigate(APP_ROUTES.JOB_DETAIL.replace(':jobId', docRef.id));
      }
    } catch (err: any) {
      const appError = errorHandler.handleError(err, isEditMode ? 'PostJobPage-Edit' : 'PostJobPage-Create');
      setFormError(appError.message);
      const actionType = isEditMode ? 'JOB_UPDATE_FAILURE' : 'JOB_CREATE_FAILURE';
      await logUserActivity(auth, db, actionType, { error: appError.message, title: jobDataPayload.title, jobIdIfEditing: jobId });
      trackEvent(isEditMode ? 'job_updated' : 'job_posted', {
        success: false,
        error: appError.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditMode) return <Spinner fullPage={true} />; 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{isEditMode ? 'Ubah Lowongan Pekerjaan' : 'Posting Lowongan Pekerjaan Baru'}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-6">
        {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{formError}</p>}
        {loading && isEditMode && <Spinner />}

        <div>
          <label htmlFor="title" className="label-std">Judul Posisi <span className="text-red-500">*</span></label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="input-std" />
        </div>

        <div>
          <label htmlFor="location" className="label-std">Lokasi <span className="text-red-500">*</span></label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required className="input-std" placeholder="Contoh: Jakarta Pusat, DKI Jakarta" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="jobType" className="label-std">Tipe Pekerjaan <span className="text-red-500">*</span></label>
            <select id="jobType" value={jobType} onChange={e => setJobType(e.target.value as JobType)} required className="input-std">
              {Object.values(JobType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="experienceLevel" className="label-std">Tingkat Pengalaman <span className="text-red-500">*</span></label>
            <select id="experienceLevel" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value as ExperienceLevel)} required className="input-std">
              {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="salaryMin" className="label-std">Gaji Minimum (Rp, Opsional)</label>
            <input type="number" id="salaryMin" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="input-std" placeholder="Contoh: 5000000" />
          </div>
          <div>
            <label htmlFor="salaryMax" className="label-std">Gaji Maksimum (Rp, Opsional)</label>
            <input type="number" id="salaryMax" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className="input-std" placeholder="Contoh: 10000000" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label-std">Deskripsi Pekerjaan <span className="text-red-500">*</span></label>
          <SimpleRichTextEditor value={description} onChange={setDescription} placeholder="Jelaskan tentang peran, tanggung jawab, dan perusahaan..." />
          <p className="text-xs text-gray-500 mt-1">Anda bisa menggunakan HTML dasar untuk format teks.</p>
        </div>

        <div>
          <label htmlFor="requirements" className="label-std">Kualifikasi / Persyaratan <span className="text-red-500">*</span></label>
          <SimpleRichTextEditor value={requirements} onChange={setRequirements} placeholder="Sebutkan kualifikasi yang dibutuhkan, misal: Pengalaman dengan React, Gelar S1, dll." />
           <p className="text-xs text-gray-500 mt-1">Anda bisa menggunakan HTML dasar untuk format teks.</p>
        </div>
        
        <div>
          <label htmlFor="industry" className="label-std">Industri (Opsional)</label>
          <input type="text" id="industry" value={industry} onChange={e => setIndustry(e.target.value)} className="input-std" placeholder="Contoh: Teknologi Informasi, Keuangan, Manufaktur" />
        </div>

        <div>
          <label htmlFor="skillsRequired" className="label-std">Keterampilan yang Dibutuhkan (Pisahkan dengan koma, Opsional)</label>
          <input type="text" id="skillsRequired" value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} className="input-std" placeholder="Contoh: React, Node.js, Komunikasi, Analisis Data" />
        </div>

        {isEditMode && (
          <div>
            <label htmlFor="isActive" className="label-std">Status Lowongan</label>
            <select 
              id="isActive" 
              value={isActive ? 'true' : 'false'} 
              onChange={e => setIsActive(e.target.value === 'true')} 
              className="input-std"
            >
                <option value="true">Aktif (Ditampilkan untuk pelamar)</option>
                <option value="false">Tidak Aktif (Disembunyikan)</option>
            </select>
          </div>
        )}


        <div className="pt-5">
          <div className="flex justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary mr-3">
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Spinner size="sm" color="text-white"/> : (isEditMode ? 'Simpan Perubahan' : 'Posting Lowongan')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;
