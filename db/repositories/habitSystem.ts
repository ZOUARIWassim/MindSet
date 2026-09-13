import { prisma } from "../client";

export function listSystemsForUser(userId: string) {
  return prisma.habitSystem.findMany({ where: { identity: { userId } } });
}

export function findSystemForUser(systemId: string, userId: string) {
  return prisma.habitSystem.findFirst({ where: { id: systemId, identity: { userId } } });
}

export interface CreateHabitSystemInput {
  identityId: string;
  name: string;
  description?: string;
  order?: number;
}

export function createHabitSystem(input: CreateHabitSystemInput) {
  return prisma.habitSystem.create({
    data: {
      identityId: input.identityId,
      name: input.name,
      description: input.description,
      order: input.order ?? 0,
    },
  });
}
