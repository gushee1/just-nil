import { InteractionType, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const interactionSchema = z.object({
  targetUserId: z.string().min(10),
  type: z.nativeEnum(InteractionType)
});

export async function POST(request: Request) {
  const user = await getCurrentUser([Role.STUDENT, Role.COMPANY]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = interactionSchema.parse(body);

    if (input.targetUserId === user.id) {
      return NextResponse.json({ error: "Cannot interact with yourself" }, { status: 400 });
    }

    const interaction = await prisma.matchInteraction.upsert({
      where: {
        actorUserId_targetUserId_type: {
          actorUserId: user.id,
          targetUserId: input.targetUserId,
          type: input.type
        }
      },
      update: {},
      create: {
        actorUserId: user.id,
        targetUserId: input.targetUserId,
        type: input.type
      }
    });

    return NextResponse.json({ interaction });
  } catch {
    return NextResponse.json({ error: "Invalid interaction payload" }, { status: 400 });
  }
}
