import { z } from "zod";

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "WON",
  "LOST",
] as const;

export const leadInput = z.object({
  contactId: z.string().min(1),
  status: z.enum(LEAD_STATUSES).default("NEW"),
  score: z.number().min(0).max(100).default(0),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export const leadListInput = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const leadIdInput = z.object({ id: z.string() });

export const leadUpdateInput = leadInput.partial().extend({ id: z.string() });

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadInput = z.infer<typeof leadInput>;
