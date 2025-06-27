import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '@/config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { errorHandler } from '@/utils/errorHandler';
import { showNotification } from '@/utils/notificationService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Email pemulihan kata sandi telah dikirim. Silakan periksa kotak masuk Anda.');
    } catch (err: any) {
      const appError = errorHandler.handleError(err, 'ForgotPasswordPage');
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="page-title mb-3">
            Medamel
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">
            Temukan peluang karir dan pelatihan terbaik
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="content-card p-8">
          <div className="text-center mb-8">
            <h2 className="section-title mb-2">
              Lupa Kata Sandi?
            </h2>
            <p className="text-slate-600">
              Jangan khawatir! Masukkan alamat email Anda di bawah ini dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="alert-success mb-6">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert-error mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="anda@contoh.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                'Kirim Tautan Pemulihan'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <p className="text-slate-600">
              Ingat kata sandi Anda?{' '}
              <Link 
                to={APP_ROUTES.LOGIN} 
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
