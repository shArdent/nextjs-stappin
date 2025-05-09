import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AjukanDialog from "~/components/cart/AjukanDialog";
import { DatePicker } from "~/components/layout/common/DatePicker";
import UserLayout from "~/components/layout/UserLayout";
import ItemTable from "~/components/loan-confirm/ItemTable";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

type loanRequest = {
    userId: string;
    reason: string;
    startDate: Date | undefined;
    returnedAt: Date | undefined;
};

const loanConfirm = () => {
    const router = useRouter();
    const { data } = api.cart.getChartByUserId.useQuery();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const [loanData, setLoanData] = useState<loanRequest>({
        userId: data?.cartItems[0]?.id as string,
        reason: "",
        startDate: undefined,
        returnedAt: undefined,
    });

    useEffect(() => {
        console.log(loanData);
        setLoanData((prev) => ({
            ...prev,
            userId: data?.cartItems[0]?.userId as string,
            startDate: startDate,
            returnedAt: endDate,
        }));
    }, [startDate, endDate, data]);

    return (
        <UserLayout>
            <h1 className="text-xl font-bold">Konfirmasi Peminjaman</h1>
            <ItemTable data={data?.cartItems} />
            <div className="flex w-full flex-col gap-5">
                <h1 className="text-lg font-medium">Tujuan Peminjaman</h1>
                <textarea
                    name="reason"
                    id="reason"
                    onChange={(e) =>
                        setLoanData({ ...loanData, reason: e.target.value })
                    }
                    className="h-20 w-full resize-none rounded border border-black p-2"
                    placeholder="Tujuan peminjaman barang"
                ></textarea>
            </div>

            <div className="flex w-full gap-10">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-lg font-medium">Tanggal Peminjaman</h1>
                    <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-lg font-medium">
                        Tanggal Pengembalian
                    </h1>
                    <DatePicker
                        beforeDate={startDate}
                        date={endDate}
                        setDate={setEndDate}
                    />
                </div>
            </div>

            <div className="flex w-full gap-10">
                <Button
                    variant={"secondary"}
                    className="flex-1 bg-gray-200 hover:bg-gray-200/80"
                    onClick={() => router.push("/catalog")}
                >
                    Batalkan Peminjaman
                </Button>
                <AjukanDialog cartData={data?.cartItems!} loanData={loanData} />
            </div>
        </UserLayout>
    );
};

export default loanConfirm;
