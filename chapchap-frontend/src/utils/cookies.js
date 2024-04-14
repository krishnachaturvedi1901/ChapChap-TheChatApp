import Cookies from "universal-cookie";

const cookies = new Cookies();
export function createCookie(key, value, options) {
  cookies.set(key, value, options);
}

export function getCookies(key) {
  return cookies.get(key);
}
