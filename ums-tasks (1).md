# UMS Backend — Task → Command Reference

Run top to bottom. Commands that "write code" just scaffold the file with
`touch`/`cat` — you still have to fill in the logic in your editor. Commit
after each checked task or logical group; that's how you hit 20+ commits.

---

## Phase 0 — Project setup

```bash
# git + node project
git init
cat > .gitignore <<'EOF'
node_modules
dist
.env
EOF
npm init -y

# deps
# NOTE: no express-rate-limit / ioredis. Vercel functions are stateless and
# short-lived — an in-memory limiter resets per invocation and a raw TCP
# redis client (ioredis) fights cold starts. @upstash/redis is REST-based
# (works over plain fetch, no persistent connection) and @upstash/ratelimit
# is built for exactly this deployment target — one Redis serves both the
# rate limiter and response caching.
npm i express cors helmet zod bcryptjs jsonwebtoken dotenv stripe google-auth-library @prisma/client@6 @upstash/redis @upstash/ratelimit
npm i -D typescript tsx prisma@6 @types/express @types/node @types/cors @types/jsonwebtoken @types/bcryptjs

# tsconfig
npx tsc --init

# folders
mkdir -p src/config src/middlewares src/utils src/modules prisma

# env validator (edit content after) — must throw at boot on any missing var,
# not fail silently at request time in production
touch src/config/env.ts

# Upstash Redis: create a free database at https://console.upstash.com,
# copy the REST URL + token (not the ioredis connection string)
# DATABASE_URL: use your provider's POOLED connection string here (e.g.
# Neon's pooler endpoint) — a serverless function per-request spins up a
# new PrismaClient unless you singleton it (see Phase 2), and without
# pooling you exhaust Postgres' connection limit under concurrent requests.
# DIRECT_URL: the UNPOOLED string, used only for migrations.
cat > .env <<'EOF'
DATABASE_URL=
DIRECT_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CORS_ORIGIN=
EOF

git add .gitignore package.json package-lock.json tsconfig.json
git commit -m "chore: init express + typescript project"

# app entry points
touch src/app.ts src/server.ts

# health route — add manually inside app.ts, then:
git add src/app.ts src/server.ts src/config/env.ts
git commit -m "feat: add health endpoint and app bootstrap"

# Prisma client singleton — one PrismaClient instance reused across
# invocations (cache it on globalThis in dev to survive hot-reload, and
# rely on connection pooling in prod). Never call `new PrismaClient()`
# inside a request handler or module — that's the #1 cause of "too many
# connections" errors on serverless deploys.
touch src/config/prisma.ts
git add src/config/prisma.ts
git commit -m "feat: add prisma client singleton for serverless reuse"

# Redis client singleton (Upstash REST client, safe to import anywhere)
touch src/config/redis.ts
git add src/config/redis.ts
git commit -m "feat: add upstash redis client singleton"

# vercel config
touch vercel.json
git add vercel.json
git commit -m "chore: add vercel deployment config"

# deploy
npm i -g vercel
vercel login
vercel --prod
```

---

## Phase 1 — Database

```bash
# schema (paste the schema.prisma content into this file)
touch prisma/schema.prisma
git add prisma/schema.prisma
git commit -m "feat: add prisma schema"

npx prisma migrate dev --name init
git add prisma/migrations
git commit -m "feat: add initial migration"

# seed script
touch prisma/seed.ts
npm pkg set prisma.seed="tsx prisma/seed.ts"
npm run seed  # (or: npx prisma db seed)
git add prisma/seed.ts package.json
git commit -m "feat: add seed script with admin, instructors, students, courses"

# inspect data
npx prisma studio

# push schema to hosted db (if not already applied by migrate dev)
npx prisma migrate deploy
```

---

## Phase 2 — Shared infrastructure

