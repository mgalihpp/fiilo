import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { prisma } from "../../prisma";
import { userProcedure } from "../context";

const createSession = userProcedure
  .handler(async ({ context }) => {
    const session = await prisma.aISession.create({
      data: { userId: context.user.id, title: "New Chat" },
    });
    return { id: session.id };
  });

const listSessions = userProcedure
  .handler(async ({ context }) => {
    const sessions = await prisma.aISession.findMany({
      where: { userId: context.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return sessions.map((s) => ({
      id: s.id,
      title: s.title ?? "New Chat",
      lastMessage: s.messages[0]?.content ?? null,
      createdAt: s.createdAt,
    }));
  });

const getSession = userProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const session = await prisma.aISession.findFirst({
      where: { id: input.id, userId: context.user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!session) throw new ORPCError("NOT_FOUND");
    return {
      id: session.id,
      title: session.title ?? "New Chat",
      messages: session.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    };
  });

const renameSession = userProcedure
  .input(z.object({ id: z.string(), title: z.string().min(1).max(100) }))
  .handler(async ({ input, context }) => {
    const session = await prisma.aISession.findFirst({
      where: { id: input.id, userId: context.user.id },
    });
    if (!session) throw new ORPCError("NOT_FOUND");
    await prisma.aISession.update({
      where: { id: input.id },
      data: { title: input.title },
    });
    return { success: true };
  });

const deleteSession = userProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const session = await prisma.aISession.findFirst({
      where: { id: input.id, userId: context.user.id },
    });
    if (!session) throw new ORPCError("NOT_FOUND");
    await prisma.aIMessage.deleteMany({ where: { sessionId: input.id } });
    await prisma.aISession.delete({ where: { id: input.id } });
    return { success: true };
  });

export const chatRouter = {
  createSession,
  listSessions,
  getSession,
  renameSession,
  deleteSession,
};
