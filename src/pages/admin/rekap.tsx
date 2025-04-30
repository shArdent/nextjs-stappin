import TabelRekapPinjaman from "~/components/admin/rekap/TabelRekapPinjaman";
import AdminLayout from "~/components/layout/Admin/AdminLayout";
import { api } from "~/utils/api";

const rekap = () => {
    const { data } = api.loan.getAllLoan.useQuery();
    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-7 px-10 py-5">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-2xl font-bold">
                        Data Rekap Peminjaman Barang
                    </h1>
                    <h2>
                        Halaman ini berisikan daftar rekap peminjam barang di STAPIN
                        MAUNC
                    </h2>
                </div>
                <TabelRekapPinjaman data={data} />
            </div>
        </AdminLayout>
    );
};

export default rekap;
