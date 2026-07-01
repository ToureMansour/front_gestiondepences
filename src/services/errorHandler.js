export class AppError extends Error {
  constructor(message, status, code = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export function handleApiError(error) {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || getDefaultMessage(status);
    const code = data?.code || null;
    return new AppError(message, status, code);
  }
  if (error.request) {
    return new AppError('Impossible de contacter le serveur. Vérifiez votre connexion.', 0);
  }
  return new AppError('Une erreur inattendue est survenue.', 0);
}

function getDefaultMessage(status) {
  const messages = {
    400: 'Requête invalide.',
    401: 'Session expirée. Veuillez vous reconnecter.',
    403: 'Accès refusé.',
    404: 'Ressource introuvable.',
    422: 'Données invalides. Vérifiez les champs.',
    429: 'Trop de requêtes. Veuillez réessayer plus tard.',
    500: 'Erreur serveur. Veuillez réessayer.',
  };
  return messages[status] || 'Une erreur est survenue.';
}
