export function addToSessionStorage(key, token) {
  sessionStorage.setItem(key, token);
}
export function getFromSessionStorage(key) {
  return sessionStorage.getItem(key);
}
