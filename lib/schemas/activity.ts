import { z } from "zod";

export const activityListInput = z.object({
  leadId: z.string().optional(),
  dealId: z.string().optional(),
});

export const activityCreateInput = z.object({
  leadId: z.string().optional(),
  dealId: z.string().optional(),
  type: z.string().min(1),
  description: z.string().min(1),
  scheduledAt: z.coerce.date().optional(),
});

export type ActivityCreateInput = z.infer<typeof activityCreateInput>;
