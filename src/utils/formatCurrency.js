import i18n from '../i18n';

function getLocale() {
  return i18n.language === 'en' ? 'en-US' : 'fr-FR';
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat(getLocale(), {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}
