# MindSet

MindSet helps you become who you want to be by building sustainable systems, not by chasing motivation.

**Don't optimize your motivation. Optimize your system.**

You define an identity ("I am a healthy person"), attach goals to it, design habit systems made of concrete habits, do a fast daily check-in, and get insights about which parts of your system actually work.

No streaks, no points, no guilt. Every habit has a minimum version that still counts as a real success, and a missed day is treated as information about the system, not a personal failure.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript, server actions for mutations
- PostgreSQL + [Prisma](https://www.prisma.io)
- Tailwind CSS + [Radix](https://www.radix-ui.com) primitives
- [Auth.js](https://authjs.dev) (email + password)
- [Vitest](https://vitest.dev) for unit tests, [Playwright](https://playwright.dev) for e2e

## Getting started

```bash
docker compose up -d          # local Postgres
cp .env.example .env          # then fill in AUTH_SECRET
npm install
npx prisma migrate dev        # once prisma/schema.prisma exists
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

- `app/` — routes, layouts, and server actions
- `domain/` — pure, fully unit-tested business logic (scheduling, completion, analytics, insights). No I/O.
- `db/` — Prisma client and repositories
- `components/` — presentational React components
- `lib/` — auth config, timezone helpers, onboarding presets

## Testing

```bash
npm run test        # Vitest — domain unit tests
npm run test:e2e    # Playwright — end-to-end happy path
```
