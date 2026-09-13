# MindSet

MindSet helps you become who you want to be by building sustainable systems, not by chasing motivation.

**Don't optimize your motivation. Optimize your system.**

You define an identity ("I am a healthy person"), attach goals to it, design habit systems made of concrete habits, do a fast daily check-in, and get insights about which parts of your system actually work.

No streaks, no points, no guilt. Every habit has a minimum version that still counts as a real success, and a missed day is treated as information about the system, not a personal failure.

## Features

- **Onboarding** — pick or write 1-3 identities, an optional goal each, a first habit system, and 1-3 habits (with a required minimum version), in under 3 minutes. Resumable: refreshing mid-flow picks up wherever you left off.
- **Today** — the daily check-in. One tap for completed, a secondary control for minimum/partial/missed/skipped, energy/mood/stress/focus sliders, and a note. Editable for the last 7 days.
- **Identity view** — statement, goals with progress, and each system's habits with a 30-day completion rate framed as "N of your last M days," never a bare percentage.
- **Habit detail** — a 12-week heatmap (not a streak counter), completion rate by weekday and time of day, a value trend when the habit tracks a unit, and edit/pause/abandon.
- **Insights** — five generators (context correlation, time-of-day comparison, declining system, metric correlation, minimum-version reliance) running nightly via Vercel Cron and on demand, with "X more days until insights" while data is still thin.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript, server actions for mutations
- PostgreSQL + [Prisma](https://www.prisma.io) 7 (driver-adapter client via `@prisma/adapter-pg`)
- Tailwind CSS v4 + [Radix](https://www.radix-ui.com) primitives
- [Auth.js](https://authjs.dev) v5 (email + password via Credentials)
- [Vitest](https://vitest.dev) for domain unit tests, [Playwright](https://playwright.dev) for e2e

## Getting started

```bash
docker compose up -d          # local Postgres on :5432
cp .env.example .env          # fill in AUTH_SECRET (openssl rand -hex 32)
npm install                   # also runs `prisma generate`
npm run db:migrate            # apply the schema
npm run db:seed               # demo user: demo@mindset.local / mindset-demo, 90 days of data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and either sign in as the demo user or sign up fresh.

## Project layout

- `app/` — routes, layouts, and server actions (`app/actions/*`)
- `domain/` — pure, fully unit-tested business logic: scheduling, completion, correlation, insight generators. No I/O, no Prisma imports.
- `db/` — the Prisma client, repositories, and `userContext.ts` (the read-only assembler the insights engine reads from)
- `components/` — presentational React components, grouped by feature
- `lib/` — Auth.js config, timezone helpers, onboarding presets, copy helpers
- `prisma/` — schema, migrations, seed script

Note: this project runs on Next.js 16 and Prisma 7, both of which changed significantly from earlier versions (Next renamed `middleware` to `proxy` and changed some App Router conventions; Prisma moved config out of `schema.prisma` into `prisma7.config.ts` and now requires an explicit driver adapter). See `AGENTS.md` if you're using an AI coding assistant on this repo — it points at the bundled `node_modules/next/dist/docs/` for the current API surface.

## Testing

```bash
npm run test        # Vitest — domain unit tests
npm run test:e2e    # Playwright — full flows (signup/onboarding, check-in, identity/habit browsing, insights)
```

The e2e suite runs serially (not in parallel) because several specs share the seeded demo account and mutate its data.

## Deploying

Target: Vercel + a hosted Postgres (Vercel Postgres, Neon, Supabase, etc.).

1. Push to a Git remote and import the repo in Vercel.
2. Set environment variables in the Vercel project: `DATABASE_URL`, `AUTH_SECRET`, and optionally `CRON_SECRET` (verifies that `/api/cron/insights` requests actually come from Vercel Cron).
3. Run `npx prisma migrate deploy` against the production database (from CI or locally with the production `DATABASE_URL`).
4. `vercel.json` already defines the nightly insights cron job.
