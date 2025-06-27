import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { errorHandler } from '@/utils/errorHandler';
import { Validator } from '@/utils/validation';
import { trackEvent } from '@/utils/analytics';
import { UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import { logUserActivity } from '@/utils/activityLogger';

const GOOGLE_ICON_URL = 'https://www.vectorlogo.zone/logos/google/google-icon.svg';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Accessibility refs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  // Announce errors to screen readers
  useEffect(() => {
    if (error) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Error: ${error}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const emailValidation = Validator.validateEmail(email);
    const passwordValidation = Validator.validatePassword(password);
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setError([...emailValidation.errors, ...passwordValidation.errors].join(' '));
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      trackEvent('login', {
        method: 'email',
        success: true
      });
      navigate('/dashboard');
    } catch (err: any) {
      const appError = errorHandler.handleError(err, 'LoginPage');
      setError(appError.message);
      trackEvent('login', {
        method: 'email',
        success: false,
        error: appError.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      trackEvent('login', {
        method: 'google',
        success: true
      });
      navigate('/dashboard');
    } catch (err: any) {
      const appError = errorHandler.handleError(err, 'LoginPage-Google');
      setError(appError.message);
      trackEvent('login', {
        method: 'google',
        success: false,
        error: appError.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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

        {/* Login Card */}
        <div className="content-card p-8">
          <div className="text-center mb-8">
            <h2 className="section-title mb-2">
              Masuk ke akun Anda
            </h2>
            <p className="text-secondary">
              Belum punya akun?{' '}
              <Link 
                to="/signup" 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div 
              ref={errorRef}
              className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6"
              role="alert"
              aria-live="polite"
              tabIndex={-1}
            >
              {error}
            </div>
          )}

          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            aria-label="Login form"
            noValidate
            className="space-y-6"
          >
            
            {/* Email Field */}
            <div>
              <label htmlFor="email-address" className="form-label">
                Email Address *
              </label>
              <input
                ref={emailRef}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="form-input pr-12"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlash className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Lupa password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
              aria-describedby={isLoading ? "loading-status" : undefined}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Masuk'
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

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="btn-secondary w-full py-3"
            >
              <img className="h-5 w-5 mr-2" src={GOOGLE_ICON_URL} alt="Google Icon" />
              Masuk dengan Google
            </button>
          </form>
          
          {/* Tip */}
          <div className="text-center mt-6">
            <p className="text-xs text-secondary">
              Tip: Tekan Ctrl + Enter untuk login cepat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
