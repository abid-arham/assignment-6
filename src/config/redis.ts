import { Redis } from "@upstash/redis";
import config from "./index.js";

export const redis =
  config.upstash_redis_rest_url && config.upstash_redis_rest_token
    ? new Redis({ url: config.upstash_redis_rest_url, token: config.upstash_redis_rest_token })
    : null;
