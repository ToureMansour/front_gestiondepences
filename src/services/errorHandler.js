import i18n from '../i18n';

export class AppError extends Error {
  constructor(message, status, code = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export function handleApiError(error) {
  const t = (key) => {
    const keys = key.split('.');
    let val = i18n.getResourceBundle(i18n.language, 'translation');
    for (const k of keys) {
      if (val) val = val[k];
    }
    return val || key;
  };

  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || getDefaultMessage(status, t);
    const code = data?.code || null;
    return new AppError(message, status, code);
  }
  if (error.request) {
    return new AppError(t('common.serverConnectionError'), 0);
  }
  return new AppError(t('common.unexpectedError'), 0);
}

function getDefaultMessage(status, t) {
  const messages = {
    400: t('common.invalidRequest'),
    401: t('common.sessionExpired'),
    403: t('common.accessDenied'),
    404: t('common.resourceNotFound'),
    422: t('common.invalidData'),
    429: t('common.tooManyRequests'),
    500: t('common.serverError'),
  };
  return messages[status] || t('common.errorOccurred');
}
