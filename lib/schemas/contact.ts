import { z } from "zod";

export const contactInput = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

export const contactListInput = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const contactIdInput = z.object({ id: z.string() });

export const contactUpdateInput = contactInput.extend({ id: z.string() });

export type ContactInput = z.infer<typeof contactInput>;
