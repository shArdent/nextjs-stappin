import { z } from "zod";
import { adminProdecure, createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { LoanStatus } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";

export const itemRouter = createTRPCRouter({
    addNewItem: adminProdecure
        .input(
            z.object({
                name: z.string({ message: "Harus berupa string" }),
                description: z.string({ message: "Harus berupa string" }),
                quantity: z
                    .number({ message: "Harus Berupa angka" })
                    .positive({ message: "Harus lebih dari 0" }),
                image: z.string({
                    message: "Gambar dikirim harus sudah berupa string",
                }),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;

            const exist = await db.item.findFirst({
                where: {
                    name: input.name,
                },
                select: {
                    id: true,
                },
            });

            if (exist)
                throw new TRPCError({
                    code: "CONFLICT",
                    message: `Barang dengan nama ${input.name} sudah ada`,
                });

            const newItem = await db.item.create({
                data: {
                    name: input.name,
                    description: input.description,
                    quantity: input.quantity,
                    available: input.quantity,
                },
            });

            const timestamp = new Date().getTime().toString();
            const fileName = `item-${newItem.id}.jpg`;

            if (input.image) {
                const pureBase64 = input.image.split(",")[1];
                const buffer = Buffer.from(pureBase64 as string, "base64");

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

                const itemImageUrl = supabaseAdminClient.storage
                    .from("item-image")
                    .getPublicUrl(data.path);

                const updatedItem = await db.item.update({
                    where: {
                        id: newItem.id,
                    },
                    data: {
                        imageUrl:
                            itemImageUrl.data.publicUrl + "?t=" + timestamp,
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
                quantity: z.number(),
                description: z.string(),
                available: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            const { itemId, name, description, quantity, available } = input;

            const dbItem = await db.item.findUnique({
                where: {
                    id: itemId,
                },
                select: {
                    id: true,
                    available: true,
                    quantity: true,
                },
            });

            if (!dbItem)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Barang dengan id ${itemId} tidak ditemukan`,
                });

            if (quantity < dbItem.available) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "Kuantitas tidak boleh kurang dari barang tersedia",
                });
            }

            const updatedItem = await db.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    name,
                    description,
                    quantity,
                    available: available,
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
                    orderBy: {
                        createdAt: "asc",
                    },
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

    getDashboard: adminProdecure.query(async ({ ctx }) => {
        const { db, user } = ctx;

        const result = await db.$transaction(async (tx) => {
            const [
                loanCount,
                itemCount,
                loanPendingCount,
                loansPerMonth,
                loanItems,
            ] = await Promise.all([
                tx.loan.aggregate({
                    _count: true,
                }),
                tx.item.aggregate({
                    _count: true,
                }),
                tx.loan.aggregate({
                    where: {
                        status: LoanStatus.PENDING,
                    },
                    _count: true,
                }),
                tx.loan.groupBy({
                    by: ["startAt"],
                    _count: {
                        id: true,
                    },
                    orderBy: {
                        startAt: "asc",
                    },
                }),
                tx.loanItem.findMany({
                    include: {
                        item: true,
                        loan: true,
                    },
                }),
            ]);

            const loansGroupedByMonthArray = Object.entries(
                loansPerMonth.reduce(
                    (acc, loan) => {
                        const date = new Date(loan.startAt);
                        const month = date.toLocaleString("default", {
                            month: "long",
                        });
                        const year = date.getFullYear();
                        const key = `${month} ${year}`;

                        acc[key] = (acc[key] || 0) + loan._count.id;
                        return acc;
                    },
                    {} as Record<string, number>,
                ),
            )
                .map(([month, count]) => ({ month, count }))
                .sort((a, b) =>
                    new Date(`1 ${a.month}`) > new Date(`1 ${b.month}`)
                        ? 1
                        : -1,
                );

            const frequencyItemPerMonthArray = Object.entries(
                loanItems.reduce(
                    (acc, loanItem) => {
                        const date = new Date(loanItem.loan.startAt);
                        const month = date.toLocaleString("default", {
                            month: "long",
                        });
                        const year = date.getFullYear();
                        const key = `${month} ${year}`;

                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                    },
                    {} as Record<string, number>,
                ),
            )
                .map(([month, count]) => ({ month, count }))
                .sort((a, b) =>
                    new Date(`1 ${a.month}`) > new Date(`1 ${b.month}`)
                        ? 1
                        : -1,
                );

            return {
                loanCount,
                itemCount,
                loanPendingCount,
                loansGroupedByMonthArray,
                frequencyItemPerMonthArray,
            };
        });

        return result;
    }),

    itemPerMonth: adminProdecure
        .input(z.date())
        .query(async ({ ctx, input }) => {
            const { db } = ctx;

            const start = startOfMonth(input);
            const end = endOfMonth(input);

            const data = await db.loanItem.groupBy({
                by: ["itemId"],
                where: {
                    loan: {
                        startAt: {
                            gte: start,
                            lte: end,
                        },
                    },
                },
                _sum: {
                    quantity: true,
                },
            });

            const results = await Promise.all(
                data.map(async (group) => {
                    const item = await db.item.findUnique({
                        where: { id: group.itemId },
                        select: { name: true },
                    });

                    return {
                        itemId: group.itemId,
                        name: item?.name ?? "Unknown",
                        quantity: group._sum.quantity ?? 0,
                    };
                }),
            );

            return results;
        }),
});
