import { prisma } from "../client";
import type { Importance } from "../../generated/prisma/client";

export function listIdentitiesForUser(userId: string) {
  return prisma.identity.findMany({
    where: { userId, archivedAt: null },
    include: { goals: true },
    orderBy: { order: "asc" },
  });
}

export function findIdentityForUser(identityId: string, userId: string) {
  return prisma.identity.findFirst({ where: { id: identityId, userId, archivedAt: null } });
}

export interface CreateIdentityInput {
  userId: string;
  name: string;
  statement: string;
  description?: string;
  order: number;
  goal?: {
    name: string;
    unit?: string;
    targetValue?: number;
    importance?: Importance;
  };
}

export async function createIdentityWithGoal(input: CreateIdentityInput) {
  const identity = await prisma.identity.create({
    data: {
      userId: input.userId,
      name: input.name,
      statement: input.statement,
      description: input.description,
      order: input.order,
    },
  });

  if (input.goal) {
    await prisma.goal.create({
      data: {
        identityId: identity.id,
        name: input.goal.name,
        unit: input.goal.unit,
        targetValue: input.goal.targetValue,
        importance: input.goal.importance ?? "medium",
        status: "active",
      },
    });
  }

  return identity;
}
