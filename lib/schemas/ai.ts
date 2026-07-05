import { z } from "zod";

export const aiIdInput = z.object({ id: z.string().min(1) });

// Output shapes the model must fill (via generateObject).
export const leadScoreOutput = z.object({
  score: z.number().min(0).max(100),
  reasoning: z.string(),
});

export const dealForecastOutput = z.object({
  probability: z.number().min(0).max(100),
  risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
  reasoning: z.string(),
});

export const enrichOutput = z.object({
  industry: z.string(),
  companySize: z.string(),
  summary: z.string(),
  suggestedNextAction: z.string(),
});

export const suggestOutput = z.object({
  actions: z.array(z.string()).max(5),
});
