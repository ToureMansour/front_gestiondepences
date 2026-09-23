import apiClient, { postMultipart } from '../../../services/apiClient';
import { ENDPOINTS } from '../../../constants/api';

const settingsService = {
  get: () => apiClient.get(ENDPOINTS.SETTINGS.BASE),
  update: ({ organization_name, logo }) => {
    if (logo && typeof logo !== 'string') {
      const formData = new FormData();
      formData.append('organization_name', organization_name || '');
      formData.append('logo', logo);
      return postMultipart(ENDPOINTS.SETTINGS.BASE, formData);
    }
    return apiClient.put(ENDPOINTS.SETTINGS.BASE, { organization_name });
  },
};

export default settingsService;