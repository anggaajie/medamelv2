import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '@/hooks/useAuth';
import { db, auth } from '@/config/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { JobApplication } from '@/types';
import Spinner from '@/components/Spinner';
import { logUserActivity } from '@/utils/activityLogger';
import { handleError } from '@/utils/errorHandler';
import { showNotification } from '@/utils/notificationService';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication;
}

if (document.getElementById('root')) {
  Modal.setAppElement('#root');
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({ isOpen, onClose, application }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | undefined>(application.assessmentRating);
  const [notes, setNotes] = useState(application.assessmentNotes || '');
  const [tags, setTags] = useState((application.assessmentTags || []).join(', '));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setRating(application.assessmentRating);
    setNotes(application.assessmentNotes || '');
    setTags((application.assessmentTags || []).join(', '));
  }, [application]);

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) {
      showNotification('error', 'Sesi Anda berakhir. Harap login kembali.');
      return;
    }
    
    if (!rating) {
      setErrors({ rating: 'Silakan berikan rating untuk lamaran ini.' });
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const appDocRef = doc(db, 'jobApplications', application.id);
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const updateData: Partial<JobApplication> = {
        assessmentRating: rating,
        assessmentNotes: notes,
        assessmentTags: tagsArray.length > 0 ? tagsArray : undefined,
        lastAssessmentUpdate: Date.now() 
      };

      await updateDoc(appDocRef, {
        ...updateData,
        lastAssessmentUpdate: serverTimestamp()
      });
      await logUserActivity(auth, db, 'ASSESSMENT_SAVE_SUCCESS', { applicationId: application.id, applicantName: application.applicantName, rating });
      showNotification('success', 'Penilaian berhasil disimpan!');
      onClose(); 
    } catch (err: any) {
      handleError(err, 'Gagal menyimpan penilaian.');
      await logUserActivity(auth, db, 'ASSESSMENT_SAVE_FAILURE', { applicationId: application.id, error: err.message });
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
      maxWidth: '500px',
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
        contentLabel="Formulir Penilaian Lamaran"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-auto my-8 max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Nilai Lamaran: {application.applicantName}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Untuk posisi: {application.jobTitle}</p>
      
      <form onSubmit={handleSubmitAssessment} className="space-y-4">
        <div>
          <label className="label-std mb-1">Rating (1-5 Bintang) <span className="text-red-500">*</span></label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
                className={`text-2xl transition-colors ${
                  rating && star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                }`}
                aria-label={`Beri ${star} bintang`}
              >
                ★
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
        </div>

        <div>
          <label htmlFor="assessmentNotes" className="label-std">Catatan Internal</label>
          <textarea
            id="assessmentNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="input-std"
            placeholder="Tulis catatan penilaian Anda di sini..."
          />
        </div>

        <div>
          <label htmlFor="assessmentTags" className="label-std">Tag (Pisahkan dengan koma)</label>
          <input
            type="text"
            id="assessmentTags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-std"
            placeholder="Contoh: Potensial, Skill Komunikasi Baik, Butuh Pengalaman"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
            Batal
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Spinner size="sm" color="text-white"/> : 'Simpan Penilaian'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssessmentModal;
