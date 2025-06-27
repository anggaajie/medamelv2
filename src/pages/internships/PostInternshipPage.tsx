import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { InternshipProgram, InternshipCategory, InternshipDuration, InternshipType, InternshipStatus, UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import SimpleRichTextEditor from '@/components/SimpleRichTextEditor';
import * as Icons from '@/components/icons/PhosphorIcons';
import { logUserActivity } from '@/utils/activityLogger';
import { errorHandler } from '@/utils/errorHandler';
import { Validator } from '@/utils/validation';
import { trackEvent } from '@/utils/analytics';

const PostInternshipPage: React.FC = () => {
  const { internshipId } = useParams<{ internshipId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const isEditMode = !!internshipId;

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<InternshipCategory>('Teknologi Informasi');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<InternshipDuration>(InternshipDuration.MEDIUM_TERM);
  const [internshipType, setInternshipType] = useState<InternshipType>(InternshipType.FULL_TIME);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [stipend, setStipend] = useState('');
  const [benefits, setBenefits] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [maxApplicants, setMaxApplicants] = useState('');
  const [mentorInfo, setMentorInfo] = useState('');
  const [status, setStatus] = useState<InternshipStatus>(InternshipStatus.ACTIVE);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && internshipId) {
      setLoading(true);
      const internshipDocRef = doc(db, 'internshipPrograms', internshipId);
      getDoc(internshipDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const internshipData = docSnap.data() as InternshipProgram;
          if (currentUser?.uid !== internshipData.companyId && currentUser?.role !== UserRole.ADMIN) {
            setFormError("Anda tidak memiliki izin untuk mengedit program ini.");
            navigate(APP_ROUTES.INTERNSHIPS);
            return;
          }
          setTitle(internshipData.title);
          setCategory(internshipData.category);
          setDescription(internshipData.description);
          setDuration(internshipData.duration);
          setInternshipType(internshipData.internshipType);
          setLocation(internshipData.location);
          setStartDate(internshipData.startDate || '');
          setEndDate(internshipData.endDate || '');
          setApplicationDeadline(internshipData.applicationDeadline || '');
          setStipend(internshipData.stipend?.toString() || '');
          setBenefits(internshipData.benefits.join(', '));
          setRequirements(internshipData.requirements);
          setResponsibilities(internshipData.responsibilities.join(', '));
          setLearningObjectives(internshipData.learningObjectives.join(', '));
          setSkillsRequired(internshipData.skillsRequired.join(', '));
          setPreferredSkills(internshipData.preferredSkills?.join(', ') || '');
          setMaxApplicants(internshipData.maxApplicants?.toString() || '');
          setMentorInfo(internshipData.mentorInfo || '');
          setStatus(internshipData.status);
          setIsActive(internshipData.isActive);
        } else {
          setFormError('Program magang tidak ditemukan.');
          navigate(APP_ROUTES.INTERNSHIPS);
        }
      }).catch(err => {
        console.error("Error fetching internship for edit:", err);
        setFormError('Gagal memuat data program magang.');
      }).finally(() => setLoading(false));
    }
  }, [isEditMode, internshipId, currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) { 
      setFormError('Anda harus masuk untuk memposting program magang.');
      return;
    }
    setLoading(true);
    setFormError(null);

    // Validation
    const titleValidation = Validator.validateRequired(title, 'Judul Program');
    const locationValidation = Validator.validateRequired(location, 'Lokasi');
    const descriptionValidation = Validator.validateLength(description, 10, 2000, 'Deskripsi Program');
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

    const benefitsArray = benefits.split(',').map(b => b.trim()).filter(b => b);
    const responsibilitiesArray = responsibilities.split(',').map(r => r.trim()).filter(r => r);
    const objectivesArray = learningObjectives.split(',').map(o => o.trim()).filter(o => o);
    const skillsArray = skillsRequired.split(',').map(s => s.trim()).filter(s => s);
    const preferredSkillsArray = preferredSkills.split(',').map(s => s.trim()).filter(s => s);

    const internshipDataPayload: Partial<InternshipProgram> = { 
      title,
      category,
      description,
      duration,
      internshipType,
      location,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      applicationDeadline: applicationDeadline || undefined,
      stipend: parseInt(stipend, 10) || 0,
      benefits: benefitsArray,
      requirements,
      responsibilities: responsibilitiesArray,
      learningObjectives: objectivesArray,
      skillsRequired: skillsArray,
      preferredSkills: preferredSkillsArray.length > 0 ? preferredSkillsArray : undefined,
      maxApplicants: parseInt(maxApplicants, 10) || undefined,
      mentorInfo: mentorInfo || undefined,
      status,
      isActive,
    };

    try {
      if (isEditMode && internshipId) {
        await updateDoc(doc(db, 'internshipPrograms', internshipId), {
          ...internshipDataPayload,
          updatedAt: serverTimestamp(),
        });
        await logUserActivity(auth, db, 'INTERNSHIP_UPDATE_SUCCESS', { internshipId, title });
        await trackEvent('internship_updated', {
          internshipId: internshipId,
          internshipTitle: title,
          company: currentUser.displayName || currentUser.email || 'Perusahaan Medamel',
          programType: internshipType,
          hasStipend: stipend !== '0',
          hasDeadline: !!applicationDeadline,
          hasRemoteWork: internshipType !== InternshipType.FULL_TIME,
          academicCredit: false,
          hasBenefits: benefitsArray.length > 0,
          hasRequirements: requirements !== '',
          hasResponsibilities: responsibilitiesArray.length > 0,
          hasLearningObjectives: objectivesArray.length > 0,
          hasSkillsRequired: skillsArray.length > 0,
          hasPreferredSkills: preferredSkillsArray.length > 0,
          hasMaxApplicants: !!maxApplicants,
          hasMentorInfo: !!mentorInfo,
          status: status,
          isActive: isActive,
        });
        navigate(APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', internshipId));
      } else {
        const docRef = await addDoc(collection(db, 'internshipPrograms'), {
          ...internshipDataPayload,
          companyId: currentUser.uid,
          companyName: currentUser.displayName || currentUser.email || 'Perusahaan Medamel',
          currentApplicants: 0,
          postedAt: serverTimestamp(),
        });
        await logUserActivity(auth, db, 'INTERNSHIP_CREATE_SUCCESS', { internshipId: docRef.id, title });
        await trackEvent('internship_posted', {
          internshipId: docRef.id,
          internshipTitle: title,
          company: currentUser.displayName || currentUser.email || 'Perusahaan Medamel',
          programType: internshipType,
          hasStipend: stipend !== '0',
          hasDeadline: !!applicationDeadline,
          hasRemoteWork: internshipType !== InternshipType.FULL_TIME,
          academicCredit: false,
          hasBenefits: benefitsArray.length > 0,
          hasRequirements: requirements !== '',
          hasResponsibilities: responsibilitiesArray.length > 0,
          hasLearningObjectives: objectivesArray.length > 0,
          hasSkillsRequired: skillsArray.length > 0,
          hasPreferredSkills: preferredSkillsArray.length > 0,
          hasMaxApplicants: !!maxApplicants,
          hasMentorInfo: !!mentorInfo,
          status: status,
          isActive: isActive,
        });
        navigate(APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', docRef.id));
      }
    } catch (err: any) {
      const appError = errorHandler.handleError(err, isEditMode ? 'PostInternshipPage-Edit' : 'PostInternshipPage-Create');
      setFormError(appError.message);
      await logUserActivity(auth, db, isEditMode ? 'INTERNSHIP_UPDATE_FAILURE' : 'INTERNSHIP_CREATE_FAILURE', { 
        internshipId: isEditMode ? internshipId : 'new', 
        title, 
        error: appError.message 
      });
      await trackEvent('internship_posted', {
        success: false,
        error: appError.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner fullPage={true} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isEditMode ? 'Edit Program Magang' : 'Posting Program Magang Baru'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Perbarui informasi program magang Anda' : 'Buat program magang baru untuk menarik talenta terbaik'}
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="label-std">Judul Program <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                  className="input-std" 
                  placeholder="Contoh: Magang Software Engineer" 
                />
              </div>
              <div>
                <label htmlFor="category" className="label-std">Kategori <span className="text-red-500">*</span></label>
                <select 
                  id="category" 
                  value={category} 
                  onChange={e => setCategory(e.target.value as InternshipCategory)} 
                  required 
                  className="input-std"
                >
                  <option value="Teknologi Informasi">Teknologi Informasi</option>
                  <option value="Bisnis & Manajemen">Bisnis & Manajemen</option>
                  <option value="Pemasaran & Penjualan">Pemasaran & Penjualan</option>
                  <option value="Keuangan & Akuntansi">Keuangan & Akuntansi</option>
                  <option value="Desain & Kreatif">Desain & Kreatif</option>
                  <option value="Sumber Daya Manusia">Sumber Daya Manusia</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Penelitian & Pengembangan">Penelitian & Pengembangan</option>
                  <option value="Layanan Pelanggan">Layanan Pelanggan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duration" className="label-std">Durasi <span className="text-red-500">*</span></label>
                <select 
                  id="duration" 
                  value={duration} 
                  onChange={e => setDuration(e.target.value as InternshipDuration)} 
                  required 
                  className="input-std"
                >
                  <option value={InternshipDuration.SHORT_TERM}>1-3 Bulan</option>
                  <option value={InternshipDuration.MEDIUM_TERM}>3-6 Bulan</option>
                  <option value={InternshipDuration.LONG_TERM}>6-12 Bulan</option>
                  <option value={InternshipDuration.FLEXIBLE}>Fleksibel</option>
                </select>
              </div>
              <div>
                <label htmlFor="internshipType" className="label-std">Tipe Magang <span className="text-red-500">*</span></label>
                <select 
                  id="internshipType" 
                  value={internshipType} 
                  onChange={e => setInternshipType(e.target.value as InternshipType)} 
                  required 
                  className="input-std"
                >
                  <option value={InternshipType.FULL_TIME}>Full Time</option>
                  <option value={InternshipType.PART_TIME}>Part Time</option>
                  <option value={InternshipType.REMOTE}>Remote</option>
                  <option value={InternshipType.HYBRID}>Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="label-std">Lokasi <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="location" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  required 
                  className="input-std" 
                  placeholder="Contoh: Jakarta Selatan, Remote" 
                />
              </div>
              <div>
                <label htmlFor="stipend" className="label-std">Stipend Bulanan (Rp)</label>
                <input 
                  type="number" 
                  id="stipend" 
                  value={stipend} 
                  onChange={e => setStipend(e.target.value)} 
                  className="input-std" 
                  placeholder="0 untuk unpaid" 
                  min="0" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="startDate" className="label-std">Tanggal Mulai</label>
                <input 
                  type="date" 
                  id="startDate" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  className="input-std" 
                />
              </div>
              <div>
                <label htmlFor="endDate" className="label-std">Tanggal Selesai</label>
                <input 
                  type="date" 
                  id="endDate" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                  className="input-std" 
                />
              </div>
              <div>
                <label htmlFor="applicationDeadline" className="label-std">Deadline Pendaftaran</label>
                <input 
                  type="date" 
                  id="applicationDeadline" 
                  value={applicationDeadline} 
                  onChange={e => setApplicationDeadline(e.target.value)} 
                  className="input-std" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label-std">Deskripsi Program <span className="text-red-500">*</span></label>
              <SimpleRichTextEditor value={description} onChange={setDescription} placeholder="Jelaskan detail program magang, manfaat, dll." />
              <p className="text-xs text-gray-500 mt-1">Anda bisa menggunakan HTML dasar untuk format teks.</p>
            </div>

            <div>
              <label htmlFor="requirements" className="label-std">Persyaratan <span className="text-red-500">*</span></label>
              <SimpleRichTextEditor value={requirements} onChange={setRequirements} placeholder="Jelaskan persyaratan yang dibutuhkan untuk program ini." />
            </div>

            <div>
              <label htmlFor="responsibilities" className="label-std">Tanggung Jawab (Pisahkan dengan koma) <span className="text-red-500">*</span></label>
              <SimpleRichTextEditor value={responsibilities} onChange={setResponsibilities} placeholder="Tanggung jawab 1, Tanggung jawab 2, dst." rows={4}/>
            </div>
            
            <div>
              <label htmlFor="learningObjectives" className="label-std">Yang Akan Dipelajari (Pisahkan dengan koma) <span className="text-red-500">*</span></label>
              <SimpleRichTextEditor value={learningObjectives} onChange={setLearningObjectives} placeholder="Skill 1, Skill 2, dst." rows={4}/>
            </div>

            <div>
              <label htmlFor="skillsRequired" className="label-std">Skills yang Dibutuhkan (Pisahkan dengan koma) <span className="text-red-500">*</span></label>
              <SimpleRichTextEditor value={skillsRequired} onChange={setSkillsRequired} placeholder="JavaScript, React, dst." rows={4}/>
            </div>

            <div>
              <label htmlFor="preferredSkills" className="label-std">Skills yang Diutamakan (Pisahkan dengan koma, opsional)</label>
              <SimpleRichTextEditor value={preferredSkills} onChange={setPreferredSkills} placeholder="TypeScript, Node.js, dst." rows={4}/>
            </div>

            <div>
              <label htmlFor="benefits" className="label-std">Benefit (Pisahkan dengan koma, opsional)</label>
              <SimpleRichTextEditor value={benefits} onChange={setBenefits} placeholder="BPJS, Transport Allowance, dst." rows={4}/>
            </div>

            <div>
              <label htmlFor="mentorInfo" className="label-std">Informasi Mentor (Opsional)</label>
              <input 
                type="text" 
                id="mentorInfo" 
                value={mentorInfo} 
                onChange={e => setMentorInfo(e.target.value)} 
                className="input-std" 
                placeholder="Nama dan kualifikasi mentor/supervisor" 
              />
            </div>

            <div>
              <label htmlFor="maxApplicants" className="label-std">Maksimal Pelamar (Opsional)</label>
              <input 
                type="number" 
                id="maxApplicants" 
                value={maxApplicants} 
                onChange={e => setMaxApplicants(e.target.value)} 
                className="input-std" 
                placeholder="Kosongkan untuk tidak terbatas" 
                min="1" 
              />
            </div>

            <div>
              <label htmlFor="status" className="label-std">Status Program</label>
              <select 
                id="status" 
                value={status} 
                onChange={e => setStatus(e.target.value as InternshipStatus)} 
                className="input-std"
              >
                <option value={InternshipStatus.DRAFT}>Draft</option>
                <option value={InternshipStatus.ACTIVE}>Aktif</option>
                <option value={InternshipStatus.PAUSED}>Ditangguhkan</option>
                <option value={InternshipStatus.CLOSED}>Ditutup</option>
              </select>
            </div>

            <div>
              <label htmlFor="isActive" className="label-std">Status Publikasi</label>
              <select 
                id="isActive" 
                value={isActive ? 'true' : 'false'} 
                onChange={e => setIsActive(e.target.value === 'true')} 
                className="input-std"
              >
                <option value="true">Aktif (Ditampilkan di katalog)</option>
                <option value="false">Nonaktif (Disembunyikan dari katalog)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(APP_ROUTES.INTERNSHIPS)}
                className="btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Icons.FloppyDiskIcon size={20} />
                    <span className="ml-2">{isEditMode ? 'Update Program' : 'Posting Program'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostInternshipPage; 