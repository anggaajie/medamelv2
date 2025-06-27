import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { db, auth } from '@/config/firebase'; // Assuming auth is needed for logging
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { VideoInterviewSession } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import { logUserActivity } from '@/utils/activityLogger';
import { handleError } from '@/utils/errorHandler';
import { showNotification } from '@/utils/notificationService';

interface CreateInterviewRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

if (document.getElementById('root')) {
  Modal.setAppElement('#root');
}

const CreateInterviewRoomModal: React.FC<CreateInterviewRoomModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) {
      showNotification('error', 'Anda harus login untuk membuat ruang wawancara.');
      return;
    }
    
    if (!roomName.trim()) {
      setErrors({ roomName: 'Nama ruang tidak boleh kosong.' });
      return;
    }
    
    if (roomName.trim().length < 3) {
      setErrors({ roomName: 'Nama ruang minimal 3 karakter.' });
      return;
    }
    
    if (roomName.trim().length > 100) {
      setErrors({ roomName: 'Nama ruang maksimal 100 karakter.' });
      return;
    }

    setLoading(true);
    setErrors({});

    const roomId = uuidv4();


    const sessionData: Omit<VideoInterviewSession, 'id'> = {
      roomName: roomName.trim(),
      companyId: currentUser.uid,
      companyName: currentUser.displayName || currentUser.email || 'Perusahaan Medamel',
      createdAt: Date.now(),
      status: 'PENDING',
    };

    try {

      const docRef = await addDoc(collection(db, 'videoInterviewSessions'), {
        ...sessionData,
        id: roomId,
        createdAt: serverTimestamp(),
      });
      await logUserActivity(auth, db, 'INTERVIEW_ROOM_CREATE_SUCCESS', { roomId, roomName: sessionData.roomName, firestoreId: docRef.id });
      
      showNotification('success', 'Ruang wawancara berhasil dibuat!');

      navigate(APP_ROUTES.INTERVIEW_ROOM.replace(':roomId', roomId), { state: { roomName: sessionData.roomName } });
      onClose();

    } catch (err: any) {
      handleError(err, 'Gagal membuat ruang wawancara.');
      await logUserActivity(auth, db, 'INTERVIEW_ROOM_CREATE_FAILURE', { roomName: sessionData.roomName, error: err.message });
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
      contentLabel="Buat Ruang Wawancara Baru"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-auto my-8 max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Buat Ruang Wawancara Baru</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomName" className="label-std">Nama Ruang Wawancara <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            className={`input-std ${errors.roomName ? 'border-red-500' : ''}`}
            placeholder="Contoh: Wawancara Frontend Developer - John Doe"
          />
          {errors.roomName && <p className="text-red-500 text-sm mt-1">{errors.roomName}</p>}
        </div>
        
        {/* Placeholder for inviting candidate or linking to application */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Fitur untuk mengundang kandidat atau menautkan ke lamaran akan ditambahkan. 
          Saat ini, Anda akan membuat ruang dan mendapatkan ID unik.
        </p>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
            Batal
          </button>
          <button type="submit" disabled={loading || !roomName.trim()} className="btn-primary">
            {loading ? <Spinner size="sm" color="text-white"/> : 'Buat & Masuk Ruang'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateInterviewRoomModal;