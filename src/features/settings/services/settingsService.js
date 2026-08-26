import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const settingsService = {
  get: () => apiClient.get(ENDPOINTS.SETTINGS.BASE),
  update: (data) => apiClient.put(ENDPOINTS.SETTINGS.BASE, data),
};

export default settingsService;
