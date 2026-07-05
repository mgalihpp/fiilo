import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { smartModel } from "@/lib/ai";
import { getAuthContext } from "@/lib/clerk-sync";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId: clerkId } = await getAuthContext();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const {
    messages,
    sessionId,
  }: { messages: UIMessage[]; sessionId?: string } = await req.json();

  if (!sessionId) return new Response("sessionId required", { status: 400 });

  const session = await prisma.aISession.findFirst({
    where: { id: sessionId, userId: user.id },
  });
  if (!session) return new Response("Session not found", { status: 404 });

  const lastMsg = messages[messages.length - 1];
  const lastText =
    lastMsg?.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p as any).text)
      .join("") ?? "";

  // Persist user message
  if (lastMsg?.role === "user" && lastText) {
    await prisma.aIMessage.create({
      data: { sessionId, role: "user", content: lastText },
    });
  }

  const result = streamText({
    model: smartModel,
    system:
      "You are Fiilo, a helpful CRM assistant. Answer questions about sales, " +
      "leads, deals and invoices concisely. If asked for data you don't have, " +
      "say so and suggest where in the app to find it.",
    messages: await convertToModelMessages(messages),
    onFinish: async (completion) => {
      await prisma.aIMessage.create({
        data: { sessionId, role: "assistant", content: completion.text },
      });
      if (session.title === "New Chat") {
        await prisma.aISession.update({
          where: { id: sessionId },
          data: { title: lastText.slice(0, 60) || "New Chat" },
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
