import { FirebaseError } from 'firebase/app';
import { db } from '@/config/firebase';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  userId?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: any, context?: string): AppError {
    const appError: AppError = {
      type: this.categorizeError(error),
      message: this.getUserFriendlyMessage(error),
      code: error.code || error.name,
      details: {
        originalError: error,
        context,
        stack: error.stack
      },
      timestamp: Date.now()
    };

    this.logError(appError);
    return appError;
  }

  private categorizeError(error: any): ErrorType {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
          return ErrorType.AUTHENTICATION;
        case 'permission-denied':
          return ErrorType.AUTHORIZATION;
        case 'not-found':
          return ErrorType.NOT_FOUND;
        default:
          return ErrorType.SERVER;
      }
    }

    if (error.name === 'NetworkError' || error.message?.includes('network')) {
      return ErrorType.NETWORK;
    }

    if (error.name === 'ValidationError') {
      return ErrorType.VALIDATION;
    }

    return ErrorType.UNKNOWN;
  }

  private getUserFriendlyMessage(error: any): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'Email tidak terdaftar dalam sistem';
        case 'auth/wrong-password':
          return 'Password yang Anda masukkan salah';
        case 'auth/invalid-email':
          return 'Format email tidak valid';
        case 'permission-denied':
          return 'Anda tidak memiliki akses ke fitur ini';
        case 'not-found':
          return 'Data yang Anda cari tidak ditemukan';
        default:
          return 'Terjadi kesalahan pada server. Silakan coba lagi';
      }
    }

    if (error.name === 'NetworkError') {
      return 'Koneksi internet terputus. Silakan periksa koneksi Anda';
    }

    if (error.name === 'ValidationError') {
      return 'Data yang Anda masukkan tidak valid';
    }

    return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi';
  }

  private logError(error: AppError): void {
    this.errorLog.push(error);
    console.error('Application Error:', error);
    
    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(error);
    }
  }

  private sendToLoggingService(error: AppError): void {
    // Implementation for external logging service
    // e.g., Sentry, LogRocket, etc.
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Simple function for easy error handling
export const handleError = (error: any, context?: string): AppError => {
  return errorHandler.handleError(error, context);
}; 