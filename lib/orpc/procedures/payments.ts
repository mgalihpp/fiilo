import { ORPCError } from "@orpc/server";
import { prisma } from "../../prisma";
import {
  paymentBulkInput,
  paymentInput,
  paymentListInput,
} from "../../schemas/payment";
import { userProcedure } from "../context";

// Confirm the caller owns the invoice a payment targets.
async function assertOwnsInvoice(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, createdBy: userId },
    select: { id: true, total: true },
  });
  if (!invoice)
    throw new ORPCError("NOT_FOUND", { message: "Invoice not found" });
  return invoice;
}

// After a payment, flip the invoice to PAID once payments cover the total.
async function syncInvoiceStatus(invoiceId: string, total: number) {
  const agg = await prisma.payment.aggregate({
    where: { invoiceId },
    _sum: { amount: true },
  });
  const paid = agg._sum.amount ?? 0;
  if (paid >= total) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "PAID" },
    });
  }
}

const list = userProcedure
  .input(paymentListInput)
  .handler(async ({ input, context }) => {
    // Scope to invoices the caller owns.
    const where = {
      invoice: { createdBy: context.user.id },
      ...(input.invoiceId ? { invoiceId: input.invoiceId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          invoice: {
            select: {
              id: true,
              total: true,
              contact: { select: { name: true } },
            },
          },
        },
        orderBy: { paidAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.payment.count({ where }),
    ]);

    return { items, total };
  });

const create = userProcedure
  .input(paymentInput)
  .handler(async ({ input, context }) => {
    const invoice = await assertOwnsInvoice(input.invoiceId, context.user.id);

    const payment = await prisma.payment.create({
      data: {
        invoiceId: input.invoiceId,
        amount: input.amount,
        method: input.method,
        reference: input.reference || null,
      },
    });

    await syncInvoiceStatus(invoice.id, invoice.total);
    return payment;
  });

// Bulk pay: record a full-amount payment for each selected unpaid invoice.
const bulkPay = userProcedure
  .input(paymentBulkInput)
  .handler(async ({ input, context }) => {
    const invoices = await prisma.invoice.findMany({
      where: {
        id: { in: input.invoiceIds },
        createdBy: context.user.id,
        status: { not: "PAID" },
      },
      select: { id: true, total: true },
    });

    for (const inv of invoices) {
      await prisma.payment.create({
        data: { invoiceId: inv.id, amount: inv.total, method: input.method },
      });
      await prisma.invoice.update({
        where: { id: inv.id },
        data: { status: "PAID" },
      });
    }

    return { paid: invoices.length };
  });

export const paymentsRouter = { list, create, bulkPay };
