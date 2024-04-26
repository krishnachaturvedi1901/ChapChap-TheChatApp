import RedisStore from "connect-redis";
import { createClient } from "redis";
import { config } from "../config/config.mjs";
import connectRedis from "connect-redis";

// Initialize client.
// If i dont add the object in createClient it will by default connect to local redis
const redisClient = createClient({
  password: config.redis_password,
  socket: {
    host: config.redis_db_uri,
    port: 18137,
  },
});

redisClient
  .connect()
  .catch((error) => console.error("Error in redis connect", error));

// Initialize store.
export const redisStore = new RedisStore({
  client: redisClient,
  prefix: "chapchap:",
  ttl: config.session_minAge,
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("ready", () => console.log("Redis ready to use..."));
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("end", () => console.log("Redis disconnected"));
process.on("SIGINT", () => client.quit());