```bash
touch src/utils/AppError.ts
touch src/utils/sendResponse.ts
touch src/utils/asyncHandler.ts
touch src/utils/audit.ts
touch src/middlewares/errorHandler.ts
touch src/middlewares/notFound.ts
touch src/middlewares/validate.ts
touch src/middlewares/rateLimit.ts
touch src/utils/cache.ts
touch src/utils/serialize.ts

git add src/utils/AppError.ts src/utils/sendResponse.ts
git commit -m "feat: add AppError and response helper"

# sendResponse.ts convention to lock in now (list endpoints nest paging here):
# success: { success: true, message, data: { items, meta: { page, limit, total } } }
# single:  { success: true, message, data: { ...resource } }
# error:   { success: false, message, errors: [...] }

git add src/middlewares/errorHandler.ts src/middlewares/notFound.ts
git commit -m "feat: add global error handler and 404 middleware"

git add src/middlewares/validate.ts src/utils/asyncHandler.ts
git commit -m "feat: add zod validation middleware and async handler"

# rateLimit.ts: Ratelimit.slidingWindow via @upstash/ratelimit, keyed by
# req.user?.id ?? req.ip. Two instances — a strict one (e.g. 5/min) mounted
# only on /auth/register and /auth/login, a looser one (e.g. 60/min) mounted
# globally in app.ts.
git add src/middlewares/rateLimit.ts
git commit -m "feat: add upstash-backed rate limiting middleware"

# cache.ts: getOrSetCache(key, ttlSeconds, fetcher) wrapper around
# @upstash/redis get/set — used on GET /courses and GET /admin/dashboard-stats
git add src/utils/cache.ts
git commit -m "feat: add redis cache-aside helper"

# serialize.ts: toSafeUser(user) strips passwordHash before any response —
# never spread a raw Prisma User object into res.json
git add src/utils/serialize.ts
git commit -m "feat: add safe user serializer to strip passwordHash from responses"

git add src/utils/audit.ts
git commit -m "feat: add audit log helper"

# wire helmet/cors — edit src/app.ts, then:
# CORS_ORIGIN from env, explicit allowlist, not "*" (you're using
# credentialed Bearer auth and a Swagger/OAuth redirect origin)
git add src/app.ts
git commit -m "feat: wire helmet, cors and global middlewares"
```

---

## Phase 3 — Auth

```bash
mkdir -p src/modules/auth
touch src/utils/jwt.ts src/utils/hash.ts
touch src/modules/auth/auth.routes.ts src/modules/auth/auth.controller.ts \
      src/modules/auth/auth.service.ts src/modules/auth/auth.schema.ts

git add src/utils/jwt.ts src/utils/hash.ts
git commit -m "feat: add jwt and password hashing utils"
# jwt.ts: access token exp 15m, refresh token exp 7d, separate secrets
# (JWT_ACCESS_SECRET / JWT_REFRESH_SECRET), algorithm HS256 explicit

# implement register + login in auth.service.ts / controller.ts / routes.ts, then:
git add src/modules/auth/
git commit -m "feat: add register and login endpoints"

# implement refresh + logout
git add src/modules/auth/
git commit -m "feat: add refresh-token and logout endpoints"

# implement google oauth
# — create an OAuth client in Google Cloud Console (APIs & Services >
#   Credentials), add http://localhost:3000/api/v1/auth/google/callback
#   AND your prod callback URL under Authorized redirect URIs
# — scopes: openid email profile; verify id_token.email_verified === true
#   before find-or-create, or you accept unverified Google emails as identity
git add src/modules/auth/
git commit -m "feat: add google oauth login flow"

touch src/middlewares/authenticate.ts src/middlewares/authorize.ts
git add src/middlewares/authenticate.ts src/middlewares/authorize.ts
git commit -m "feat: add authenticate and authorize middleware"

# manual testing — no commit, just curl checks
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Student","email":"student@test.com","password":"Passw0rd!"}'

curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"Passw0rd!"}'
```

---

## Phase 4 — Users / profile

```bash
mkdir -p src/modules/users
touch src/modules/users/users.routes.ts src/modules/users/users.controller.ts \
      src/modules/users/users.service.ts src/modules/users/users.schema.ts

git add src/modules/users/
git commit -m "feat: add users me get/patch endpoints"
```

---

## Phase 5 — Departments

```bash
mkdir -p src/modules/departments
touch src/modules/departments/departments.routes.ts src/modules/departments/departments.controller.ts \
      src/modules/departments/departments.service.ts src/modules/departments/departments.schema.ts

git add src/modules/departments/
git commit -m "feat: add departments CRUD"
```

---

## Phase 6 — Courses

