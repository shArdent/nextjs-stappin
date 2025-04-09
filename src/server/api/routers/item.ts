import { z } from "zod";
import { adminProdecure, createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "~/lib/supabase/server";

export const itemRouter = createTRPCRouter({
    addNewItem: adminProdecure
        .input(
            z.object({
                image: z.string().base64(),
                name: z.string(),
                description: z.string().optional(),
                quantity: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;

            const exist = await db.item.findFirst({
                where: {
                    name: input.name,
                },
            });

            if (exist?.name === input.name)
                throw new TRPCError({
                    code: "CONFLICT",
                    message: `Barang dengan nama ${input.name} sudah ada`,
                });

            const newItem = await db.item.create({
                data: {
                    name: input.name,
                    quantity: input.quantity,
                    available: input.quantity,
                },
            });
            const timestamp = new Date().getTime().toString();
            const fileName = `avatar-${newItem.id}.jpg`;

            if (input.image) {
                const buffer = Buffer.from(input.image, "base64");

                const { data, error } = await supabaseAdminClient.storage
                    .from("item-image")
                    .upload(fileName, buffer, {
                        contentType: "image/jpg",
                        upsert: true,
                    });

                if (error)
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        cause: error,
                    });

                const profilePictureUrl = supabaseAdminClient.storage
                    .from("item-image")
                    .getPublicUrl(data.path);

                const updatedItem = await db.item.update({
                    where: {
                        id: newItem.id,
                    },
                    data: {
                        imageUrl:
                            profilePictureUrl.data.publicUrl +
                            "?t=" +
                            timestamp,
                    },
                });

                return updatedItem;
            }

            return newItem;
        }),

    modifyItemQuantity: adminProdecure
        .input(
            z.object({
                itemId: z.string(),
                quantity: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            const { itemId, quantity } = input;

            await db.$transaction(async (tx) => {
                const dbItem = await tx.item.findUnique({
                    where: {
                        id: input.itemId,
                    },
                });

                if (!dbItem)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: `Barang dengan id ${input.itemId} tidak ditemukan`,
                    });

                if (quantity < 0 && dbItem.quantity + quantity < 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Stok barang tidak mencukupi",
                    });
                }

                const updatedItem = await tx.item.update({
                    where: {
                        id: itemId,
                    },
                    data: {
                        quantity: {
                            increment: Math.abs(quantity),
                        },
                    },
                });

                return updatedItem;
            });
        }),

    modifyItem: adminProdecure
        .input(
            z.object({
                itemId: z.string(),
                name: z.string(),
                description: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            const { itemId, name, description } = input;

            const dbItem = await db.item.findUnique({
                where: {
                    id: itemId,
                },
            });

            if (!dbItem)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Barang dengan id ${itemId} tidak ditemukan`,
                });

            const updatedItem = await db.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    name,
                    description,
                },
            });

            return updatedItem;
        }),

    deleteItem: adminProdecure
        .input(
            z.object({
                itemId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            const { itemId } = input;

            const deletedItem = await db.item.delete({
                where: {
                    id: itemId,
                },
            });

            return deletedItem;
        }),

    getItems: privateProcedure
        .input(
            z.object({
                query: z.string().optional(),
                page: z.number().default(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { db } = ctx;
            const { query, page } = input;
            const skip = page * 10;

            const [items, totalItems] = await Promise.all([
                db.item.findMany({
                    skip,
                    take: 10,
                    where: query
                        ? { name: { contains: query, mode: "insensitive" } }
                        : undefined,
                }),
                db.item.count({
                    where: query
                        ? { name: { contains: query, mode: "insensitive" } }
                        : undefined,
                }),
            ]);

            return {
                items,
                totalItems,
                totalPages: Math.ceil(totalItems / 10),
                currentPage: page,
            };
        }),
});
