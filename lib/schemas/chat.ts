import { z } from "zod";

export const chatSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  lastMessage: z.string().nullable(),
  createdAt: z.date(),
});

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.string(),
  content: z.string(),
  createdAt: z.date(),
});