```bash
mkdir -p src/modules/courses
touch src/modules/courses/courses.routes.ts src/modules/courses/courses.controller.ts \
      src/modules/courses/courses.service.ts src/modules/courses/courses.schema.ts

git add src/modules/courses/
git commit -m "feat: add courses CRUD with pagination, filter and search"

# wrap GET /courses list query in cache.ts's getOrSetCache (~60s TTL, keyed
# on the full querystring); on create/update/delete, invalidate by prefix
# (redis.del of every "courses:list:*" key, or a short TTL and accept
# eventual consistency — either is defensible, pick one and say why in the
# video)
git add src/modules/courses/
git commit -m "feat: add redis caching to courses list endpoint"

# prerequisites endpoints added to same module
git add src/modules/courses/
git commit -m "feat: add course prerequisite management with cycle check"
```

---

## Phase 7 — Semesters

```bash
mkdir -p src/modules/semesters
touch src/modules/semesters/semesters.routes.ts src/modules/semesters/semesters.controller.ts \
      src/modules/semesters/semesters.service.ts src/modules/semesters/semesters.schema.ts

git add src/modules/semesters/
git commit -m "feat: add semesters CRUD"
```

---

## Phase 8 — Sections

```bash
mkdir -p src/modules/sections
touch src/modules/sections/sections.routes.ts src/modules/sections/sections.controller.ts \
      src/modules/sections/sections.service.ts src/modules/sections/sections.schema.ts

git add src/modules/sections/
git commit -m "feat: add sections CRUD with filtering"

git add src/modules/sections/
git commit -m "feat: add instructor sections listing endpoint"
```

---

## Phase 9 — Enrollment

```bash
mkdir -p src/modules/enrollments
touch src/modules/enrollments/enrollments.routes.ts src/modules/enrollments/enrollments.controller.ts \
      src/modules/enrollments/enrollments.service.ts src/modules/enrollments/enrollments.schema.ts

git add src/modules/enrollments/
git commit -m "feat: add enrollment transaction with capacity and prerequisite checks"

git add src/modules/enrollments/
git commit -m "feat: add drop enrollment endpoint"

git add src/modules/enrollments/
git commit -m "feat: add my-enrollments and section-students endpoints"

# manual concurrency/edge-case tests — no commit
curl -X POST http://localhost:3000/api/v1/enrollments \
  -H "Authorization: Bearer $STUDENT_TOKEN" -H "Content-Type: application/json" \
  -d '{"sectionId":"<id>"}'

# fire the same request twice in parallel to sanity-check the capacity race:
for i in 1 2; do
  curl -s -X POST http://localhost:3000/api/v1/enrollments \
    -H "Authorization: Bearer $STUDENT_TOKEN" -H "Content-Type: application/json" \
    -d '{"sectionId":"<full-section-id>"}' & 
done
wait
```

---

## Phase 10 — Grading & transcript

```bash
mkdir -p src/modules/grades
touch src/modules/grades/grades.routes.ts src/modules/grades/grades.controller.ts \
      src/modules/grades/grades.service.ts src/modules/grades/grades.schema.ts \
      src/modules/grades/gradePoints.ts

git add src/modules/grades/
git commit -m "feat: add instructor grade submission endpoint"

git add src/modules/grades/
git commit -m "feat: add student transcript endpoint with GPA calculation"
```

---

## Phase 11 — Invoicing & payment

```bash
mkdir -p src/modules/invoices src/modules/payments
touch src/modules/invoices/invoices.routes.ts src/modules/invoices/invoices.controller.ts \
      src/modules/invoices/invoices.service.ts

touch src/modules/payments/payments.routes.ts src/modules/payments/payments.controller.ts \
      src/modules/payments/payments.service.ts src/modules/payments/payments.webhook.ts

# CRITICAL ORDERING in app.ts: the webhook route needs the raw request body
# to verify Stripe's signature — Express's json() middleware will have
# already consumed and reparsed it by then. Mount raw() on this exact path
# BEFORE app.use(express.json()), not after:
#   app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
#   app.use(express.json());
# Get this order wrong and every webhook signature check fails.

git add src/modules/invoices/
git commit -m "feat: add invoice generation and my-invoices endpoint"

git add src/modules/payments/
git commit -m "feat: add stripe payment session initiation"

git add src/modules/payments/
git commit -m "feat: add stripe webhook with signature verification"

# idempotency: Stripe retries a webhook on any non-2xx or timeout, so the
# same event.id can arrive more than once. Before mutating anything, check
# Payment.stripeEventId against event.id — if it already matches, return 200
# immediately without touching the row. Do the check-then-write inside the
# same $transaction as the Invoice status update.
git add src/modules/payments/
git commit -m "feat: dedupe stripe webhook events via stripeEventId"

git add src/modules/payments/
git commit -m "feat: add payment status endpoint"

# stripe local webhook testing
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
stripe trigger checkout.session.completed
```

