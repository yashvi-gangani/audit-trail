import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — try refresh, retry once
let isRefreshing = false;
let waitingQueue = [];

// 401s from these endpoints are normal, expected outcomes (wrong password,
// already-invalid refresh token, logging out with no session, etc.) — the
// calling code (authStore) already handles them. Treating them the same
// as an expired-session 401 elsewhere caused a real bug: a 401 on
// /auth/logout triggered another logout(), which called /auth/logout
// again, which 401'd again — an infinite loop that also fired on any
// failed login attempt.
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/logout', '/auth/refresh'];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const isAuthCall = AUTH_PATHS.some((p) => originalRequest?.url?.includes(p));

    if (err.response?.status === 401 && !originalRequest._retry && !isAuthCall) {
      const { code } = err.response.data || {};

      if (code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            waitingQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await useAuthStore.getState().refreshSession();
          const newToken = useAuthStore.getState().token;
          waitingQueue.forEach(({ resolve }) => resolve(newToken));
          waitingQueue = [];
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (_) {
          waitingQueue.forEach(({ reject }) => reject(_));
          waitingQueue = [];
          useAuthStore.getState().logout();
        } finally {
          isRefreshing = false;
        }
      } else {
        // Invalid token or other 401 — logout
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(err);
  }
);

export default api;