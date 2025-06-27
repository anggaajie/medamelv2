import React, { useState } from 'react';
import { createDummyInternshipData, createTestApplication } from '@/utils/createDummyInternshipData';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';

const TestInternshipDataPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleCreateDummyData = async () => {
    if (!currentUser) {
      setMessage('Anda harus login terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      setMessage('Membuat data dummy...');
      
      await createDummyInternshipData();
      setMessage('Data dummy berhasil dibuat!');
    } catch (error: any) {
      console.error('Error creating dummy data:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestApplication = async () => {
    if (!currentUser) {
      setMessage('Anda harus login terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      setMessage('Membuat test application...');
      
      const appId = await createTestApplication(currentUser.uid);
      setMessage(`Test application berhasil dibuat dengan ID: ${appId}`);
    } catch (error: any) {
      console.error('Error creating test application:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner fullPage={true} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Test Internship Data</h1>
        <p className="text-white">Halaman untuk membuat data dummy program magang</p>
      </div>

      <div className="glass p-6 max-w-md">
        <div className="space-y-4">
          <button
            onClick={handleCreateDummyData}
            className="w-full btn-primary"
            disabled={loading}
          >
            Buat Data Dummy Lengkap
          </button>
          
          <button
            onClick={handleCreateTestApplication}
            className="w-full btn-secondary"
            disabled={loading}
          >
            Buat Test Application
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestInternshipDataPage; 
