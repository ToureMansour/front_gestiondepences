import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const expenseService = {
  getAll: (params) => apiClient.get(ENDPOINTS.EXPENSES.BASE, { params }),
  getByReference: (ref) => apiClient.get(ENDPOINTS.EXPENSES.BY_REFERENCE(ref)),
  create: (data) => apiClient.post(ENDPOINTS.EXPENSES.BASE, data),
  update: (ref, data) => apiClient.put(ENDPOINTS.EXPENSES.BY_REFERENCE(ref), data),
  remove: (ref) => apiClient.delete(ENDPOINTS.EXPENSES.BY_REFERENCE(ref)),

  getAdminAll: (params) => apiClient.get(ENDPOINTS.EXPENSES.ADMIN_ALL, { params }),
  getAdminByReference: (ref) => apiClient.get(ENDPOINTS.EXPENSES.ADMIN_BY_REFERENCE(ref)),
  approve: (ref) => apiClient.post(ENDPOINTS.EXPENSES.ADMIN_APPROVE(ref)),
  reject: (ref) => apiClient.post(ENDPOINTS.EXPENSES.ADMIN_REJECT(ref)),
};

export default expenseService;
