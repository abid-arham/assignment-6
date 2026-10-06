# University Management System — Backend API

A REST API for running a university's academic and fee workflow:

- **Catalog:** departments, courses with prerequisite chains, semesters and sections.
- **Enrollment:** transaction-safe, with capacity and prerequisite checks.
- **Grading:** instructors grade their own sections; students get a GPA transcript.
- **Fees:** tuition invoices paid through Stripe Checkout.
- **Admin:** user management, stats and an audit log.

| | |
|---|---|
| Live API | https://assignment-6-tau-wine.vercel.app/api/v1 (health: `/api/v1/health`) |
| API docs (Postman) | _add the published documenter link here_. The collection is in [`docs/UMS.postman_collection.json`](docs/UMS.postman_collection.json) |
| Demo video | _add the link here_ |
| Demo admin | `admin@ums.demo`; password provided with the submission |

## Roles

| Role | What they can do |
|---|---|
| **Student** | Register or log in (email/password or Google), enroll in and drop sections, view enrollments, generate and pay invoices, view payment status and their transcript |
| **Instructor** | View the sections they teach and the students in them, submit grades for their own sections |
| **Admin** | Manage departments, courses (and prerequisites), semesters and sections; list, search, promote and deactivate users; view dashboard stats and audit logs |

Accounts register as students. An admin promotes a user to instructor with `PATCH /admin/users/:id/role`.

## Tech stack

Node.js, TypeScript, Express 5 · PostgreSQL + Prisma · Zod · JWT (access 15 min / refresh 7 days, rotated and stored hashed) · Google OAuth (`google-auth-library`) · Stripe Checkout and webhooks · Upstash Redis (caching and rate limiting) · Multer + Cloudinary (avatars) · Helmet, CORS · Biome · deployed on Vercel.

## Architecture

```
src/
  app.ts              middleware order, route mounting, 404 + error handler
  config/             env (validated with Zod at boot), Prisma, Redis, Stripe, Cloudinary clients
  middlewares/        authenticate, authorize(roles), validate(zod), rate limit, upload, errors
  modules/<name>/     <name>.routes → .controller → .service → Prisma, with <name>.validation
  utils/              AppError, sendResponse, asyncHandler, jwt, hash, cache, audit, serialize
prisma/               schema, migrations, seed
```

Every request flows **Routes → Controllers → Services → Prisma**. Controllers only translate HTTP. Business rules live in services.

### Engineering decisions worth knowing
- **Race-free enrollment.** One interactive transaction checks:
  - the semester's enrollment is open;
  - the student isn't already enrolled;
  - every prerequisite course was completed with a passing grade.

  Then a single conditional `UPDATE "Section" SET "enrolledCount" = "enrolledCount" + 1 WHERE "enrolledCount" < capacity` claims the seat. Two students racing for the last seat can't both win. A dropped enrollment is reactivated rather than duplicated.
- **Prerequisite graph.** Adding a prerequisite walks the existing chain and rejects self-references and cycles (409).
- **GPA.** Credit-weighted. On a retake the best attempt counts, and every attempt stays on the transcript.
- **Payments.** Stripe Checkout creates a PENDING payment.
  - Both the signed webhook (`checkout.session.completed`) and the success redirect, which re-fetches the session from Stripe, mark it paid through one path.
  - That path is a conditional update, so retries and the redirect/webhook race are idempotent.
  - A cancel expires the Stripe session, then trusts Stripe's state.
  - `checkout.session.expired` marks abandoned payments CANCELLED.
- **Caching.** The course list (keyed by query string, 60 s, invalidated on writes) and admin stats (60 s) use Redis cache-aside.
- **Rate limiting.** Upstash sliding window, 60 requests/min per client.
- **Data hygiene.**
  - Soft deletes via `deletedAt` for departments and courses.
  - Audit log rows for enrollments, drops, grades, role and status changes and payments, written in the same transaction as the change.
  - Password hashes never leave the API.

## API overview

All routes are under `/api/v1`. The Postman collection has request bodies, captured IDs and error examples.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh-token` · `POST /auth/logout` · `GET /auth/google` → `GET /auth/google/callback` |
| Users | `GET /users/me` · `PATCH /users/me` · `PATCH /users/me/avatar` (multipart, 2 MB image) |
| Departments | `GET /departments` · `POST` · `PATCH /:id` · `DELETE /:id` (admin, soft delete) |
| Courses | `GET /courses?page&limit&q&departmentId&sortBy` · `GET /:id` · `POST` · `PATCH /:id` · `DELETE /:id` · `POST /:id/prerequisites` · `DELETE /:id/prerequisites/:prereqId` (admin writes) |
| Semesters | `GET /semesters` · `POST` · `PATCH /:id` (admin) |
| Sections | `GET /sections?semesterId&courseId&instructorId` · `GET /:id` · `GET /my` (instructor) · `GET /:id/students` (own sections) · `POST` · `PATCH /:id` (admin) |
| Enrollments | `POST /enrollments` · `POST /:id/drop` · `GET /my` (student) · `PATCH /:id/grade` (instructor of that section) |
| Transcript | `GET /students/me/transcript` |
| Invoices | `POST /invoices/generate` · `GET /invoices/my` |
| Payments | `POST /payments/initiate` · `GET /payments/:id` · `GET /payments/success` · `GET /payments/cancel` (Stripe redirects) · `POST /payments/webhook` (Stripe-signed) |
| Admin | `GET /admin/users?page&limit&role&q` · `PATCH /admin/users/:id/role` · `PATCH /admin/users/:id/status` · `GET /admin/stats` · `GET /admin/audit-logs?entity&action` |

**Response format:** `{ "success": true, "message": "...", "data": ... }` for success. List endpoints return `data: { items, meta: { page, limit, total } }`. Errors are `{ "success": false, "message": "...", "errors": [...] }` with these codes:

| Code | Meaning |
|---|---|
| 400 | Malformed JSON |
| 401 | Not authenticated |
| 403 | Wrong role, or not your resource |
| 404 | Not found |
| 409 | Conflict |
| 422 | Validation or business rule |
| 429 | Rate limited |

## Running locally

Requires Node.js 20+ and PostgreSQL.

```bash
npm install                    # also runs prisma generate
# create .env with the variables in the table below
npx prisma migrate deploy      # apply migrations
npm run seed                   # demo admin, instructors, students, courses, sections
npm run dev                    # http://localhost:3000/api/v1/health
```

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string (use the pooled URL in production) |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | yes | ≥ 16 characters each |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | for Google login | Redirect URI is `<base>/api/v1/auth/google/callback`, registered in GCP Console |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | for payments | Webhook events: `checkout.session.completed`, `checkout.session.expired` |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | optional | Caching and rate limiting are skipped when unset |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | for avatars | |
| `CORS_ORIGIN` | optional | Allowed origin (default `*`) |
| `PORT`, `NODE_ENV` | optional | Defaults `3000`, `development` |

The server refuses to start if a required variable is missing.

To test webhooks locally, run `stripe listen --forward-to localhost:3000/api/v1/payments/webhook` and use the printed `whsec_...` as `STRIPE_WEBHOOK_SECRET`. Pay with test card `4242 4242 4242 4242`.

| Script | |
|---|---|
| `npm run dev` | watch mode with tsx |
| `npm run build` / `npm start` | compile with tsc, run `dist/` |
| `npm run seed` | idempotent demo data |
| `npm run lint` | Biome |