---

## Phase 12 — Admin

```bash
mkdir -p src/modules/admin
touch src/modules/admin/admin.routes.ts src/modules/admin/admin.controller.ts \
      src/modules/admin/admin.service.ts

git add src/modules/admin/
git commit -m "feat: add admin user management endpoints"

git add src/modules/admin/
git commit -m "feat: add admin dashboard stats endpoint"

# this endpoint runs several COUNT/SUM aggregates — cache it with
# getOrSetCache too (30-60s TTL is fine, admins don't need live-to-the-second)
git add src/modules/admin/
git commit -m "feat: add redis caching to dashboard stats endpoint"

git add src/modules/admin/
git commit -m "feat: add admin audit log endpoint"
```

---

## Phase 13 — Cross-cutting hardening

```bash
# grep-audit for missing safeguards before committing hardening pass
grep -rn "findMany\|findFirst" src/modules | grep -v "deletedAt"
grep -rln "router.post\|router.patch\|router.put" src/modules | xargs grep -L "validate("

git add src/
git commit -m "fix: enforce soft-delete filtering across all list queries"

git add src/
git commit -m "fix: add missing zod validation on write routes"

git add prisma/schema.prisma prisma/migrations
git commit -m "perf: add missing database indexes"

git add src/app.ts
git commit -m "fix: apply rate limiting globally and on auth routes"

git add src/modules/
git commit -m "fix: enforce ownership checks on instructor and student routes"

# password/secret leakage audit — a raw `user` object returned anywhere
# (register response, admin user list, /users/me) leaks passwordHash unless
# every one of these goes through toSafeUser() or an explicit Prisma
# `select`. Grep for the failure mode, don't just eyeball it:
grep -rn "res\.\(json\|send\)(.*user\b" src/modules -i | grep -v "toSafeUser\|select"
grep -rn "prisma\.user\.\(findMany\|findFirst\|findUnique\)" src/modules | grep -v "select:"

git add src/
git commit -m "fix: strip passwordHash from every user-returning response"

# serverless connection-exhaustion audit — this must return exactly one
# match (the singleton file itself). Any hit outside src/config/prisma.ts
# is a live-instance bug on Vercel, not a style nitpick.
grep -rn "new PrismaClient" src --include="*.ts"

# confirm boot fails loudly on missing env, not silently at first request
node -e "delete process.env.JWT_ACCESS_SECRET; require('tsx/cjs'); require('./src/config/env.ts')"
```

---

## Phase 14 — Documentation

```bash
mkdir -p docs
# export collection from Postman UI, then move it in:
mv ~/Downloads/UMS.postman_collection.json docs/
git add docs/
git commit -m "docs: add postman collection"
```

---

## Phase 15 — Deployment & submission prep

```bash
# set production env vars (repeat per var) — DATABASE_URL must be the
# POOLED connection string in prod, same reasoning as Phase 0
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add JWT_ACCESS_SECRET production
vercel env add JWT_REFRESH_SECRET production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add GOOGLE_REDIRECT_URI production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel env add CORS_ORIGIN production

vercel --prod

# smoke test the live URL
curl https://<your-app>.vercel.app/api/v1/health

# re-verify the webhook against the LIVE url — a signature secret is
# per-endpoint in Stripe; your local `stripe listen` secret is not the same
# as the one your deployed webhook will receive events with. Add the live
# endpoint in the Stripe dashboard and copy that secret into
# STRIPE_WEBHOOK_SECRET production, don't reuse the local one.
stripe trigger checkout.session.completed

# create dedicated demo admin via seed or a one-off script, then:
touch prisma/seedAdminDemo.ts
npx tsx prisma/seedAdminDemo.ts
git add prisma/seedAdminDemo.ts
git commit -m "chore: add dedicated demo admin seed script"

touch README.md
git add README.md
git commit -m "docs: add final README with setup and submission links"

# verify commit count
git log --oneline | wc -l
```

---

## Phase 16 — Video & submission

```bash
# no bash for recording — script it in a text file first
touch VIDEO_SCRIPT.md
git add VIDEO_SCRIPT.md
git commit -m "docs: add video walkthrough script"

# after recording with OBS/Loom and uploading:
# fill in the submission block and post it to the assignment portal manually
```
