import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const authService = {
  login: (data) => apiClient.post(ENDPOINTS.AUTH.LOGIN, data),
  register: (data) => apiClient.post(ENDPOINTS.AUTH.REGISTER, data),
  logout: () => apiClient.post(ENDPOINTS.AUTH.LOGOUT),
  getProfile: () => apiClient.get(ENDPOINTS.AUTH.PROFILE),
  updateProfile: (data) => apiClient.put(ENDPOINTS.AUTH.UPDATE_PROFILE, data),
  changePassword: (data) => apiClient.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
  forgotPassword: (data) => apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data),
  resetPassword: (data) => apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, data),
};

export default authService;
