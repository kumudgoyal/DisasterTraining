import axios from 'axios';
import { handleMockRequest } from './mockService';

const isVercel =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('github.io'));

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// If deployed on Vercel or static hosting, use direct in-browser mock router
if (isVercel) {
  api.defaults.adapter = async (config) => {
    try {
      const result = await handleMockRequest(config);
      return {
        data: result,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        request: {},
      };
    } catch (err) {
      return Promise.reject({
        response: {
          data: { success: false, error: err.message || 'Mock processing error' },
          status: 500,
          statusText: 'Internal Error',
          headers: {},
          config,
        },
      });
    }
  };
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dmecs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const config = error.config;
    const isNetworkOr405 =
      !error.response ||
      error.response.status === 405 ||
      error.response.status === 404;

    // Automatic fallback to mock service if real backend is not reachable or 405
    if (isNetworkOr405 && config && !config._retryMock) {
      config._retryMock = true;
      try {
        const mockResult = await handleMockRequest(config);
        return mockResult;
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    if (error.response?.status === 401) {
      if (!error.config?.url?.includes('/auth/me')) {
        localStorage.removeItem('dmecs_token');
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
