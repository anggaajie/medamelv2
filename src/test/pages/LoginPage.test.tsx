// vi.mock HARUS sebelum import apapun!
vi.mock('@/config/firebase', () => {
  return {
    auth: {
      currentUser: null,
      onAuthStateChanged: vi.fn(),
      signOut: vi.fn(),
    },
    db: {},
  };
});

vi.mock('firebase/auth', () => {
  const mockSignInWithEmailAndPassword = vi.fn();
  const mockSignInWithPopup = vi.fn();
  const mockGoogleAuthProvider = vi.fn();
  return {
    signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
    signInWithPopup: mockSignInWithPopup,
    GoogleAuthProvider: mockGoogleAuthProvider,
    __mocks: {
      mockSignInWithEmailAndPassword,
      mockSignInWithPopup,
      mockGoogleAuthProvider,
    },
  };
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '@/pages/LoginPage';
import * as firebaseAuthModule from 'firebase/auth';

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  let mockSignInWithEmailAndPassword: any;
  let mockSignInWithPopup: any;
  let mockGoogleAuthProvider: any;

  beforeEach(() => {
    // Get mocks from the mocked module
    mockSignInWithEmailAndPassword = (firebaseAuthModule as any).__mocks.mockSignInWithEmailAndPassword;
    mockSignInWithPopup = (firebaseAuthModule as any).__mocks.mockSignInWithPopup;
    mockGoogleAuthProvider = (firebaseAuthModule as any).__mocks.mockGoogleAuthProvider;
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderLoginPage();
    expect(screen.getByText(/selamat datang/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^masuk$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderLoginPage();
    const submitButton = screen.getByRole('button', { name: /^masuk$/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/email harus diisi/i)).toBeInTheDocument();
      expect(screen.getByText(/password harus diisi/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^masuk$/i });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for weak password', async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^masuk$/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/password minimal 8 karakter/i)).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'test-uid' } });
    renderLoginPage();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^masuk$/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'Password123'
      );
    });
  });

  it('handles login error', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));
    renderLoginPage();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^masuk$/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/email atau password salah/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText(/password/i);
    // Cari tombol toggle password dengan aria-label
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
}); 