import { ORPCError } from "@orpc/server";
import { prisma } from "../../prisma";
import {
  contactIdInput,
  contactInput,
  contactListInput,
  contactUpdateInput,
} from "../../schemas/contact";
import { userProcedure } from "../context";

const list = userProcedure
  .input(contactListInput)
  .handler(async ({ input, context }) => {
    const where = {
      createdBy: context.user.id,
      ...(input.search
        ? {
            OR: [
              {
                name: { contains: input.search, mode: "insensitive" as const },
              },
              {
                email: { contains: input.search, mode: "insensitive" as const },
              },
              {
                company: {
                  contains: input.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.contact.count({ where }),
    ]);

    return { items, total };
  });

const get = userProcedure
  .input(contactIdInput)
  .handler(async ({ input, context }) => {
    const contact = await prisma.contact.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      include: { leads: { orderBy: { createdAt: "desc" } } },
    });
    if (!contact) throw new ORPCError("NOT_FOUND");
    return contact;
  });

const create = userProcedure
  .input(contactInput)
  .handler(async ({ input, context }) => {
    return prisma.contact.create({
      data: {
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        company: input.company || null,
        position: input.position || null,
        createdBy: context.user.id,
      },
    });
  });

const update = userProcedure
  .input(contactUpdateInput)
  .handler(async ({ input, context }) => {
    const owned = await prisma.contact.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!owned) throw new ORPCError("NOT_FOUND");

    return prisma.contact.update({
      where: { id: input.id },
      data: {
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        company: input.company || null,
        position: input.position || null,
      },
    });
  });

const remove = userProcedure
  .input(contactIdInput)
  .handler(async ({ input, context }) => {
    const owned = await prisma.contact.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!owned) throw new ORPCError("NOT_FOUND");

    await prisma.contact.delete({ where: { id: input.id } });
    return { id: input.id };
  });

export const contactsRouter = { list, get, create, update, remove };
