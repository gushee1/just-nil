import { Role } from "@prisma/client";

export function assertRole(actual: Role, allowed: Role[]) {
  if (!allowed.includes(actual)) {
    throw new Error("Forbidden");
  }
}
