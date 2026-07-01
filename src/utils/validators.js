export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isNotEmpty(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}

export function isValidPassword(password) {
  return password && password.length >= 6;
}

export function isValidAmount(amount) {
  return !isNaN(amount) && parseFloat(amount) > 0;
}
