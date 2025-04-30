import type { Prisma } from "@prisma/client";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const ItemTable = ({
    data,
}: {
    data?:
        | Array<Prisma.CartGetPayload<{ include: { item: true } }>>
        | Array<Prisma.LoanItemGetPayload<{ include: { item: true } }>>;
}) => {
    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-lg font-medium">Daftar barang dipinjam</h1>

            {data ? (
                <table className="w-full border-separate border-spacing-0">
                    <thead className="bg-background rounded">
                        <tr className="rounded">
                            <th className="w-[5%] rounded-tl-md border border-black p-2">
                                No
                            </th>
                            <th className="border border-black">Nama Barang</th>
                            <th className="rounded-tr-md border border-black">
                                Jumlah
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((e, i) => (
                            <tr
                                key={e.id}
                                className={`border border-black transition hover:bg-gray-300`}
                            >
                                <td className="border border-black p-2 text-center">
                                    {i + 1}
                                </td>
                                <td className="border border-black p-2 text-center">
                                    {e.item.name}
                                </td>
                                <td className="border border-black p-2 text-center">
                                    {e.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <Skeleton className="h-20 w-full rounded-md" />
            )}
        </div>
    );
};

export default ItemTable;
