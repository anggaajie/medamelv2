// vi.mock HARUS sebelum import apapun!
vi.mock('@/config/firebase', () => {
  const mockOnAuthStateChanged = vi.fn();
  const mockSignOut = vi.fn();
  return {
    auth: {
      currentUser: null,
      onAuthStateChanged: mockOnAuthStateChanged,
      signOut: mockSignOut,
    },
    db: {},
    // Export mocks for test access
    __mocks: {
      mockOnAuthStateChanged,
      mockSignOut,
    },
  };
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import * as firebaseModule from '@/config/firebase';

// Wrapper component untuk AuthProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  let mockOnAuthStateChanged: any;
  let mockSignOut: any;

  beforeEach(() => {
    // Get mocks from the mocked module
    mockOnAuthStateChanged = (firebaseModule as any).__mocks.mockOnAuthStateChanged;
    mockSignOut = (firebaseModule as any).__mocks.mockSignOut;
    vi.clearAllMocks();
    mockOnAuthStateChanged.mockImplementation((cb: any) => {
      // Simulate initial call with null user
      cb(null);
      return () => {};
    });
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.currentUser).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.clearCurrentUser).toBe('function');
  });

  it('should handle auth state changes', () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      role: 'job_seeker',
      status: 'active',
      educationHistory: [],
      languageSkills: [],
      workHistory: [],
    };
    mockOnAuthStateChanged.mockImplementationOnce((cb: any) => {
      cb(mockUser);
      return () => {};
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.currentUser).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('should handle sign out', async () => {
    mockSignOut.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.clearCurrentUser();
    });
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should handle auth state change to null', () => {
    mockOnAuthStateChanged.mockImplementationOnce((cb: any) => {
      cb(null);
      return () => {};
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.currentUser).toBeNull();
    expect(result.current.loading).toBe(false);
  });
}); 