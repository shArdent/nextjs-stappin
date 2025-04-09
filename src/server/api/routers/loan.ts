import { z } from "zod";
import { adminProdecure, createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { LoanStatus } from "@prisma/client";

export const loanRouter = createTRPCRouter({
  borrow: privateProcedure
    .input(
      z.object({
        reqItems: z
          .array(
            z.object({
              id: z.string(),
              quantity: z.number(),
            }),
          )
          .nonempty(),
        returnedAt: z.date(),
        reason: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { reqItems, returnedAt, reason } = input;
      const reqItemIds = reqItems.map((item) => item.id);

      await db.$transaction(async (tx) => {
        const userId = user?.id as string;

        const dbItems: { id: string; quantity: number }[] =
          await tx.item.findMany({
            where: {
              id: {
                in: reqItemIds,
              },
            },
            select: {
              id: true,
              quantity: true,
            },
          });

        const dbItemMap = dbItems.reduce((map, item) => {
          map.set(item.id, item.quantity);
          return map;
        }, new Map<string, number>());

        for (const reqItem of reqItems) {
          const stock = dbItemMap.get(reqItem.id);
          if (!stock || stock < reqItem.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Terdapat barang yang tidak tersedia pada permintaan",
            });
          }
        }

        const { id: loanId } = await tx.loan.create({
          data: {
            userId: userId,
            reason,
            returnedAt,
          },
        });

        const loanItems = reqItems.map((item) => ({
          loanId,
          itemId: item.id,
          quantity: item.quantity,
        }));

        await tx.loanItem.createMany({
          data: loanItems,
        });

        await Promise.all(
          reqItems.map((item) =>
            tx.item.update({
              where: {
                id: item.id,
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
    }),

  approveLoanReq: adminProdecure
    .input(
      z.object({
        loanId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const adminId = user?.id;

      const loan = await db.loan.findUnique({ where: { id: input.loanId } });

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

      const verifiedLoan = await db.loan.update({
        where: {
          id: input.loanId,
        },
        data: {
          status: LoanStatus.APPROVED,
          verifiedBy: adminId,
        },
      });
      return verifiedLoan;
    }),

  rejectLoanReq: adminProdecure
    .input(
      z.object({
        loanId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const adminId = user?.id;
      const loan = await db.loan.findUnique({ where: { id: input.loanId } });

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

      const rejectedLoan = await db.loan.update({
        where: {
          id: input.loanId,
        },
        data: {
          status: LoanStatus.REJECTED,
          verifiedBy: adminId,
        },
      });

      return rejectedLoan;
    }),

  returnLoanReq: adminProdecure
    .input(
      z.object({
        loanId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const adminId = user?.id;
      await db.$transaction(async (tx) => {
        const loan = await tx.loan.findUnique({ where: { id: input.loanId } });
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
