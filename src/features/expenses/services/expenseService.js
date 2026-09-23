import apiClient, { postMultipart } from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const expenseService = {
  getAll: (params) => apiClient.get(ENDPOINTS.EXPENSES.BASE, { params }),
  getByReference: (ref) => apiClient.get(ENDPOINTS.EXPENSES.BY_REFERENCE(ref)),
  create: (data) =>
    data instanceof FormData
      ? postMultipart(ENDPOINTS.EXPENSES.BASE, data)
      : apiClient.post(ENDPOINTS.EXPENSES.BASE, data),
  update: (ref, data) => apiClient.put(ENDPOINTS.EXPENSES.BY_REFERENCE(ref), data),
  remove: (ref) => apiClient.delete(ENDPOINTS.EXPENSES.BY_REFERENCE(ref)),
  approve: (ref) => apiClient.post(ENDPOINTS.EXPENSES.APPROVE(ref)),
  reject: (ref, reason) => apiClient.post(ENDPOINTS.EXPENSES.REJECT(ref), { reason }),
  pay: (ref, { payment_method, payment_proof }) => {
    const formData = new FormData();
    formData.append('payment_method', payment_method || 'cash');
    if (payment_proof) formData.append('payment_proof', payment_proof);
    return postMultipart(ENDPOINTS.EXPENSES.PAY(ref), formData);
  },
};

export default expenseService;