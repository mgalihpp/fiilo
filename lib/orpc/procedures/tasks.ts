import { ORPCError } from "@orpc/server";
import { prisma } from "../../prisma";
import {
  TASK_STATUSES,
  taskIdInput,
  taskInput,
  taskListInput,
  taskMoveInput,
  taskToggleInput,
  taskUpdateInput,
} from "../../schemas/task";
import { userProcedure } from "../context";

// If a lead is attached, confirm the caller owns it (via its contact).
async function assertOwnsLead(leadId: string, userId: string) {
  const owned = await prisma.lead.findFirst({
    where: { id: leadId, contact: { createdBy: userId } },
    select: { id: true },
  });
  if (!owned) throw new ORPCError("NOT_FOUND", { message: "Lead not found" });
}

// If a deal is attached, confirm the caller created it.
async function assertOwnsDeal(dealId: string, userId: string) {
  const owned = await prisma.deal.findFirst({
    where: { id: dealId, createdBy: userId },
    select: { id: true },
  });
  if (!owned) throw new ORPCError("NOT_FOUND", { message: "Deal not found" });
}

const list = userProcedure
  .input(taskListInput)
  .handler(async ({ input, context }) => {
    const where = {
      createdBy: context.user.id,
      ...(input.status ? { status: input.status } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          lead: { include: { contact: true } },
          deal: { select: { id: true, title: true } },
        },
        // Open tasks first, then by soonest due date, then newest.
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    return { items, total };
  });

// All tasks grouped by status for the Kanban board.
const board = userProcedure.handler(async ({ context }) => {
  const tasks = await prisma.task.findMany({
    where: { createdBy: context.user.id },
    include: {
      lead: { include: { contact: true } },
      deal: { select: { id: true, title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const columns = TASK_STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  return { columns };
});

// All tasks that have a due date, for the calendar view.
const calendar = userProcedure.handler(async ({ context }) => {
  return prisma.task.findMany({
    where: { createdBy: context.user.id, dueDate: { not: null } },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
    },
    orderBy: { dueDate: "asc" },
  });
});

// Aggregate KPIs for the tasks page header.
const stats = userProcedure.handler(async ({ context }) => {
  const tasks = await prisma.task.findMany({
    where: { createdBy: context.user.id },
    select: { status: true, dueDate: true },
  });

  const now = new Date();
  const done = tasks.filter((t) => t.status === "DONE");
  const open = tasks.filter((t) => t.status !== "DONE");
  const overdue = open.filter((t) => t.dueDate && t.dueDate < now);

  return {
    totalTasks: tasks.length,
    openTasks: open.length,
    doneTasks: done.length,
    overdueTasks: overdue.length,
  };
});

const get = userProcedure
  .input(taskIdInput)
  .handler(async ({ input, context }) => {
    const task = await prisma.task.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      include: {
        lead: { include: { contact: true } },
        deal: { select: { id: true, title: true } },
      },
    });
    if (!task) throw new ORPCError("NOT_FOUND");
    return task;
  });

const create = userProcedure
  .input(taskInput)
  .handler(async ({ input, context }) => {
    if (input.leadId) await assertOwnsLead(input.leadId, context.user.id);
    if (input.dealId) await assertOwnsDeal(input.dealId, context.user.id);

    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description || null,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        leadId: input.leadId || null,
        dealId: input.dealId || null,
        completedAt: input.status === "DONE" ? new Date() : null,
        createdBy: context.user.id,
        assignedTo: context.user.id,
      },
    });
  });

const update = userProcedure
  .input(taskUpdateInput)
  .handler(async ({ input, context }) => {
    const existing = await prisma.task.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!existing) throw new ORPCError("NOT_FOUND");
    if (input.leadId) await assertOwnsLead(input.leadId, context.user.id);
    if (input.dealId) await assertOwnsDeal(input.dealId, context.user.id);

    return prisma.task.update({
      where: { id: input.id },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        leadId: input.leadId,
        dealId: input.dealId,
        // Keep completedAt in sync when the status changes via the form.
        ...(input.status
          ? { completedAt: input.status === "DONE" ? new Date() : null }
          : {}),
      },
    });
  });

// Board drag-drop: change only the status (and completedAt bookkeeping).
const move = userProcedure
  .input(taskMoveInput)
  .handler(async ({ input, context }) => {
    const existing = await prisma.task.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!existing) throw new ORPCError("NOT_FOUND");

    return prisma.task.update({
      where: { id: input.id },
      data: {
        status: input.status,
        completedAt: input.status === "DONE" ? new Date() : null,
      },
    });
  });

// Checkbox toggle from the list view.
const toggle = userProcedure
  .input(taskToggleInput)
  .handler(async ({ input, context }) => {
    const existing = await prisma.task.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!existing) throw new ORPCError("NOT_FOUND");

    return prisma.task.update({
      where: { id: input.id },
      data: {
        status: input.done ? "DONE" : "TODO",
        completedAt: input.done ? new Date() : null,
      },
    });
  });

const remove = userProcedure
  .input(taskIdInput)
  .handler(async ({ input, context }) => {
    const existing = await prisma.task.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!existing) throw new ORPCError("NOT_FOUND");

    await prisma.task.delete({ where: { id: input.id } });
    return { id: input.id };
  });

export const tasksRouter = {
  list,
  board,
  calendar,
  stats,
  get,
  create,
  update,
  move,
  toggle,
  remove,
};
