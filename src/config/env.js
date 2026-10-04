import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 chars"),
    JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 chars"),
    DIRECT_URL: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_REDIRECT_URI: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    CORS_ORIGIN: z.string().default("*"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
export const env = parsed.data;
if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("Upstash Redis not configured — caching and rate limiting are disabled.");
}
if (!env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY not set — payment routes will fail until configured.");
}
if (!env.GOOGLE_CLIENT_ID) {
    console.warn("Google OAuth not configured — /auth/google routes will fail until configured.");
}
//# sourceMappingURL=env.js.map