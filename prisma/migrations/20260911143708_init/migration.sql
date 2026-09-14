-- CreateEnum
CREATE TYPE "Importance" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('active', 'achieved', 'paused', 'abandoned');

-- CreateEnum
CREATE TYPE "HabitStatus" AS ENUM ('active', 'paused', 'completed', 'abandoned');

-- CreateEnum
CREATE TYPE "HabitEntryStatus" AS ENUM ('completed', 'minimum', 'partial', 'missed', 'skipped_intentionally');

-- CreateEnum
CREATE TYPE "InsightKind" AS ENUM ('context_correlation', 'time_of_day_comparison', 'declining_system', 'metric_correlation', 'minimum_reliance');

-- CreateEnum
CREATE TYPE "HabitCapabilityKind" AS ENUM ('food_tracker', 'reading_assistant', 'training', 'focus');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetValue" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "unit" TEXT,
    "deadline" DATE,
    "importance" "Importance" NOT NULL DEFAULT 'medium',
    "status" "GoalStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitSystem" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "goalId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "goalId" TEXT,
    "name" TEXT NOT NULL,
    "behavior" TEXT NOT NULL,
    "frequency" JSONB NOT NULL,
    "targetValue" DOUBLE PRECISION,
    "minimumValue" DOUBLE PRECISION,
    "unit" TEXT,
    "preferredTime" TEXT,
    "contextLocation" TEXT,
    "contextTrigger" TEXT,
    "difficulty" INTEGER NOT NULL,
    "reason" TEXT,
    "status" "HabitStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "energy" INTEGER NOT NULL,
    "mood" INTEGER NOT NULL,
    "stress" INTEGER NOT NULL,
    "focus" INTEGER NOT NULL,
    "note" TEXT,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitEntry" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "status" "HabitEntryStatus" NOT NULL,
    "value" DOUBLE PRECISION,
    "unit" TEXT,
    "note" TEXT,
    "performedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "InsightKind" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "habitSystemId" TEXT,
    "hypothesis" TEXT NOT NULL,
    "currentSystem" TEXT NOT NULL,
    "proposedChange" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "result" JSONB,
    "conclusion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitCapability" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "kind" "HabitCapabilityKind" NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitCapability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Identity_userId_idx" ON "Identity"("userId");

-- CreateIndex
CREATE INDEX "Identity_userId_archivedAt_idx" ON "Identity"("userId", "archivedAt");

-- CreateIndex
CREATE INDEX "Goal_identityId_idx" ON "Goal"("identityId");

-- CreateIndex
CREATE INDEX "Goal_identityId_status_idx" ON "Goal"("identityId", "status");

-- CreateIndex
CREATE INDEX "HabitSystem_identityId_idx" ON "HabitSystem"("identityId");

-- CreateIndex
CREATE INDEX "HabitSystem_goalId_idx" ON "HabitSystem"("goalId");

-- CreateIndex
CREATE INDEX "Habit_systemId_idx" ON "Habit"("systemId");

-- CreateIndex
CREATE INDEX "Habit_goalId_idx" ON "Habit"("goalId");

-- CreateIndex
CREATE INDEX "Habit_systemId_status_idx" ON "Habit"("systemId", "status");

-- CreateIndex
CREATE INDEX "CheckIn_userId_idx" ON "CheckIn"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_userId_date_key" ON "CheckIn"("userId", "date");

-- CreateIndex
CREATE INDEX "HabitEntry_habitId_idx" ON "HabitEntry"("habitId");

-- CreateIndex
CREATE INDEX "HabitEntry_checkInId_idx" ON "HabitEntry"("checkInId");

-- CreateIndex
CREATE UNIQUE INDEX "HabitEntry_checkInId_habitId_key" ON "HabitEntry"("checkInId", "habitId");

-- CreateIndex
CREATE INDEX "Insight_userId_kind_idx" ON "Insight"("userId", "kind");

-- CreateIndex
CREATE INDEX "Insight_userId_dismissedAt_idx" ON "Insight"("userId", "dismissedAt");

-- CreateIndex
CREATE INDEX "Experiment_userId_idx" ON "Experiment"("userId");

-- CreateIndex
CREATE INDEX "HabitCapability_habitId_idx" ON "HabitCapability"("habitId");

-- CreateIndex
CREATE UNIQUE INDEX "HabitCapability_habitId_kind_key" ON "HabitCapability"("habitId", "kind");

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitSystem" ADD CONSTRAINT "HabitSystem_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitSystem" ADD CONSTRAINT "HabitSystem_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "HabitSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitEntry" ADD CONSTRAINT "HabitEntry_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitEntry" ADD CONSTRAINT "HabitEntry_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_habitSystemId_fkey" FOREIGN KEY ("habitSystemId") REFERENCES "HabitSystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitCapability" ADD CONSTRAINT "HabitCapability_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
