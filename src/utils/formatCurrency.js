import i18n from '../i18n';

function getLocale() {
  return i18n.language === 'en' ? 'en-US' : 'fr-FR';
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0,00 €';
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
