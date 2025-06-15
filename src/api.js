import { useAuth } from './AuthContext';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export function useApi() {
  const { token } = useAuth();
  return async (path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(`${BASE}${path}`, { ...options, headers });
  };
}
