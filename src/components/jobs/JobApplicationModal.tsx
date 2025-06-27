import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '@/hooks/useAuth';
import { db, storage, auth } from '@/config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { JobListing, JobApplication, ApplicationStatus } from '@/types';
import Spinner from '@/components/Spinner';
import { logUserActivity } from '@/utils/activityLogger';
import { handleError } from '@/utils/errorHandler';
import { Validator } from '@/utils/validation';
import { showNotification } from '@/utils/notificationService';
import { trackEvent } from '@/utils/analytics';
import { APP_ROUTES } from '@/constants';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
}

if (document.getElementById('root')) {
  Modal.setAppElement('#root');
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ 
  isOpen, 
  onClose, 
  jobId, 
  jobTitle,
  companyId,
  companyName
}) => {
  const { currentUser } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      const fileValidation = Validator.validateFile(file, maxSize, allowedTypes);
      if (!fileValidation.isValid) {
        setErrors({ resumeFile: fileValidation.errors[0] });
        setResumeFile(null);
        return;
      }
      
      setErrors({}); 
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) {
      showNotification('error', 'Anda harus login untuk melamar.');
      return;
    }
    
    if (!resumeFile) {
      setErrors({ resumeFile: 'Silakan unggah CV/Resume Anda.' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const resumePath = `jobApplications/${jobId}/${currentUser.uid}/resume_${Date.now()}_${resumeFile.name}`;
      const resumeStorageRef = ref(storage, resumePath);
      await uploadBytes(resumeStorageRef, resumeFile);
      const resumeUrl = await getDownloadURL(resumeStorageRef);

      const applicationData: Omit<JobApplication, 'id'> = {
        jobId,
        jobTitle,
        companyId,
        companyName,
        applicantId: currentUser.uid,
        applicantName: currentUser.displayName || currentUser.email || 'Pelamar Anonim',
        applicantEmail: currentUser.email || undefined,
        appliedAt: Date.now(), 
        status: ApplicationStatus.PENDING,
        resumeUrl,
        resumeFileName: resumeFile.name,
        coverLetterText: coverLetterText || undefined,
        notes: notes || undefined,
      };

      const docRef = await addDoc(collection(db, 'jobApplications'), {
        ...applicationData,
        appliedAt: serverTimestamp(),
      });
      
      await logUserActivity(auth, db, 'JOB_APPLICATION_SUBMITTED', { 
        applicationId: docRef.id, 
        jobId, 
        jobTitle 
      });
      
      trackEvent('job_application_submitted', {
        applicationId: docRef.id,
        jobId,
        jobTitle,
        companyName,
        jobType: '',
        hasCoverLetter: coverLetterText.length > 0,
        hasResume: resumeUrl.length > 0
      });

      showNotification('success', 'Lamaran berhasil dikirim!');
      setTimeout(() => {
        onClose();
        setResumeFile(null);
        setCoverLetterText('');
        setNotes('');
        setErrors({});
      }, 2000);

    } catch (err: any) {
      handleError(err, 'Gagal mengirim lamaran. Silakan coba lagi.');
      await logUserActivity(auth, db, 'JOB_APPLICATION_SUBMIT_FAILURE', { jobId, jobTitle, error: err.message });
      trackEvent('job_application_submitted', {
        success: false,
        jobId,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto' as 'auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '25px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1000,
    },
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onRequestClose={onClose} 
        style={customModalStyles}
        contentLabel="Formulir Lamaran Kerja"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full mx-auto my-8 max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Lamar Posisi: {jobTitle}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="resumeFile" className="label-std">CV/Resume (PDF, DOC, DOCX - Max 5MB) <span className="text-red-500">*</span></label>
          <input 
            type="file" 
            id="resumeFile" 
            onChange={handleFileChange} 
            required 
            className={`input-file-std ${errors.resumeFile ? 'border-red-500' : ''}`}
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          {errors.resumeFile && <p className="text-red-500 text-sm mt-1">{errors.resumeFile}</p>}
          {resumeFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">File terpilih: {resumeFile.name}</p>}
        </div>
        <div>
          <label htmlFor="coverLetterText" className="label-std">Surat Lamaran (Opsional)</label>
          <textarea 
            id="coverLetterText" 
            value={coverLetterText} 
            onChange={(e) => setCoverLetterText(e.target.value)} 
            rows={5}
            className="input-std"
            placeholder="Tulis surat lamaran singkat Anda di sini..."
          />
        </div>
        <div>
          <label htmlFor="notes" className="label-std">Catatan Tambahan (Opsional)</label>
          <textarea 
            id="notes" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            rows={3}
            className="input-std"
            placeholder="Informasi tambahan yang ingin Anda sampaikan..."
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
            Batal
          </button>
          <button type="submit" disabled={loading || !resumeFile} className="btn-primary">
            {loading ? <Spinner size="sm" color="text-white"/> : 'Kirim Lamaran'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobApplicationModal;
