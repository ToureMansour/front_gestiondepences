import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const expenseService = {
  getAll: (params) => apiClient.get(ENDPOINTS.EXPENSES.BASE, { params }),
  getByReference: (ref) => apiClient.get(ENDPOINTS.EXPENSES.BY_REFERENCE(ref)),
  create: (data) => apiClient.post(ENDPOINTS.EXPENSES.BASE, data),
  update: (ref, data) => apiClient.put(ENDPOINTS.EXPENSES.BY_REFERENCE(ref), data),
  remove: (ref) => apiClient.delete(ENDPOINTS.EXPENSES.BY_REFERENCE(ref)),
  approve: (ref) => apiClient.post(ENDPOINTS.EXPENSES.APPROVE(ref)),
  reject: (ref, reason) => apiClient.post(ENDPOINTS.EXPENSES.REJECT(ref), { reason }),
  pay: (ref, data) => apiClient.post(ENDPOINTS.EXPENSES.PAY(ref), data),
};

export default expenseService;
