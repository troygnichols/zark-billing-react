const TOKEN_KEY = 'zark-billing-token';
const PROFILE_KEY = 'zark-billing-profile';

export function storeAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function storeUserProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch (error) {
    console.error('Error reading local user data', error);
    return {};
  }
}

export function isLoggedIn() {
  return !!getAuthToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export default {
  storeAuthToken,
  storeUserProfile,
  getAuthToken,
  getUserProfile,
  isLoggedIn,
  logout
}
