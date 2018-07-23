const TOKEN_KEY = 'zark-billing-token';

export function storeAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getAuthToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export default {
  storeAuthToken,
  getAuthToken,
  isLoggedIn,
  logout
}
