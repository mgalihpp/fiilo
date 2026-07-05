"use client";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterUtils } from "@orpc/tanstack-query";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "./server";

declare global {
  var $client: RouterClient<AppRouter> | undefined;
}

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }
    return `${window.location.origin}/api/rpc`;
  },
});

const rawClient: RouterClient<AppRouter> =
  globalThis.$client ?? createORPCClient(link);

export const orpc = createRouterUtils(rawClient);
export type Client = RouterClient<AppRouter>;
