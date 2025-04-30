import TabelPeminjam from "~/components/admin/peminjaman/TabelPeminjam";
import AdminLayout from "~/components/layout/Admin/AdminLayout";
import { api } from "~/utils/api";

const peminjaman = () => {
    const { data } = api.loan.getPendingLoan.useQuery();

    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-7 px-10 py-5">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-2xl font-bold">
                        Data Peminjaman Barang
                    </h1>
                    <h2>
                        Halaman ini berisikan daftar peminjam barang di STAPIN
                        MAUNC
                    </h2>
                </div>
                <TabelPeminjam data={data} />
            </div>
        </AdminLayout>
    );
};

export default peminjaman;
