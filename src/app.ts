import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/index.js";
import { rateLimitGlobal } from "./middlewares/rateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import { departmentRouter } from "./modules/departments/department.routes.js";
import { courseRouter } from "./modules/courses/course.routes.js";
import { semesterRouter } from "./modules/semesters/semester.routes.js";
import { sectionRouter } from "./modules/sections/section.routes.js";
import { enrollmentRouter } from "./modules/enrollments/enrollment.routes.js";
import { studentRouter } from "./modules/students/student.routes.js";
import { invoiceRouter } from "./modules/invoices/invoice.routes.js";
import { paymentRouter } from "./modules/payments/payment.routes.js";
import { handleStripeWebhook } from "./modules/payments/payment.webhook.js";

const app = express();

// ponytail: Vercel's Express builder type-checks ESM files against helmet's CJS typings (it drops
// the import mode), where helmet() looks uncallable. Runtime is fine; remove once Vercel fixes it.
// @ts-ignore
app.use(helmet());
app.use(cors({ origin: config.cors_origin, credentials: true }));

// Must be mounted BEFORE express.json() — Stripe's signature check needs the
// raw, unparsed body on this exact path only.
app.post("/api/v1/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(express.json());
app.use(rateLimitGlobal);


app.get("/", async(req:Request, res:Response)=>{
    
    res.send("Hello World")
})

app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, message: "OK", data: { uptime: process.uptime() } });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/semesters", semesterRouter);
app.use("/api/v1/sections", sectionRouter);
app.use("/api/v1/enrollments", enrollmentRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/payments", paymentRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
