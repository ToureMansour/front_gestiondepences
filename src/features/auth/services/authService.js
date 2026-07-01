import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const authService = {
  login: (data) => apiClient.post(ENDPOINTS.AUTH.LOGIN, data),
  register: (data) => apiClient.post(ENDPOINTS.AUTH.REGISTER, data),
  logout: () => apiClient.post(ENDPOINTS.AUTH.LOGOUT),
  getProfile: () => apiClient.get(ENDPOINTS.AUTH.PROFILE),
  updateProfile: (data) => apiClient.post(ENDPOINTS.AUTH.UPDATE_PROFILE, data),
};

export default authService;
