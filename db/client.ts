import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Next.js hot-reloads modules in dev, which would otherwise open a new
// connection pool on every edit. Cache the client on the global object so
// dev reuses the same instance across reloads.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
