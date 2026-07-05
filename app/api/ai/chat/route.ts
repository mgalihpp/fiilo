import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { openrouter, smartModel } from "@/lib/ai";
import { getAuthContext } from "@/lib/clerk-sync";

// Streaming chat lives outside oRPC — a plain route handler is the native fit
// for the AI SDK's streamed response.
export async function POST(req: Request) {
  const { userId } = await getAuthContext();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: smartModel,
    system:
      "You are Fiilo, a helpful CRM assistant. Answer questions about sales, " +
      "leads, deals and invoices concisely. If asked for data you don't have, " +
      "say so and suggest where in the app to find it.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
