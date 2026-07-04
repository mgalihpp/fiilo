import { RPCHandler } from "@orpc/server/fetch";
import { getAuthContext } from "@/lib/clerk-sync";
import { appRouter } from "@/lib/orpc/server";

const handler = new RPCHandler(appRouter);

async function handleRequest(request: Request) {
  const context = await getAuthContext();

  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context,
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
