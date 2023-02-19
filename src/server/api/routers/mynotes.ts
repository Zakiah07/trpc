import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const notesRouter = createTRPCRouter({
  //create a note
  newNote: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(5, { message: "Must be 5 or more characters of length!" })
          .max(200, {
            message: "Must not be greater than 200 characters",
          })
          .trim(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.notes.create({
          data: {
            title: input.title,
            description: input.description,
          },
        });
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(`Notes cannot be created ${error.message as string}`);
      }
    }),
  allNotes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma?.notes?.findMany({
      select: {
        title: true,
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  detailNote: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        return await ctx.prisma.notes.findUnique({
          where: {
            id,
          },
        });
      } catch (error: any) {
        console.log(`Note detail not found ${error.message as string}`);
      }
    }),
  updateNote: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(5, { message: "Must be 5 or more characters of length!" })
          .max(200, {
            message: "Must not be more than 200 characters of length!",
          })
          .trim(),
        description: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        return await ctx.prisma.notes.update({
          where: {
            id,
          },
          data: {
            title: input.title,
            description: input.description,
          },
        });
      } catch (error: any) {
        console.log(`Note cannot be updated ${error.message as string}`);
      }
    }),
  deleteNote: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        return await ctx.prisma.notes.delete({
          where: {
            id,
          },
        });
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(`Note cannot be deleted ${error.message as string}`);
      }
    }),
});
