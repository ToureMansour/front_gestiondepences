export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile',
  },
  USERS: {
    BASE: '/users',
    BY_REFERENCE: (ref) => `/users/${ref}`,
    EXPENSES: (ref) => `/users/${ref}/expenses`,
  },
  EXPENSES: {
    BASE: '/expenses',
    BY_REFERENCE: (ref) => `/expenses/${ref}`,
    APPROVE: (ref) => `/expenses/${ref}/approve`,
    REJECT: (ref) => `/expenses/${ref}/reject`,
    PAY: (ref) => `/expenses/${ref}/pay`,
  },
  STATS: '/stats',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};
