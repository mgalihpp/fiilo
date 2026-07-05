import { z } from "zod";

// Order matters: this is the invoice status workflow left-to-right.
export const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "CANCELLED"] as const;

export const invoiceItemInput = z.object({
  description: z.string().min(1),
  quantity: z.number().min(1).default(1),
  unitPrice: z.number().min(0).default(0),
});

export const invoiceInput = z.object({
  contactId: z.string().min(1),
  dealId: z.string().optional(),
  dueDate: z.string().optional(), // ISO date from the form
  // Tax as a percentage; the server derives the tax amount from the subtotal.
  taxRate: z.number().min(0).max(100).default(0),
  items: z.array(invoiceItemInput).min(1),
});

export const invoiceListInput = z.object({
  status: z.enum(INVOICE_STATUSES).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const invoiceIdInput = z.object({ id: z.string() });

export const invoiceStatusInput = z.object({
  id: z.string(),
  status: z.enum(INVOICE_STATUSES),
});

// Auto-invoice: generate a single-line invoice from a won deal.
export const invoiceFromDealInput = z.object({
  dealId: z.string(),
  taxRate: z.number().min(0).max(100).default(0),
  dueDate: z.string().optional(),
});

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
export type InvoiceInput = z.infer<typeof invoiceInput>;
export type InvoiceItemInput = z.infer<typeof invoiceItemInput>;
