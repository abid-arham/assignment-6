import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { rateLimitGlobal } from "./middlewares/rateLimit";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(rateLimitGlobal);

app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, message: "OK", data: { uptime: process.uptime() } });
});

app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
