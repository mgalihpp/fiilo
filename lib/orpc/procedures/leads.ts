import { ORPCError } from "@orpc/server";
import { prisma } from "../../prisma";
import {
  leadIdInput,
  leadInput,
  leadListInput,
  leadUpdateInput,
} from "../../schemas/lead";
import { userProcedure } from "../context";

const list = userProcedure
  .input(leadListInput)
  .handler(async ({ input, context }) => {
    // Leads are owned via their contact's creator.
    const where = {
      contact: { createdBy: context.user.id },
      ...(input.status ? { status: input.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: { contact: true },
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.lead.count({ where }),
    ]);

    return { items, total };
  });

const get = userProcedure
  .input(leadIdInput)
  .handler(async ({ input, context }) => {
    const lead = await prisma.lead.findFirst({
      where: { id: input.id, contact: { createdBy: context.user.id } },
      include: {
        contact: true,
        activities: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!lead) throw new ORPCError("NOT_FOUND");
    return lead;
  });

async function assertOwnsContact(contactId: string, userId: string) {
  const owned = await prisma.contact.findFirst({
    where: { id: contactId, createdBy: userId },
    select: { id: true },
  });
  if (!owned)
    throw new ORPCError("NOT_FOUND", { message: "Contact not found" });
}

const create = userProcedure
  .input(leadInput)
  .handler(async ({ input, context }) => {
    await assertOwnsContact(input.contactId, context.user.id);
    return prisma.lead.create({
      data: {
        contactId: input.contactId,
        status: input.status,
        score: input.score,
        source: input.source || null,
        notes: input.notes || null,
        assignedTo: context.user.id,
      },
    });
  });

const update = userProcedure
  .input(leadUpdateInput)
  .handler(async ({ input, context }) => {
    const lead = await prisma.lead.findFirst({
      where: { id: input.id, contact: { createdBy: context.user.id } },
      select: { id: true },
    });
    if (!lead) throw new ORPCError("NOT_FOUND");

    return prisma.lead.update({
      where: { id: input.id },
      data: {
        status: input.status,
        score: input.score,
        source: input.source,
        notes: input.notes,
      },
    });
  });

const remove = userProcedure
  .input(leadIdInput)
  .handler(async ({ input, context }) => {
    const lead = await prisma.lead.findFirst({
      where: { id: input.id, contact: { createdBy: context.user.id } },
      select: { id: true },
    });
    if (!lead) throw new ORPCError("NOT_FOUND");

    await prisma.lead.delete({ where: { id: input.id } });
    return { id: input.id };
  });

export const leadsRouter = { list, get, create, update, remove };
