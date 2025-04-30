import type { Prisma } from "@prisma/client";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { textStyle } from "~/lib/utils";
import { api } from "~/utils/api";

const TabelPeminjam = ({
    data,
}: {
    data?: Array<
        Prisma.LoanGetPayload<{
            include: {
                loanItems: {
                    include: {
                        item: true;
                    };
                };
                user: true;
            };
        }>
    >;
}) => {
    const util = api.useUtils();
    const { mutate: approve, isPending: approveIsPending } =
        api.loan.approveLoanReqById.useMutation({
            onSuccess: () => {
                toast.success("Berhasil menyetujui peminjaman");
                util.loan.getPendingLoan.invalidate();
            },
            onError: () => {
                toast.error("Gagal menyetujui peminjmaan");
            },
        });

    const { mutate: reject, isPending: rejectIsPending } =
        api.loan.rejectLoanReqById.useMutation({
            onSuccess: () => {
                toast.success("Berhasil menolak peminjaman");
                util.loan.getPendingLoan.invalidate();
            },
            onError: () => {
                toast.error("Gagal menolak peminjmaan");
            },
        });

    if (!data) return <Skeleton className="h-40 w-full" />;

    if (data && data.length === 0) {
        return (
            <div className="rounded-md border p-8 text-center">
                <p className="text-lg text-black">
                    Tidak ada data produk yang tersedia
                </p>
            </div>
        );
    }

    return (
        <table className="w-full border-separate border-spacing-0">
            <thead className="rounded bg-gray-200">
                <tr className="rounded">
                    <th className="w-[5%] rounded-tl-md border border-black p-2">
                        No
                    </th>
                    <th className="w-[30%] border border-black">
                        Nama Peminjam
                    </th>
                    <th className="border border-black">List Barang</th>
                    <th className="w-[20%] border border-black">
                        Status Peminjaman
                    </th>
                    <th className="w-[15%] rounded-tr-md border border-black">
                        Aksi
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white text-sm">
                {data.map((e, i) => (
                    <tr
                        key={e.id}
                        className={`border border-black text-center transition hover:bg-gray-300`}
                    >
                        <td className="border border-black p-2 text-center">
                            {i + 1}
                        </td>
                        <td className="border border-black p-2 text-center">
                            {e.user.name}
                        </td>
                        <td className="border border-black p-2 text-center">
                            <ol className="flex list-disc flex-col items-start pl-7 justify-center text-left">
                                {e.loanItems.map((loanItem) => (
                                    <li>{loanItem.item.name}</li>
                                ))}
                            </ol>
                        </td>
                        <td
                            className={`border border-black p-2 text-center ${textStyle(e.status)}`}
                        >
                            {e.status}
                        </td>
                        <td className="border border-black p-2 text-center">
                            <div className="w-ful flex justify-center gap-4">
                                <Button
                                    disabled={
                                        rejectIsPending || approveIsPending
                                    }
                                    onClick={() => approve(e.id)}
                                    className="bg-green-500 hover:bg-green-500/80"
                                >
                                    Setujui
                                </Button>
                                <Button
                                    disabled={
                                        rejectIsPending || approveIsPending
                                    }
                                    onClick={() => reject(e.id)}
                                    variant={"destructive"}
                                >
                                    Tolak
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TabelPeminjam;
