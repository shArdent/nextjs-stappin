import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { supabaseDefaultClient } from "~/lib/supabase/client";
import { createServerClient } from "@supabase/ssr";
import { env } from "~/env";

export const authRouter = createTRPCRouter({
    register: publicProcedure
        .input(
            z.object({
                name: z.string(),
                email: z.string().email().toLowerCase(),
                password: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            const { email, password, name } = input;

            await db.$transaction(async (tx) => {
                let userId = "";

                try {
                    const { data, error } =
                        await supabaseDefaultClient.auth.signUp({
                            email,
                            password,
                        });

                    if (data.user) {
                        userId = data.user.id;
                    }

                    if (error) throw error;

                    await tx.user.create({
                        data: {
                            id: userId,
                            email,
                            name,
                            password,
                        },
                    });
                } catch (error) {
                    console.log(error);
                    await supabaseAdminClient.auth.admin.deleteUser(userId);
                }
            });
        }),
    getUser: privateProcedure.query(async ({ ctx }) => {
        const { db, user } = ctx;

        const data = db.user.findUnique({
            where: {
                id: user?.id,
            },
        });

        return data;
    }),

    updateUser: privateProcedure
        .input(
            z.object({
                name: z.string().nonempty(),
                email: z.string().email(),
                phone: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, user } = ctx;

            console.log(input);

            const data = await db.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    name: input.name,
                    email: input.email,
                    phone: input.phone,
                },
            });
        }),

    logoutUser: privateProcedure.mutation(async ({ ctx, input }) => {
        const { sbServer } = ctx;

        await sbServer.auth.signOut();
    }),
});
