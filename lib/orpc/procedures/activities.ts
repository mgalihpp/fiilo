import { ORPCError } from "@orpc/server";
import { prisma } from "../../prisma";
import { activityCreateInput, activityListInput } from "../../schemas/activity";
import { userProcedure } from "../context";

const list = userProcedure
  .input(activityListInput)
  .handler(async ({ input }) => {
    return prisma.activity.findMany({
      where: {
        ...(input.leadId ? { leadId: input.leadId } : {}),
        ...(input.dealId ? { dealId: input.dealId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  });

const create = userProcedure
  .input(activityCreateInput)
  .handler(async ({ input, context }) => {
    if (!input.leadId && !input.dealId) {
      throw new ORPCError("BAD_REQUEST", {
        message: "leadId or dealId required",
      });
    }
    return prisma.activity.create({
      data: {
        leadId: input.leadId || null,
        dealId: input.dealId || null,
        type: input.type,
        description: input.description,
        scheduledAt: input.scheduledAt || null,
        performedBy: context.user.id,
      },
    });
  });

export const activitiesRouter = { list, create };
