export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile',
    CHANGE_PASSWORD: '/change-password',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
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
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  SETTINGS: {
    BASE: '/settings',
    ORG: '/settings/organization',
    NOTIFICATIONS: '/settings/notifications',
  },
  STATS: '/stats',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};
