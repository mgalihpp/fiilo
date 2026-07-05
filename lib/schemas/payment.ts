import { z } from "zod";

export const PAYMENT_METHODS = [
  "CASH",
  "BANK_TRANSFER",
  "CARD",
  "OTHER",
] as const;

export const paymentListInput = z.object({
  invoiceId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const paymentInput = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().min(0.01),
  method: z.enum(PAYMENT_METHODS).default("BANK_TRANSFER"),
  reference: z.string().optional(),
});

// Bulk pay: mark several invoices paid in full in one action.
export const paymentBulkInput = z.object({
  invoiceIds: z.array(z.string()).min(1),
  method: z.enum(PAYMENT_METHODS).default("BANK_TRANSFER"),
});

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentInput = z.infer<typeof paymentInput>;
