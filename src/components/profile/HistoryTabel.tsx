import { format } from "date-fns";
import { id } from "date-fns/locale";
import React from "react";
import { textStyle } from "~/lib/utils";
import { api } from "~/utils/api";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/router";

const HistoryTabel = () => {
    const router = useRouter();
    const { data, isPending } = api.loan.getUserLoan.useQuery();

    if (isPending) return <Skeleton className="h-40 w-full" />;

    if (!data || data.length === 0) return <h1>Belum ada data</h1>;

    console.log(data);

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
                    <th className="w-[10%] border border-black">
                        Tanggal Peminjaman
                    </th>
                    <th className="w-[10%] border border-black">
                        Tanggal Pengembalian
                    </th>
                    <th className="w-[10%] border border-black">List Barang</th>
                    <th className="w-[10%] border border-black">
                        Jumlah Barang
                    </th>
                    <th className="w-[10%] rounded-tr-md border border-black">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white text-sm">
                {data.map((e, i) => (
                    <tr
                        onClick={() => router.push(`/loan/${e.id}`)}
                        key={e.id}
                        className={`border border-black text-center transition hover:bg-gray-300 cursor-pointer`}
                    >
                        <td className="border border-black p-2 text-center">
                            {i + 1}
                        </td>
                        <td className="border border-black p-2 text-center">
                            {e.user.name}
                        </td>
                        <td className="border border-black p-2 text-center">
                            {format(e.startAt, "d MMMM yyyy", {
                                locale: id,
                            })}
                        </td>
                        <td className="border border-black p-2 text-center">
                            {format(e.returnedAt, "d MMMM yyyy", {
                                locale: id,
                            })}
                        </td>
                        <td className="border border-black p-2 text-center">
                            <ol className="flex list-disc flex-col items-start justify-center pl-5 text-left">
                                {e.loanItems.map((loanItem) => (
                                    <li key={loanItem.id}>
                                        {loanItem.quantity}x{" "}
                                        {loanItem.item.name}
                                    </li>
                                ))}
                            </ol>
                        </td>
                        <td className="border border-black p-2 text-center">
                            {e.loanItems.reduce(
                                (total, item) => total + item.quantity,
                                0,
                            )}
                        </td>
                        <td
                            className={`border border-black p-2 text-center ${textStyle(e.status)}`}
                        >
                            {e.status}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default HistoryTabel;
