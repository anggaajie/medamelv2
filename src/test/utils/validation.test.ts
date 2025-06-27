import { describe, it, expect } from 'vitest';
import { Validator } from '@/utils/validation';

describe('Validator', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      validEmails.forEach(email => {
        const result = Validator.validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const result = Validator.validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const validPasswords = [
        'Password123',
        'MySecurePass1',
        'Complex@Password123'
      ];

      validPasswords.forEach(password => {
        const result = Validator.validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject weak passwords', () => {
      const invalidPasswords = [
        'short',
        'nouppercase123',
        'NOLOWERCASE123',
        'NoNumbers',
        ''
      ];

      invalidPasswords.forEach(password => {
        const result = Validator.validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty strings', () => {
      const validValues = ['test', 'hello world', '123'];
      
      validValues.forEach(value => {
        const result = Validator.validateRequired(value, 'Test field');
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject empty values', () => {
      const invalidValues = ['', '   ', null, undefined];
      
      invalidValues.forEach(value => {
        const result = Validator.validateRequired(value, 'Test field');
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateLength', () => {
    it('should validate strings with sufficient length', () => {
      const result = Validator.validateLength('hello world', 5, 20, 'Test field');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject strings that are too short', () => {
      const result = Validator.validateLength('hi', 5, 20, 'Test field');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject strings that are too long', () => {
      const result = Validator.validateLength('this is a very long string', 5, 10, 'Test field');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
}); 