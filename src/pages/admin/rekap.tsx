import { LoanStatus } from "@prisma/client";
import { useState } from "react";
import TabelRekapPinjaman from "~/components/admin/rekap/TabelRekapPinjaman";
import AdminLayout from "~/components/layout/Admin/AdminLayout";
import { api } from "~/utils/api";

const rekap = () => {
    const [filters, setFilters] = useState({
        nama: undefined,
        status: undefined,
        returnDate: undefined,
    });

    const { data } = api.loan.getAllLoan.useQuery({
        nama: filters.nama,
        status: filters.status,
        returnDate: filters.returnDate
            ? new Date(filters.returnDate)
            : undefined,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value === "" ? undefined : value,
        }));
    };

    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-7 px-10 py-5">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-2xl font-bold">
                        Data Rekap Peminjaman Barang
                    </h1>
                    <h2>
                        Halaman ini berisikan daftar rekap peminjam barang di
                        STAPIN MAUNC
                    </h2>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block font-medium">Nama</label>
                        <input
                            type="text"
                            name="nama"
                            value={filters.nama ?? ""}
                            onChange={handleChange}
                            className="rounded border bg-white px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Status</label>
                        <select
                            name="status"
                            value={filters.status ?? ""}
                            onChange={handleChange}
                            className="rounded border bg-white px-3 py-2"
                        >
                            <option value="">Semua</option>
                            {Object.values(LoanStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">
                            Tanggal Pengembalian
                        </label>
                        <input
                            type="date"
                            name="returnDate"
                            value={filters.returnDate ?? ""}
                            onChange={handleChange}
                            className="rounded border bg-white px-3 py-2"
                        />
                    </div>
                </div>
                <TabelRekapPinjaman data={data} />
            </div>
        </AdminLayout>
    );
};

export default rekap;
