import { z } from "zod";

// Order matters: this is the left-to-right column order on the Kanban board.
export const DEAL_STAGES = [
  "DISCOVERY",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export const dealInput = z.object({
  title: z.string().min(1),
  leadId: z.string().optional(),
  stage: z.enum(DEAL_STAGES).default("DISCOVERY"),
  value: z.number().min(0).default(0),
  currency: z.string().default("USD"),
  probability: z.number().min(0).max(100).default(0),
  expectedCloseDate: z.string().optional(), // ISO date from the form
});

export const dealListInput = z.object({
  stage: z.enum(DEAL_STAGES).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const dealIdInput = z.object({ id: z.string() });

export const dealUpdateInput = dealInput.partial().extend({ id: z.string() });

// Kanban drag-drop only changes the stage.
export const dealMoveInput = z.object({
  id: z.string(),
  stage: z.enum(DEAL_STAGES),
});

export type DealStage = (typeof DEAL_STAGES)[number];
export type DealInput = z.infer<typeof dealInput>;
