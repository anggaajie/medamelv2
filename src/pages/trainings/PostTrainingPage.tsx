import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { TrainingProgram, TrainingCategory, TrainingCategories, UserRole } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { logUserActivity } from '@/utils/activityLogger';
import { handleError } from '@/utils/errorHandler';
import { validateTrainingProgram } from '@/utils/validation';
import { showNotification } from '@/utils/notificationService';
import { trackEvent } from '@/utils/analytics';
import SimpleRichTextEditor from '@/components/SimpleRichTextEditor';

const PostTrainingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { programId } = useParams<{ programId?: string }>();
  const isEditMode = Boolean(programId);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TrainingCategory>(TrainingCategories[0]);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState<string>('0');
  const [instructorInfo, setInstructorInfo] = useState('');
  const [syllabus, setSyllabus] = useState<string>(''); 
  const [targetAudience, setTargetAudience] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string>(''); 
  const [certificateName, setCertificateName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && programId) {
      setLoading(true);
      const programDocRef = doc(db, 'trainingPrograms', programId);
      getDoc(programDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const programData = docSnap.data() as TrainingProgram;
          if (currentUser?.uid !== programData.providerId && currentUser?.role !== UserRole.ADMIN) {
            showNotification('error', 'Anda tidak memiliki izin untuk mengedit program ini.');
            navigate(APP_ROUTES.TRAINING_CATALOG);
            return;
          }
          setTitle(programData.title);
          setCategory(programData.category);
          setDescription(programData.description);
          setDuration(programData.duration);
          setLocation(programData.location);
          setCost(programData.cost.toString());
          setInstructorInfo(programData.instructorInfo);
          setSyllabus(programData.syllabus.join(', '));
          setTargetAudience(programData.targetAudience);
          setPrerequisites(programData.prerequisites);
          setLearningObjectives(programData.learningObjectives.join(', '));
          setCertificateName(programData.certificateName || '');
          setIsActive(programData.isActive);
        } else {
          showNotification('error', 'Program pelatihan tidak ditemukan.');
          navigate(APP_ROUTES.TRAINING_CATALOG);
        }
      }).catch(err => {
        handleError(err, 'Gagal memuat data program pelatihan.');
      }).finally(() => setLoading(false));
    }
  }, [isEditMode, programId, currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) { 
      showNotification('error', 'Anda harus masuk untuk memposting program pelatihan.');
      return;
    }
    
    setLoading(true);
    setErrors({});

    const syllabusArray = syllabus.split(',').map(s => s.trim()).filter(s => s);
    const objectivesArray = learningObjectives.split(',').map(o => o.trim()).filter(o => o);

    const programData = {
      title,
      category,
      description,
      duration,
      location,
      cost: parseInt(cost, 10) || 0,
      instructorInfo,
      syllabus: syllabusArray,
      targetAudience,
      prerequisites,
      learningObjectives: objectivesArray,
      certificateName: certificateName || undefined,
      isActive,
    };

    // Validate form data
    const validationErrors = validateTrainingProgram(programData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      if (isEditMode && programId) {
        const programDocRef = doc(db, 'trainingPrograms', programId);
        await updateDoc(programDocRef, {
            ...programData,
            updatedAt: serverTimestamp()
        });
        await logUserActivity(auth, db, 'TRAINING_PROGRAM_UPDATE_SUCCESS', { programId, title: programData.title });
        showNotification('success', 'Program pelatihan berhasil diperbarui!');
        navigate(APP_ROUTES.TRAINING_DETAIL.replace(':programId', programId));
      } else {
        const fullProgramData: Omit<TrainingProgram, 'id'> = {
            ...programData,
            providerId: currentUser.uid,
            providerName: currentUser.displayName || currentUser.email || 'Penyedia Medamel',
            providerLogoUrl: currentUser.photoURL || undefined,
            postedAt: Date.now(), 
            updatedAt: Date.now(), 
            isActive: true, 
        } as Omit<TrainingProgram, 'id'>;

        const docRef = await addDoc(collection(db, 'trainingPrograms'), {
            ...fullProgramData,
            postedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        await logUserActivity(auth, db, 'TRAINING_PROGRAM_CREATE_SUCCESS', { programId: docRef.id, title: fullProgramData.title });
        showNotification('success', 'Program pelatihan berhasil diposting!');
        
        await trackEvent('training_posted', {
          trainingId: docRef.id,
          trainingTitle: title,
          provider: currentUser.displayName || currentUser.email || 'Penyedia Medamel',
          category: category,
          level: '',
          price: parseInt(cost, 10) || 0,
          hasDeadline: false,
          hasMaxParticipants: false,
          hasCertificate: certificateName !== '',
          isOnline: location.toLowerCase().includes('online')
        });
        
        navigate(APP_ROUTES.TRAINING_DETAIL.replace(':programId', docRef.id));
      }
    } catch (err: any) {
      handleError(err, 'Gagal menyimpan program pelatihan. Silakan coba lagi.');
      const actionType = isEditMode ? 'TRAINING_PROGRAM_UPDATE_FAILURE' : 'TRAINING_PROGRAM_CREATE_FAILURE';
      await logUserActivity(auth, db, actionType, { error: err.message, title: programData.title, programIdIfEditing: programId });
      trackEvent('training_posted', {
        success: false,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditMode) return <Spinner fullPage={true} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">
        {isEditMode ? 'Ubah Program Pelatihan' : 'Posting Program Pelatihan Baru'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-6">
        {loading && isEditMode && <Spinner />}

        <div>
          <label htmlFor="title" className="label-std">Judul Program <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            className={`input-std ${errors.title ? 'border-red-500' : ''}`} 
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="label-std">Kategori <span className="text-red-500">*</span></label>
            <select 
              id="category" 
              value={category} 
              onChange={e => setCategory(e.target.value as TrainingCategory)} 
              required 
              className={`input-std ${errors.category ? 'border-red-500' : ''}`}
            >
              {TrainingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div>
            <label htmlFor="duration" className="label-std">Durasi <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              id="duration" 
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              required 
              className={`input-std ${errors.duration ? 'border-red-500' : ''}`} 
              placeholder="Contoh: 4 Minggu, 20 Jam Total" 
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
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
              className={`input-std ${errors.location ? 'border-red-500' : ''}`} 
              placeholder="Contoh: Online via Zoom, Offline - Gedung X" 
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          <div>
            <label htmlFor="cost" className="label-std">Biaya (Rp) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              id="cost" 
              value={cost} 
              onChange={e => setCost(e.target.value)} 
              required 
              className={`input-std ${errors.cost ? 'border-red-500' : ''}`} 
              placeholder="0 untuk gratis" 
              min="0" 
            />
            {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label-std">Deskripsi Program <span className="text-red-500">*</span></label>
          <SimpleRichTextEditor 
            value={description} 
            onChange={setDescription} 
            placeholder="Jelaskan detail program, manfaat, dll." 
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          <p className="text-xs text-slate-100 mt-1">Anda bisa menggunakan HTML dasar untuk format teks.</p>
        </div>

        <div>
          <label htmlFor="instructorInfo" className="label-std">Informasi Instruktur <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="instructorInfo" 
            value={instructorInfo} 
            onChange={e => setInstructorInfo(e.target.value)} 
            required 
            className={`input-std ${errors.instructorInfo ? 'border-red-500' : ''}`} 
            placeholder="Nama dan kualifikasi singkat instruktur" 
          />
          {errors.instructorInfo && <p className="text-red-500 text-sm mt-1">{errors.instructorInfo}</p>}
        </div>

        <div>
          <label htmlFor="syllabus" className="label-std">Silabus / Materi (Pisahkan dengan koma) <span className="text-red-500">*</span></label>
          <SimpleRichTextEditor 
            value={syllabus} 
            onChange={setSyllabus} 
            placeholder="Modul 1: ..., Modul 2: ..., dst." 
            rows={4}
          />
          {errors.syllabus && <p className="text-red-500 text-sm mt-1">{errors.syllabus}</p>}
        </div>
        
        <div>
          <label htmlFor="learningObjectives" className="label-std">Tujuan Pembelajaran (Pisahkan dengan koma) <span className="text-red-500">*</span></label>
          <SimpleRichTextEditor 
            value={learningObjectives} 
            onChange={setLearningObjectives} 
            placeholder="Peserta akan mampu ..., Peserta akan menguasai ..., dst." 
            rows={4}
          />
          {errors.learningObjectives && <p className="text-red-500 text-sm mt-1">{errors.learningObjectives}</p>}
        </div>

        <div>
          <label htmlFor="targetAudience" className="label-std">Target Peserta <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="targetAudience" 
            value={targetAudience} 
            onChange={e => setTargetAudience(e.target.value)} 
            required 
            className={`input-std ${errors.targetAudience ? 'border-red-500' : ''}`} 
            placeholder="Contoh: Mahasiswa, Profesional, Umum" 
          />
          {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
        </div>

        <div>
          <label htmlFor="prerequisites" className="label-std">Prasyarat (Opsional)</label>
          <input 
            type="text" 
            id="prerequisites" 
            value={prerequisites} 
            onChange={e => setPrerequisites(e.target.value)} 
            className="input-std" 
            placeholder="Contoh: Pengalaman dasar dengan X, Memiliki laptop" 
          />
        </div>
        
        <div>
          <label htmlFor="certificateName" className="label-std">Nama Sertifikat (Opsional, kosongkan jika tidak ada)</label>
          <input 
            type="text" 
            id="certificateName" 
            value={certificateName} 
            onChange={e => setCertificateName(e.target.value)} 
            className="input-std" 
            placeholder="Contoh: Sertifikat Penyelesaian Medamel" 
          />
        </div>

        <div>
            <label htmlFor="isActive" className="label-std">Status Program</label>
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

        <div className="pt-5">
          <div className="flex justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary mr-3">
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Spinner size="sm" color="text-white"/> : (isEditMode ? 'Simpan Perubahan' : 'Posting Program')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostTrainingPage;
