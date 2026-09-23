import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const userService = {
  getAll: (params) => apiClient.get(ENDPOINTS.USERS.BASE, { params }),
  getByReference: (ref) => apiClient.get(ENDPOINTS.USERS.BY_REFERENCE(ref)),
  getUserExpenses: (ref, params) => apiClient.get(ENDPOINTS.USERS.EXPENSES(ref), { params }),
  create: (data) => apiClient.post(ENDPOINTS.USERS.BASE, data),
  update: (ref, data) => apiClient.put(ENDPOINTS.USERS.BY_REFERENCE(ref), data),
  remove: (ref) => apiClient.delete(ENDPOINTS.USERS.BY_REFERENCE(ref)),
};

export default userService;
