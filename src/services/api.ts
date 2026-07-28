import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

// We will export a variable holding the in-memory access token
let accessToken: string | null = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true, // critical for receiving/sending httpOnly cookies
});

// Request Interceptor: Attach the current access token from memory
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto refresh on 401, error toasts, and retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401 Unauthorized and we haven't already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call the refresh endpoint (which returns { accessToken })
        // Note: use standard axios instead of 'api' to avoid repeating authorization headers or triggers
        const refreshUrl = `${import.meta.env.VITE_API_URL || ''}/api/v1/auth/refresh`;
        const response = await axios.post(refreshUrl, {}, { withCredentials: true });
        
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or is expired: clear local token and redirect to Login
        setAccessToken(null);
        toast.error('Session expired. Please log in again.');
        // Redirect to admin or standard login based on URL, or generic reload
        window.location.href = window.location.pathname.startsWith('/admin') ? '/admin' : '/';
        return Promise.reject(refreshError);
      }
    }

    // Do NOT redirect on 403 Forbidden, but do display toast if response has a message
    if (error.response?.status === 403) {
      const data = error.response.data as any;
      toast.error(data?.message || 'Access Denied (403)');
      return Promise.reject(error);
    }

    // Display user-friendly toasts for other errors (except 401 which is handled or failed refresh)
    if (error.response && error.response.status !== 401) {
      const data = error.response.data as any;
      toast.error(data?.message || 'An error occurred. Please try again.');
    } else if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
