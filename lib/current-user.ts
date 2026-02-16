import { Role } from "@prisma/client";
import { readSession } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser(requiredRoles?: Role[]) {
  const session = await readSession();
  if (!session) {
    return null;
  }

  if (requiredRoles && !requiredRoles.includes(session.role)) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, role: true }
  });
}
