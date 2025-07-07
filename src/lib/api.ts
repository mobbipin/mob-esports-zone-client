// API utility for MOB Esports

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
  isJson = true
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getHeaders(isJson),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok || data.status === false) {
    let message = data.message || 'API Error';
    if (data.error && data.error.issues && Array.isArray(data.error.issues) && data.error.issues.length > 0) {
      message = data.error.issues[0].message || message;
    } else if (typeof data.error === 'string') {
      message = data.error;
    }
    throw { ...data.error, message };
  }
  return data;
}

// Helper for file uploads (multipart/form-data)
export async function apiUpload<T>(path: string, formData: FormData) {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || data.status === false) {
    let message = data.message || 'API Error';
    if (data.error && data.error.issues && Array.isArray(data.error.issues) && data.error.issues.length > 0) {
      message = data.error.issues[0].message || message;
    } else if (typeof data.error === 'string') {
      message = data.error;
    }
    throw { ...data.error, message };
  }
  return data;
} 