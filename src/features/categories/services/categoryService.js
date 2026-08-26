import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const categoryService = {
  getAll: () => apiClient.get(ENDPOINTS.CATEGORIES.BASE),
  getById: (id) => apiClient.get(ENDPOINTS.CATEGORIES.BY_ID(id)),
  create: (data) => apiClient.post(ENDPOINTS.CATEGORIES.BASE, data),
  update: (id, data) => apiClient.put(ENDPOINTS.CATEGORIES.BY_ID(id), data),
  remove: (id) => apiClient.delete(ENDPOINTS.CATEGORIES.BY_ID(id)),
};

export default categoryService;
