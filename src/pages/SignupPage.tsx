import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import { logUserActivity } from '@/utils/activityLogger';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { errorHandler } from '@/utils/errorHandler';
import { Validator } from '@/utils/validation';
import { trackEvent } from '@/utils/analytics';

const GOOGLE_ICON_URL = 'https://www.vectorlogo.zone/logos/google/google-icon.svg';

const roleOptions = [
  { value: UserRole.JOB_SEEKER, label: 'Pencari Kerja', description: 'Mencari peluang karir terbaik' },
  { value: UserRole.COMPANY, label: 'Perusahaan', description: 'Mengelola lowongan dan kandidat' },
  { value: UserRole.TRAINING_PROVIDER, label: 'Penyedia Pelatihan', description: 'Menyediakan program pelatihan' },
];

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.JOB_SEEKER);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    const emailValidation = Validator.validateEmail(email);
    const passwordValidation = Validator.validatePassword(password);
    const nameValidation = Validator.validateRequired(displayName, 'Nama Lengkap');
    if (!emailValidation.isValid || !passwordValidation.isValid || !nameValidation.isValid) {
      setError([
        ...nameValidation.errors,
        ...emailValidation.errors,
        ...passwordValidation.errors
      ].join(' '));
      return;
    }
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        const firebaseUser = userCredential.user;
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: displayName,
          photoURL: firebaseUser.photoURL,
          role: role,
          status: 'active',
          createdAt: serverTimestamp(),
          profileLastUpdated: serverTimestamp(),
        });
        localStorage.setItem(`userRole_${firebaseUser.uid}`, JSON.stringify(role));
        await logUserActivity(auth, db, 'SIGNUP_EMAIL_SUCCESS', { userId: firebaseUser.uid, email: firebaseUser.email, role });
        trackEvent('signup', {
          method: 'email',
          role: role,
          success: true
        });
        navigate(APP_ROUTES.DASHBOARD);
      } else {
        throw new Error('Gagal membuat pengguna.');
      }
    } catch (err: any) {
      const appError = errorHandler.handleError(err, 'SignupPage');
      setError(appError.message);
      await logUserActivity(auth, db, 'SIGNUP_EMAIL_FAILURE', { attemptEmail: email, error: appError.message });
      trackEvent('signup', {
        method: 'email',
        role: role,
        success: false,
        error: appError.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      if (!firebaseUser) throw new Error('Gagal login dengan Google.');
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: role,
          status: 'active',
          createdAt: serverTimestamp(),
          profileLastUpdated: serverTimestamp(),
        });
        await logUserActivity(auth, db, 'SIGNUP_GOOGLE_NEW_USER_SUCCESS', { userId: firebaseUser.uid, email: firebaseUser.email, role });
        trackEvent('signup', {
          method: 'google',
          role: role,
          success: true,
          isNewUser: true
        });
      } else {
        await logUserActivity(auth, db, 'SIGNUP_GOOGLE_EXISTING_USER_LOGIN', { userId: firebaseUser.uid, email: firebaseUser.email, existingRole: docSnap.data()?.role });
        trackEvent('signup', {
          method: 'google',
          role: role,
          success: true,
          isNewUser: false
        });
      }
      localStorage.setItem(`userRole_${firebaseUser.uid}`, JSON.stringify(role));
      navigate(APP_ROUTES.DASHBOARD);
    } catch (err: any) {
      const appError = errorHandler.handleError(err, 'SignupPage-Google');
      setError(appError.message);
      await logUserActivity(auth, db, 'SIGNUP_GOOGLE_FAILURE', { error: appError.message });
      trackEvent('signup', {
        method: 'google',
        role: role,
        success: false,
        error: appError.message
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roleOptions.find(opt => opt.value === role);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="page-title mb-3">
            Medamel
          </h1>
          <p className="text-secondary max-w-md mx-auto">
            Temukan peluang karir dan pelatihan terbaik
          </p>
        </div>

        {/* Signup Card */}
        <div className="content-card p-8">
          <div className="text-center mb-8">
            <h2 className="section-title mb-2">
              Buat akun baru
            </h2>
            <p className="text-secondary">
              Bergabung untuk memulai perjalanan karir Anda
            </p>
            <p className="text-secondary mt-2">
              Sudah punya akun?{' '}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert-error mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-6">
            
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="displayName" className="form-label">
                Nama Lengkap *
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-input"
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="contoh@email.com"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">
                Pilih Peran *
              </label>
              <div className="grid-3 mt-2">
                {roleOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`action-card ${role === option.value ? 'ring-2 ring-blue-500 bg-blue-900/50' : ''}`}
                    onClick={() => setRole(option.value)}
                  >
                    <div className="action-card-title text-sm">
                      {option.label}
                    </div>
                    <div className="text-xs text-secondary">
                      {option.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-12"
                  placeholder="Minimal 6 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlash className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Konfirmasi Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input pr-12"
                  placeholder="Ulangi password Anda"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeSlash className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
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
                  Memproses...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-secondary">Atau</span>
              </div>
            </div>

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="btn-secondary w-full py-3"
            >
              <img className="h-5 w-5 mr-2" src={GOOGLE_ICON_URL} alt="Google Icon" />
              Daftar dengan Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
