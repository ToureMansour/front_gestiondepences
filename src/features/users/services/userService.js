import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const userService = {
  getAll: (params) => apiClient.get(ENDPOINTS.USERS.BASE, { params }),
  getByReference: (ref) => apiClient.get(ENDPOINTS.USERS.BY_REFERENCE(ref)),
  getUserExpenses: (ref, params) => apiClient.get(ENDPOINTS.USERS.EXPENSES(ref), { params }),
};

export default userService;
