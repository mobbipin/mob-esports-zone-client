// API utility for MOB Esports
import toast from "react-hot-toast";

const BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://127.0.0.1:8787';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(isJson = true) {
  const headers: Record<string, string> = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  isJson = true,
  showErrorToast = true,
  showSuccessToast = false
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...getHeaders(isJson),
        ...(options.headers || {}),
      },
    });
    const data = await res.json();
    
    console.log('API Response status:', res.status);
    console.log('API Response data:', data);
    
    // Only show success toast if explicitly requested
    if (data.message && showSuccessToast && res.ok && data.status !== false) {
      toast.success(data.message);
    } else if (!res.ok || data.status === false) {
      let message = 'API Error';
      if (data.error && data.error.issues && Array.isArray(data.error.issues) && data.error.issues.length > 0) {
        message = data.error.issues[0].message || message;
      } else if (typeof data.error === 'string') {
        message = data.error;
      }
      
      // Don't show error toast for accountDeleted errors
      if (data.accountDeleted) {
        throw { ...data, message };
      }
      
      if (showErrorToast) {
        toast.error(message);
      }
      // Preserve all properties from the error response, including accountDeleted
      throw { ...data, message };
    }
    return data;
  } catch (error: any) {
    if (showErrorToast && error.message) {
      toast.error(error.message);
    }
    throw error;
  }
}

// Helper for file uploads (multipart/form-data)
export async function apiUpload<T>(path: string, formData: FormData, showErrorToast = true, showSuccessToast = false) {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json();
    
    // Only show success toast if explicitly requested
    if (data.message && showSuccessToast && res.ok && data.status !== false) {
      toast.success(data.message);
    } else if (!res.ok || data.status === false) {
      let message = 'API Error';
      if (data.error && data.error.issues && Array.isArray(data.error.issues) && data.error.issues.length > 0) {
        message = data.error.issues[0].message || message;
      } else if (typeof data.error === 'string') {
        message = data.error;
      }
      if (showErrorToast) {
        toast.error(message);
      }
      // Preserve all properties from the error response, including accountDeleted
      throw { ...data, message };
    }
    return data;
  } catch (error: any) {
    if (showErrorToast && error.message) {
      toast.error(error.message);
    }
    throw error;
  }
} 