const KEY = 'depensys_categories';

export const DEFAULT_CATEGORIES = [
  { id: 'transport', nameKey: 'categories.transport' },
  { id: 'accommodation', nameKey: 'categories.accommodation' },
  { id: 'food', nameKey: 'categories.food' },
  { id: 'supplies', nameKey: 'categories.supplies' },
  { id: 'other', nameKey: 'categories.other' },
];

export function getCategories() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CATEGORIES.map((c) => ({ id: c.id, name: c.nameKey, isDefault: true }));
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CATEGORIES.map((c) => ({ id: c.id, name: c.nameKey, isDefault: true }));
  }
}

export function saveCategories(categories) {
  localStorage.setItem(KEY, JSON.stringify(categories));
}

export function generateId() {
  return `cat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
