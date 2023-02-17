import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const subscribeRouter = createTRPCRouter({
  sub: publicProcedure
    .input(
      z.object({
        text: z
          .string()
          .min(5, { message: "Must be 5 or more characters of length" }),
      })
    )
    .query(({ input }) => {
      return {
        pleaseSub: `Please do subscribe to: ${input?.text}`,
      };
    }),
});
