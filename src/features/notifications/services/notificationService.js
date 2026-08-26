import apiClient from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const notificationService = {
  getAll: () => apiClient.get(ENDPOINTS.NOTIFICATIONS.BASE),
  markRead: (id) => apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
  markAllRead: () => apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
};

export default notificationService;
