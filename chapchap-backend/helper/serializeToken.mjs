import { serialize } from "cookie";

export function serializeToken(key, value, options) {
  return serialize(key, value, options);
}
