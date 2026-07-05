import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Single OpenRouter client. Swap the model string per call to change providers
// (e.g. "openai/gpt-4o-mini", "anthropic/claude-haiku-4.5").
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

// Cheap default for structured CRM tasks (scoring, forecast, enrichment).
export const smartModel = openrouter("openrouter/free");
