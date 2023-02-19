import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const notesRouter = createTRPCRouter({
    //create a note
    newNote: publicProcedure
    .input(
        z.object({
            title: z
            .string()
            .min(5, {message: "Must be 5 or more characters of length!"}
            .max(200, {
                message: "Must not be greater than 200 characters"
            }))
            .trim(),
            description: z.string()
        })
    )
    .mutation(async ({ctx, input} => {
        try{
            return await ctx.prisma.notes.create({
                data: {
                    title: input.title,
                    description: input.description
                }
            })
            catch(error){
                console.log(`Notes cannot be created ${error}`)
            }
        }
    }))
})
