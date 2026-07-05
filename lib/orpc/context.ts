import { ORPCError, os } from "@orpc/server";
import { prisma } from "../prisma";

export interface ORPCContext {
  userId: string | null;
}

export const base = os.$context<ORPCContext>();

export const protectedProcedure = base.use(async ({ context, next }) => {
  if (!context.userId) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      userId: context.userId,
    },
  });
});

// context.userId is the Clerk id; resolve the DB user (User.id) that relations
// reference. syncClerkUser runs in getAuthContext, so the row exists.
export const userProcedure = protectedProcedure.use(
  async ({ context, next }) => {
    const user = await prisma.user.findUnique({
      where: { clerkId: context.userId },
    });

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { user } });
  },
);
