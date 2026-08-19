import i18n from '../i18n';

export function normalizeStatus(status) {
  return String(status || '').toLowerCase();
}

export function getStatusLabel(status, t) {
  const key = `expenses.status${String(status || '')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())}`;
  return t(key);
}

export function aggregateByMonth(expenses) {
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const map = new Map();
  for (const e of expenses) {
    const d = e.expense_date || e.created_at;
    if (!d) continue;
    const date = new Date(d);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    map.set(monthKey, (map.get(monthKey) || 0) + parseFloat(e.amount || 0));
  }
  const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const labels = sorted.map(([key]) => {
    const [y, m] = key.split('-');
    const label = new Date(y, Number(m) - 1, 1).toLocaleDateString(locale, { month: 'short' });
    return `${label} ${y}`;
  });
  const series = sorted.map(([, v]) => Math.round(v * 100) / 100);
  return { labels, series };
}

export function aggregateByStatus(expenses) {
  const map = new Map();
  for (const e of expenses) {
    const status = normalizeStatus(e.status) || 'pending';
    map.set(status, (map.get(status) || 0) + parseFloat(e.amount || 0));
  }
  return [...map.entries()].map(([status, value]) => ({ status, value: Math.round(value * 100) / 100 }));
}

export function aggregateCountByStatus(expenses) {
  const map = new Map();
  for (const e of expenses) {
    const status = normalizeStatus(e.status) || 'pending';
    map.set(status, (map.get(status) || 0) + 1);
  }
  return [...map.entries()].map(([status, count]) => ({ status, count }));
}

export function aggregateByUser(expenses) {
  const map = new Map();
  for (const e of expenses) {
    const name = e.user?.name || e.user_name || '—';
    map.set(name, (map.get(name) || 0) + parseFloat(e.amount || 0));
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
}

export function totalAmountOf(expenses) {
  return expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'fr-FR', {
    maximumFractionDigits: 2,
  }).format(value || 0);
}
