import { format } from "date-fns";
import { useRouter } from "next/router";
import React from "react";

import { id } from "date-fns/locale";
import UserLayout from "~/components/layout/UserLayout";
import ItemTable from "~/components/loan-confirm/ItemTable";
import { api } from "~/utils/api";
import { CalendarIcon } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { textStyle } from "~/lib/utils";

const loanDetail = () => {
    const router = useRouter();

    const loanId = router.query.id;

    const { data } = api.loan.getLoanById.useQuery(loanId as string);

    return (
        <UserLayout>
            <h1 className="text-xl font-bold">
                Detail Peminjaman ID: {loanId}
            </h1>

            {data ? (
                <div className="flex w-full gap-10">
                    <div className="flex w-full flex-col gap-2">
                        <h1 className="font-semibold">Nama</h1>
                        <div className="flex h-12 w-full items-center justify-start gap-3 rounded-sm border border-black px-4 text-left text-sm font-normal">
                            <h1>{data.user.name}</h1>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <h1 className="font-semibold">Email</h1>
                        <div className="flex h-12 w-full items-center justify-start gap-3 rounded-sm border border-black px-4 text-left text-sm font-normal">
                            <h1>{data.user.email}</h1>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <h1 className="font-semibold">No Telepon</h1>
                        <div className="flex h-12 w-full items-center justify-start gap-3 rounded-sm border border-black px-4 text-left text-sm font-normal">
                            <h1>{data.user.phone}</h1>
                        </div>
                    </div>
                </div>
            ) : (
                <Skeleton className="h-12 w-full" />
            )}
            <ItemTable data={data?.loanItems} />
            <div className="flex w-full flex-col gap-5">
                <h1 className="text-lg font-medium">Tujuan Peminjaman</h1>
                {data ? (
                    <textarea
                        name="reason"
                        id="reason"
                        onChange={() => {}}
                        disabled
                        value={data.reason}
                        className="h-20 w-full resize-none rounded border border-black p-2"
                        placeholder="Tujuan peminjaman barang"
                    ></textarea>
                ) : (
                    <Skeleton className="h-20 w-full" />
                )}
            </div>

            <div className="flex w-full gap-10">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-lg font-medium">Tanggal Peminjaman</h1>
                    {data ? (
                        <div className="flex h-12 w-full items-center justify-start gap-3 rounded-sm border border-black px-4 text-left text-sm font-normal">
                            <CalendarIcon size={16} />
                            {format(data.startAt, "d MMMM yyyy", {
                                locale: id,
                            })}
                        </div>
                    ) : (
                        <Skeleton className="h-12 w-full" />
                    )}
                </div>
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-lg font-medium">
                        Tanggal Pengembalian
                    </h1>
                    {data ? (
                        <div className="flex h-12 w-full items-center justify-start gap-3 rounded-sm border border-black px-4 text-left text-sm font-normal">
                            <CalendarIcon size={16} />
                            {format(data.startAt, "d MMMM yyyy", {
                                locale: id,
                            })}
                        </div>
                    ) : (
                        <Skeleton className="h-12 w-full" />
                    )}
                </div>
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-lg font-medium">Status Peminjaman</h1>
                    {data ? (
                        <div className="flex h-12 w-full items-center justify-start gap-3 rounded-sm border border-black px-4 text-left text-sm font-normal">
                            <h1
                                className={`${textStyle(data.status)} font-semibold`}
                            >
                                {data.status}
                            </h1>
                        </div>
                    ) : (
                        <Skeleton className="h-12 w-full" />
                    )}
                </div>
            </div>

            <div className="flex w-full gap-10"></div>
        </UserLayout>
    );
};

export default loanDetail;
