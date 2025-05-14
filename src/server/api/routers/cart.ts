import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
    getChartByUserId: privateProcedure.query(async ({ ctx }) => {
        const { user, db } = ctx;

        const cartItems = await db.cart.findMany({
            where: {
                userId: user?.id,
            },
            include: {
                item: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return {
            cartItems,
        };
    }),
    addToChart: privateProcedure
        .input(
            z.object({
                itemId: z.string(),
                quantity: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, user } = ctx;

            await db.$transaction(async (tx) => {
                const itemData = await tx.item.findUnique({
                    where: {
                        id: input.itemId,
                    },
                    select: {
                        id: true,
                        available: true,
                    },
                });

                if (
                    !itemData ||
                    itemData.available === 0 ||
                    itemData.available < input.quantity
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Barang tidak tersedia",
                    });
                }

                const existingCartItem = await tx.cart.findFirst({
                    where: {
                        userId: user!.id,
                        itemId: input.itemId,
                    },
                });

                if (existingCartItem) {
                    await tx.cart.update({
                        where: {
                            id: existingCartItem.id,
                        },
                        data: {
                            quantity: {
                                increment: input.quantity,
                            },
                        },
                    });
                } else {
                    await tx.cart.create({
                        data: {
                            quantity: input.quantity,
                            itemId: input.itemId,
                            userId: user!.id,
                        },
                    });
                }
            });
        }),

    incrementCartItem: privateProcedure
        .input(
            z.object({
                cartId: z.string(),
                increment: z.number(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { db } = ctx;

            await db.cart.update({
                where: {
                    id: input.cartId,
                },
                data: {
                    quantity: {
                        increment: input.increment,
                    },
                },
            });
        }),

    decrementCartItem: privateProcedure
        .input(
            z.object({
                cartId: z.string(),
                increment: z.number(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { db } = ctx;

            await db.cart.update({
                where: {
                    id: input.cartId,
                },
                data: {
                    quantity: {
                        decrement: input.increment,
                    },
                },
            });
        }),

    deleteCartItem: privateProcedure
        .input(
            z.object({
                cartId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;

            await db.cart.delete({
                where: {
                    id: input.cartId,
                },
            });
        }),
});
