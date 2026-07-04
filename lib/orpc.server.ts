import "server-only";

import { createRouterClient, type RouterClient } from "@orpc/server";
import { getAuthContext } from "./clerk-sync";
import type { AppRouter } from "./orpc/server";
import { appRouter } from "./orpc/server";

declare global {
  var $client: RouterClient<AppRouter> | undefined;
}

globalThis.$client =
  globalThis.$client ??
  createRouterClient(appRouter, {
    context: getAuthContext,
  });
