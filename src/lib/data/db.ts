import { Redis } from "@upstash/redis";
import { getRedisApiSecrets } from "./redis";

export const db = new Redis({
  url: getRedisApiSecrets().url,
  token: getRedisApiSecrets().token,
});

