import { ORPCError } from "@orpc/server";
import { prisma } from "../../prisma";
import {
  DEAL_STAGES,
  dealIdInput,
  dealInput,
  dealListInput,
  dealMoveInput,
  dealUpdateInput,
} from "../../schemas/deal";
import { userProcedure } from "../context";
import { getOrCreateDefaultPipeline } from "./pipeline";

// If a lead is attached, confirm the caller owns it (via its contact).
async function assertOwnsLead(leadId: string, userId: string) {
  const owned = await prisma.lead.findFirst({
    where: { id: leadId, contact: { createdBy: userId } },
    select: { id: true },
  });
  if (!owned) throw new ORPCError("NOT_FOUND", { message: "Lead not found" });
}

const list = userProcedure
  .input(dealListInput)
  .handler(async ({ input, context }) => {
    const where = {
      createdBy: context.user.id,
      ...(input.stage ? { stage: input.stage } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        include: { lead: { include: { contact: true } } },
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.deal.count({ where }),
    ]);

    return { items, total };
  });

// All deals grouped by stage for the Kanban board.
const board = userProcedure.handler(async ({ context }) => {
  const deals = await prisma.deal.findMany({
    where: { createdBy: context.user.id },
    include: { lead: { include: { contact: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const columns = DEAL_STAGES.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stage === stage),
  }));

  return { columns };
});

// Aggregate KPIs for the deals page header.
const stats = userProcedure.handler(async ({ context }) => {
  const deals = await prisma.deal.findMany({
    where: { createdBy: context.user.id },
    select: { stage: true, value: true },
  });

  const won = deals.filter((d) => d.stage === "WON");
  const lost = deals.filter((d) => d.stage === "LOST");
  const open = deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST");
  const closed = won.length + lost.length;

  return {
    totalDeals: deals.length,
    openValue: open.reduce((sum, d) => sum + d.value, 0),
    wonValue: won.reduce((sum, d) => sum + d.value, 0),
    winRate: closed > 0 ? Math.round((won.length / closed) * 100) : 0,
  };
});

const get = userProcedure
  .input(dealIdInput)
  .handler(async ({ input, context }) => {
    const deal = await prisma.deal.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      include: {
        lead: { include: { contact: true } },
        activities: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!deal) throw new ORPCError("NOT_FOUND");
    return deal;
  });

const create = userProcedure
  .input(dealInput)
  .handler(async ({ input, context }) => {
    if (input.leadId) await assertOwnsLead(input.leadId, context.user.id);
    const pipeline = await getOrCreateDefaultPipeline(context.user.id);

    return prisma.deal.create({
      data: {
        title: input.title,
        leadId: input.leadId || null,
        pipelineId: pipeline.id,
        stage: input.stage,
        value: input.value,
        currency: input.currency,
        probability: input.probability,
        expectedCloseDate: input.expectedCloseDate
          ? new Date(input.expectedCloseDate)
          : null,
        createdBy: context.user.id,
        assignedTo: context.user.id,
      },
    });
  });

const update = userProcedure
  .input(dealUpdateInput)
  .handler(async ({ input, context }) => {
    const existing = await prisma.deal.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!existing) throw new ORPCError("NOT_FOUND");
    if (input.leadId) await assertOwnsLead(input.leadId, context.user.id);

    return prisma.deal.update({
      where: { id: input.id },
      data: {
        title: input.title,
        leadId: input.leadId,
        stage: input.stage,
        value: input.value,
        currency: input.currency,
        probability: input.probability,
        expectedCloseDate: input.expectedCloseDate
          ? new Date(input.expectedCloseDate)
          : undefined,
      },
    });
  });

// Kanban drag-drop: change only the stage.
const move = userProcedure
  .input(dealMoveInput)
  .handler(async ({ input, context }) => {
    const existing = await prisma.deal.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!existing) throw new ORPCError("NOT_FOUND");

    return prisma.deal.update({
      where: { id: input.id },
      data: { stage: input.stage },
    });
  });

const remove = userProcedure
  .input(dealIdInput)
  .handler(async ({ input, context }) => {
    const existing = await prisma.deal.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!existing) throw new ORPCError("NOT_FOUND");

    await prisma.deal.delete({ where: { id: input.id } });
    return { id: input.id };
  });

export const dealsRouter = {
  list,
  board,
  stats,
  get,
  create,
  update,
  move,
  remove,
};
