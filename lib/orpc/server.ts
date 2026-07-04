import { exampleRouter } from "./procedures/example";

export const appRouter = {
  example: exampleRouter,
};

export type AppRouter = typeof appRouter;
