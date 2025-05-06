import { LoanStatus, type Prisma } from "@prisma/client";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import React from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { textStyle } from "~/lib/utils";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";

const TabelRekapPinjaman = ({
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

    const router = useRouter();

    const { mutate: done, isPending: doneIsPending } =
        api.loan.returnLoanReqById.useMutation({
            onSuccess: () => {
                toast.success("Berhasil menyelesaikan peminjaman");
                util.loan.getAllLoan.invalidate();
            },
            onError: () => {
                toast.error("Berhasil menyelesaikan peminjaman");
            },
        });

    if (!data) return <Skeleton className="h-40 w-full" />;

    if (data && data.length === 0) {
        return (
            <div className="rounded-md border p-8 text-center">
                <p className="text-lg text-black">
                    Tidak ada data yang tersedia
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
                    <th className="w-[20%] border border-black">
                        Nama Peminjam
                    </th>
                    <th className="border border-black">Alasan Peminjaman</th>
                    <th className="w-[20%] border border-black">List Barang</th>
                    <th className="w-[10%] border border-black">Status</th>
                    <th className="w-[10%] border border-black">Tgl Kembali</th>
                    <th className="w-[10%] rounded-tr-md border border-black">
                        Aksi
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white text-sm">
                {data.map((e, i) => (
                    <tr
                        onClick={() => router.push(`/loan/${e.id}`)}
                        key={e.id}
                        className={`cursor-pointer border border-black text-center transition hover:bg-gray-300`}
                    >
                        <td className="border border-black p-2 text-center">
                            {i + 1}
                        </td>
                        <td className="border border-black p-2 text-center">
                            {e.user.name}
                        </td>
                        <td className="border border-black p-2 text-center">
                            {e.reason}
                        </td>
                        <td className="border border-black p-2 text-left">
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
                            {format(e.returnedAt, "d MMMM yyyy", {
                                locale: id,
                            })}
                        </td>
                        <td className="border border-black p-2 text-center">
                            <div className="w-ful flex justify-center gap-4">
                                <Button
                                    disabled={
                                        doneIsPending ||
                                        e.status !== LoanStatus.APPROVED
                                    }
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        done(e.id);
                                    }}
                                    className="bg-green-500 font-semibold hover:bg-green-500/80"
                                >
                                    Selesai
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TabelRekapPinjaman;
