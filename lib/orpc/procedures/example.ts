import { z } from "zod";
import { base } from "../context";

export const hello = base
  .input(z.object({ name: z.string() }))
  .handler(({ input }) => {
    return { message: `Hello ${input.name}!` };
  });

export const exampleRouter = {
  hello,
};
