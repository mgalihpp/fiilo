import { z } from "zod";

// Order matters: this is the left-to-right column order on the task board.
export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

// Order matters: low → urgent, used for sorting and colour ramps.
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const taskInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).default("TODO"),
  priority: z.enum(TASK_PRIORITIES).default("MEDIUM"),
  dueDate: z.string().optional(), // ISO date from the form
  leadId: z.string().optional(),
  dealId: z.string().optional(),
});

export const taskListInput = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const taskIdInput = z.object({ id: z.string() });

export const taskUpdateInput = taskInput.partial().extend({ id: z.string() });

// Board drag-drop only changes the status.
export const taskMoveInput = z.object({
  id: z.string(),
  status: z.enum(TASK_STATUSES),
});

// Checkbox toggle: DONE ↔ TODO, stamping completedAt accordingly.
export const taskToggleInput = z.object({
  id: z.string(),
  done: z.boolean(),
});

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskInput = z.infer<typeof taskInput>;
