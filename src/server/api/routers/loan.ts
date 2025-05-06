import { z } from "zod";
import { adminProdecure, createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { LoanStatus } from "@prisma/client";
import { resend } from "~/lib/resend";
import { pretty, render } from "@react-email/render";
import LoanConfirmationEmail from "~/components/emails/LoanConfirmationEmail";
import React from "react";
import LoanRejectionEmail from "~/components/emails/LoanRejectionEmail";

export const loanRouter = createTRPCRouter({
    getUserLoan: privateProcedure.query(async ({ ctx }) => {
        const { db, user } = ctx;

        const loanData = await db.loan.findMany({
            where: {
                userId: user?.id,
            },
            include: {
                loanItems: {
                    include: {
                        item: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return loanData;
    }),

    getLoanById: privateProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const { db } = ctx;

            const data = await db.loan.findUnique({
                where: {
                    id: input,
                },

                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    loanItems: {
                        include: {
                            item: true,
                        },
                    },
                },
            });

            return data;
        }),

    getPendingLoan: privateProcedure.query(async ({ ctx }) => {
        const { db } = ctx;

        const data = await db.loan.findMany({
            where: {
                status: LoanStatus.PENDING,
            },
            include: {
                loanItems: {
                    include: {
                        item: true,
                    },
                },
                user: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return data;
    }),

    getAllLoan: adminProdecure
        .input(
            z.object({
                nama: z.string().optional(),
                status: z
                    .enum([
                        LoanStatus.PENDING,
                        LoanStatus.APPROVED,
                        LoanStatus.REJECTED,
                        LoanStatus.RETURNED,
                    ])
                    .optional(),
                returnDate: z.date().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { db } = ctx;
            const { nama, status, returnDate } = input;
            const startOfDay = returnDate
                ? new Date(returnDate.setHours(0, 0, 0, 0))
                : undefined;
            const endOfDay = returnDate
                ? new Date(returnDate.setHours(23, 59, 59, 999))
                : undefined;

            const data = await db.loan.findMany({
                where: {
                    ...(status && { status }),
                    ...(returnDate && {
                        returnedAt: {
                            gte: startOfDay,
                            lte: endOfDay,
                        },
                    }),
                    ...(nama && {
                        user: {
                            name: {
                                contains: nama,
                            },
                        },
                    }),
                },
                include: {
                    loanItems: {
                        include: {
                            item: true,
                        },
                    },
                    user: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

            return data;
        }),

    borrow: privateProcedure
        .input(
            z.object({
                reqItems: z
                    .array(
                        z.object({
                            quantity: z.number(),
                            itemId: z.string(),
                        }),
                    )
                    .nonempty(),
                loan: z.object({
                    startAt: z.date(),
                    returnedAt: z.date(),
                    reason: z.string(),
                }),
            }),
        )
        .output(z.object({ loanId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { db, user } = ctx;
            const { reqItems, loan } = input;

            if (loan.startAt > loan.returnedAt) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "Tanggal pengembalian harus setelah tanggal peminjaman",
                });
            }

            const result = await db.$transaction(async (tx) => {
                const userId = user?.id as string;

                const reqItemIds = reqItems.map((e) => e.itemId);

                const { id: loanId } = await tx.loan.create({
                    data: {
                        userId: userId,
                        reason: loan.reason,
                        returnedAt: loan.returnedAt,
                        startAt: loan.startAt,
                    },
                });

                const dbItems = await tx.item.findMany({
                    where: {
                        id: {
                            in: reqItemIds,
                        },
                    },
                    select: {
                        id: true,
                        available: true,
                    },
                });

                const dbItemMap = new Map(
                    dbItems.map((item) => [item.id, item.available]),
                );

                console.log(dbItemMap);

                for (const reqItem of reqItems) {
                    const stock = dbItemMap.get(reqItem.itemId);
                    if (!stock || stock < reqItem.quantity) {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message:
                                "Terdapat barang yang tidak tersedia pada permintaan",
                        });
                    }
                }

                const loanItems = reqItems.map((item) => ({
                    loanId,
                    itemId: item.itemId,
                    quantity: item.quantity,
                }));

                await tx.loanItem.createMany({
                    data: loanItems,
                });

                await Promise.all(
                    reqItems.map((item) =>
                        tx.item.update({
                            where: {
                                id: item.itemId,
                            },
                            data: {
                                available: {
                                    decrement: item.quantity,
                                },
                            },
                        }),
                    ),
                );

                return { loanId };
            });

            return result;
        }),

    approveLoanReqById: adminProdecure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const { db, user } = ctx;
            const adminId = user?.id;

            const verifiedLoan = await db.$transaction(async (tx) => {
                const loan = await tx.loan.findUnique({
                    where: { id: input },
                    include: {
                        user: true,
                    },
                });

                if (!loan)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Peminjaman tidak ditemukan",
                    });

                if (loan.status !== LoanStatus.PENDING)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Peminjaman sudah diverifikasi",
                    });

                const verifiedLoan = await tx.loan.update({
                    where: {
                        id: input,
                    },
                    data: {
                        status: LoanStatus.APPROVED,
                        verifiedBy: adminId,
                    },
                });

                const html = await pretty(
                    await render(
                        React.createElement(LoanConfirmationEmail, {
                            loanId: loan.id,
                            userName: loan.user.name,
                        }),
                    ),
                );

                const { data, error } = await resend.emails.send({
                    from: "noreply@stapin.site",
                    to: [loan.user.email],
                    subject: "Pinjaman Dikonfirmasi",
                    html: html,
                });

                if (error) {
                    console.log(error);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Gagal mengirim email ke user",
                    });
                }

                return verifiedLoan;
            });

            return verifiedLoan;
        }),

    rejectLoanReqById: adminProdecure
        .input(
            z.object({
                loanId: z.string(),
                alasan: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { db, user } = ctx;
            const { loanId, alasan } = input;
            const adminId = user?.id;

            const rejected = await db.$transaction(async (tx) => {
                const loan = await tx.loan.findUnique({
                    where: { id: loanId },
                    include: {
                        loanItems: true,
                        user: true,
                    },
                });
                if (!loan)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Peminjaman tidak ditemukan",
                    });

                if (loan.status !== LoanStatus.PENDING)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Peminjaman sudah diverifikasi",
                    });

                await Promise.all(
                    loan.loanItems.map((item) =>
                        tx.item.update({
                            where: {
                                id: item.itemId,
                            },
                            data: {
                                available: {
                                    increment: item.quantity,
                                },
                            },
                        }),
                    ),
                );

                const rejectedLoan = await tx.loan.update({
                    where: {
                        id: loanId,
                    },
                    data: {
                        status: LoanStatus.REJECTED,
                        verifiedBy: adminId,
                    },
                });

                const html = await pretty(
                    await render(
                        React.createElement(LoanRejectionEmail, {
                            loanId: loan.id,
                            userName: loan.user.name,
                            alasan: alasan,
                        }),
                    ),
                );

                const { data, error } = await resend.emails.send({
                    from: "noreply@stapin.site",
                    to: [loan.user.email],
                    subject: "Pinjaman Ditolak",
                    html: html,
                });

                if (error) {
                    console.log(error);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Gagal mengirim email ke user",
                    });
                }

                return rejectedLoan;
            });

            return rejected;
        }),

    returnLoanReqById: adminProdecure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const { db, user } = ctx;
            const adminId = user?.id;
            await db.$transaction(async (tx) => {
                const loan = await tx.loan.findUnique({
                    where: { id: input },
                });
                if (!loan)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Peminjaman tidak ditemukan",
                    });

                if (loan.status !== LoanStatus.APPROVED)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Status peminjaman tidak valid",
                    });
                const loanItems = await tx.loanItem.findMany({
                    where: {
                        loanId: loan.id,
                    },
                });

                await Promise.all(
                    loanItems.map((item) =>
                        tx.item.update({
                            where: {
                                id: item.itemId,
                            },
                            data: {
                                available: {
                                    increment: item.quantity,
                                },
                            },
                        }),
                    ),
                );

                const updatedLoan = await tx.loan.update({
                    where: {
                        id: loan.id,
                    },
                    data: {
                        status: LoanStatus.RETURNED,
                        verifiedBy: adminId,
                    },
                });

                return updatedLoan;
            });
        }),
});
