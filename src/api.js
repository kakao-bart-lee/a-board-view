import { useCallback } from 'react';
import { useAuth } from './AuthContext';

export const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export function useApi() {
  const { token } = useAuth();
  return useCallback(
    async (path, options = {}) => {
      const headers = { ...(options.headers || {}) };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      return fetch(`${API}${path}`, { ...options, headers });
    },
    [token]
  );
}
