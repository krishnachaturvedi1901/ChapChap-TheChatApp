import { jwtDecode } from "jwt-decode";
export const jwtDataDecoder = (token) => {
  const decoded = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return { isTokenValid: decoded.exp > currentTime };
  // Time is considered from UNIX epoc "1 Jan 1970" in seconds
};
