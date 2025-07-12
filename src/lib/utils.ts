import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Form validation utilities
export const showFormError = (message: string) => {
  toast.error(message);
};

export const showFormSuccess = (message: string) => {
  toast.success(message);
};

export const validateRequired = (value: any, fieldName: string): boolean => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    showFormError(`${fieldName} is required`);
    return false;
  }
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormError('Please enter a valid email address');
    return false;
  }
  return true;
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 6) {
    showFormError('Password must be at least 6 characters long');
    return false;
  }
  return true;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  if (password !== confirmPassword) {
    showFormError('Passwords do not match');
    return false;
  }
  return true;
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    showFormError(`File size must be less than ${maxSizeMB}MB`);
    return false;
  }
  return true;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  if (!allowedTypes.includes(file.type)) {
    showFormError(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    return false;
  }
  return true;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): boolean => {
  if (value.length < minLength) {
    showFormError(`${fieldName} must be at least ${minLength} characters long`);
    return false;
  }
  return true;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): boolean => {
  if (value.length > maxLength) {
    showFormError(`${fieldName} must be no more than ${maxLength} characters long`);
    return false;
  }
  return true;
};

export const validateNumber = (value: string, fieldName: string): boolean => {
  if (isNaN(Number(value)) || Number(value) <= 0) {
    showFormError(`${fieldName} must be a valid positive number`);
    return false;
  }
  return true;
};

export const validateDate = (date: Date | null, fieldName: string): boolean => {
  if (!date) {
    showFormError(`${fieldName} is required`);
    return false;
  }
  if (date < new Date()) {
    showFormError(`${fieldName} cannot be in the past`);
    return false;
  }
  return true;
};

export const validateDateRange = (startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) {
    showFormError('Both start and end dates are required');
    return false;
  }
  if (startDate >= endDate) {
    showFormError('End date must be after start date');
    return false;
  }
  return true;
};

// Helper function to validate form data object
export const validateFormData = (formData: Record<string, any>, validations: Record<string, () => boolean>): boolean => {
  for (const [field, validationFn] of Object.entries(validations)) {
    if (!validationFn()) {
      return false;
    }
  }
  return true;
};

// Helper function to show API success messages
export const showApiSuccess = (message: string) => {
  toast.success(message);
};

// Helper function to show API error messages
export const showApiError = (error: any) => {
  let message = 'An error occurred';
  
  if (typeof error === 'string') {
    message = error;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.issues && Array.isArray(error.issues) && error.issues.length > 0) {
    message = error.issues[0].message;
  }
  
  toast.error(message);
};
