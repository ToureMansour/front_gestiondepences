import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const settingsService = {
  get: () => apiClient.get(ENDPOINTS.SETTINGS.BASE),
  updateOrg: (data) => apiClient.put(ENDPOINTS.SETTINGS.ORG, data),
  updateNotifications: (data) => apiClient.put(ENDPOINTS.SETTINGS.NOTIFICATIONS, data),
};

export default settingsService;
