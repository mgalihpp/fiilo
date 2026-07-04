import { ORPCError, os } from "@orpc/server";

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
