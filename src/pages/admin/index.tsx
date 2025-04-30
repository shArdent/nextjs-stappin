import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import BarangChartPerMonth from "~/components/admin/dashboard/BarangChartPerMonth";
import DataChart from "~/components/admin/dashboard/DataChart";
import StatCard from "~/components/admin/dashboard/StatCard";
import AdminLayout from "~/components/layout/Admin/AdminLayout";
import { api } from "~/utils/api";

const index = () => {
    const { data, isLoading } = api.item.getDashboard.useQuery();

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-5 px-10 py-5">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="flex w-full justify-between gap-5">
                    <StatCard
                        Icon={Loader}
                        label="Total Jumlah Peminjaman"
                        value={data?.loanCount._count}
                        isLoading={isLoading}
                    />
                    <StatCard
                        Icon={Loader}
                        label="Total Jumlah Jenis Barang"
                        value={data?.itemCount._count}
                        isLoading={isLoading}
                    />
                    <StatCard
                        Icon={Loader}
                        label="Jumlah Peminjaman Pending"
                        value={data?.loanPendingCount._count}
                        isLoading={isLoading}
                    />
                </div>

                <DataChart
                    data={data?.loansGroupedByMonthArray}
                    label="Jumlah Peminjaman"
                    tooltipLabel="Peminjam"
                    isLoading={isLoading}
                />
                <DataChart
                    data={data?.frequencyItemPerMonthArray}
                    label="Frekuensi Barang Dipinjam"
                    tooltipLabel="Barang"
                    isLoading={isLoading}
                />
                <BarangChartPerMonth
                    tooltipLabel="Barang"
                    label={"Barang dipinjam perbulan"}
                />
            </div>
        </AdminLayout>
    );
};

export default index;
