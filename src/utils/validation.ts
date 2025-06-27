import { db } from '@/config/firebase';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.push('Email harus diisi');
    } else if (!emailPattern.test(email)) {
      errors.push('Format email tidak valid');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password harus diisi');
    } else {
      if (password.length < 8) {
        errors.push('Password minimal 8 karakter');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password harus mengandung huruf kecil');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password harus mengandung huruf besar');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Password harus mengandung angka');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];
    const phonePattern = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    
    if (!phone) {
      errors.push('Nomor telepon harus diisi');
    } else if (!phonePattern.test(phone)) {
      errors.push('Format nomor telepon tidak valid');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRequired(value: any, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${fieldName} harus diisi`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateLength(value: string, min: number, max: number, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (value && value.length < min) {
      errors.push(`${fieldName} minimal ${min} karakter`);
    }
    
    if (value && value.length > max) {
      errors.push(`${fieldName} maksimal ${max} karakter`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateFile(file: File, maxSize: number, allowedTypes: string[]): ValidationResult {
    const errors: string[] = [];
    
    if (!file) {
      errors.push('File harus dipilih');
    } else {
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        errors.push(`Ukuran file maksimal ${maxSizeMB}MB`);
      }
      
      if (!allowedTypes.includes(file.type)) {
        errors.push(`Tipe file tidak didukung. Gunakan: ${allowedTypes.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult {
    const errors: string[] = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      
      // Required validation
      if (rule.required) {
        const requiredResult = this.validateRequired(value, field);
        errors.push(...requiredResult.errors);
      }
      
      // Skip other validations if value is empty and not required
      if (!value && !rule.required) continue;
      
      // Length validation
      if (typeof value === 'string') {
        if (rule.minLength || rule.maxLength) {
          const lengthResult = this.validateLength(
            value, 
            rule.minLength || 0, 
            rule.maxLength || Infinity, 
            field
          );
          errors.push(...lengthResult.errors);
        }
        
        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} tidak sesuai format yang ditentukan`);
        }
      }
      
      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (typeof customResult === 'string') {
          errors.push(customResult);
        } else if (!customResult) {
          errors.push(`${field} tidak valid`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Predefined validation rules
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      const hasLower = /(?=.*[a-z])/.test(value);
      const hasUpper = /(?=.*[A-Z])/.test(value);
      const hasNumber = /(?=.*\d)/.test(value);
      return hasLower && hasUpper && hasNumber;
    }
  },
  phone: {
    required: true,
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  companyName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  jobTitle: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 2000
  }
};

// Training program validation
export const validateTrainingProgram = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Required fields validation
  if (!data.title?.trim()) {
    errors.title = 'Judul program harus diisi';
  } else if (data.title.length < 3) {
    errors.title = 'Judul program minimal 3 karakter';
  } else if (data.title.length > 100) {
    errors.title = 'Judul program maksimal 100 karakter';
  }
  
  if (!data.category?.trim()) {
    errors.category = 'Kategori harus dipilih';
  }
  
  if (!data.description?.trim()) {
    errors.description = 'Deskripsi program harus diisi';
  } else if (data.description.length < 10) {
    errors.description = 'Deskripsi program minimal 10 karakter';
  } else if (data.description.length > 2000) {
    errors.description = 'Deskripsi program maksimal 2000 karakter';
  }
  
  if (!data.duration?.trim()) {
    errors.duration = 'Durasi harus diisi';
  }
  
  if (!data.location?.trim()) {
    errors.location = 'Lokasi harus diisi';
  }
  
  if (data.cost < 0) {
    errors.cost = 'Biaya tidak boleh negatif';
  }
  
  if (!data.instructorInfo?.trim()) {
    errors.instructorInfo = 'Informasi instruktur harus diisi';
  }
  
  if (!data.syllabus || data.syllabus.length === 0) {
    errors.syllabus = 'Silabus harus diisi';
  }
  
  if (!data.learningObjectives || data.learningObjectives.length === 0) {
    errors.learningObjectives = 'Tujuan pembelajaran harus diisi';
  }
  
  if (!data.targetAudience?.trim()) {
    errors.targetAudience = 'Target peserta harus diisi';
  }
  
  return errors;
}; 