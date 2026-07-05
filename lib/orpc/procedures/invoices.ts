import { ORPCError } from "@orpc/server";
import { prisma } from "../../prisma";
import {
  invoiceFromDealInput,
  invoiceIdInput,
  invoiceInput,
  invoiceListInput,
  invoiceStatusInput,
} from "../../schemas/invoice";
import { userProcedure } from "../context";

type LineItem = { description: string; quantity: number; unitPrice: number };

// Single source of truth for money math so list/detail/create agree.
function computeTotals(items: LineItem[], taxRate: number) {
  const lines = items.map((i) => ({
    description: i.description,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    amount: i.quantity * i.unitPrice,
  }));
  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  return { lines, subtotal, tax, total: subtotal + tax };
}

// Confirm the caller owns the contact before attaching it to an invoice.
async function assertOwnsContact(contactId: string, userId: string) {
  const owned = await prisma.contact.findFirst({
    where: { id: contactId, createdBy: userId },
    select: { id: true },
  });
  if (!owned)
    throw new ORPCError("NOT_FOUND", { message: "Contact not found" });
}

const list = userProcedure
  .input(invoiceListInput)
  .handler(async ({ input, context }) => {
    const where = {
      createdBy: context.user.id,
      ...(input.status ? { status: input.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          contact: { select: { name: true, company: true } },
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.invoice.count({ where }),
    ]);

    return { items, total };
  });

const stats = userProcedure.handler(async ({ context }) => {
  const invoices = await prisma.invoice.findMany({
    where: { createdBy: context.user.id },
    select: { status: true, total: true, dueDate: true },
  });

  const now = new Date();
  const paid = invoices.filter((i) => i.status === "PAID");
  const outstanding = invoices.filter(
    (i) => i.status === "SENT" || i.status === "DRAFT",
  );
  const overdue = outstanding.filter((i) => i.dueDate && i.dueDate < now);

  return {
    totalInvoices: invoices.length,
    paidValue: paid.reduce((sum, i) => sum + i.total, 0),
    outstandingValue: outstanding.reduce((sum, i) => sum + i.total, 0),
    overdueCount: overdue.length,
  };
});

const get = userProcedure
  .input(invoiceIdInput)
  .handler(async ({ input, context }) => {
    const invoice = await prisma.invoice.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      include: {
        contact: true,
        deal: { select: { id: true, title: true } },
        items: true,
        payments: { orderBy: { paidAt: "desc" } },
      },
    });
    if (!invoice) throw new ORPCError("NOT_FOUND");
    return invoice;
  });

const create = userProcedure
  .input(invoiceInput)
  .handler(async ({ input, context }) => {
    await assertOwnsContact(input.contactId, context.user.id);
    const { lines, subtotal, tax, total } = computeTotals(
      input.items,
      input.taxRate,
    );

    return prisma.invoice.create({
      data: {
        contactId: input.contactId,
        dealId: input.dealId || null,
        status: "DRAFT",
        subtotal,
        tax,
        total,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        createdBy: context.user.id,
        items: { create: lines },
      },
      include: { items: true },
    });
  });

// Generate a single-line invoice from a won deal (Deal.invoice is unique).
const createFromDeal = userProcedure
  .input(invoiceFromDealInput)
  .handler(async ({ input, context }) => {
    const deal = await prisma.deal.findFirst({
      where: { id: input.dealId, createdBy: context.user.id },
      include: {
        invoice: { select: { id: true } },
        lead: { select: { contactId: true } },
      },
    });
    if (!deal) throw new ORPCError("NOT_FOUND", { message: "Deal not found" });
    if (deal.invoice) {
      throw new ORPCError("CONFLICT", {
        message: "This deal already has an invoice",
      });
    }
    if (!deal.lead?.contactId) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Link the deal to a lead/contact before invoicing",
      });
    }

    const { lines, subtotal, tax, total } = computeTotals(
      [{ description: deal.title, quantity: 1, unitPrice: deal.value }],
      input.taxRate,
    );

    return prisma.invoice.create({
      data: {
        contactId: deal.lead.contactId,
        dealId: deal.id,
        status: "DRAFT",
        subtotal,
        tax,
        total,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        createdBy: context.user.id,
        items: { create: lines },
      },
      include: { items: true },
    });
  });

const updateStatus = userProcedure
  .input(invoiceStatusInput)
  .handler(async ({ input, context }) => {
    const owned = await prisma.invoice.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!owned) throw new ORPCError("NOT_FOUND");

    return prisma.invoice.update({
      where: { id: input.id },
      data: { status: input.status },
    });
  });

const remove = userProcedure
  .input(invoiceIdInput)
  .handler(async ({ input, context }) => {
    const owned = await prisma.invoice.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      select: { id: true },
    });
    if (!owned) throw new ORPCError("NOT_FOUND");

    // Clear child rows first (MongoDB connector has no cascading deletes).
    await prisma.payment.deleteMany({ where: { invoiceId: input.id } });
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: input.id } });
    await prisma.invoice.delete({ where: { id: input.id } });
    return { id: input.id };
  });

export const invoicesRouter = {
  list,
  stats,
  get,
  create,
  createFromDeal,
  updateStatus,
  remove,
};
