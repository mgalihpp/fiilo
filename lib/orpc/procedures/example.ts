import { z } from "zod";
import { base, protectedProcedure } from "../context";

export const hello = base
  .input(z.object({ name: z.string() }))
  .handler(({ input }) => {
    return { message: `Hello ${input.name}!` };
  });

export const secretHello = protectedProcedure.handler(({ context }) => {
  return {
    message: `Hello user ${context.userId}! This is a protected endpoint.`,
  };
});

export const exampleRouter = {
  hello,
  secretHello,
};
