import type { Item } from "@prisma/client";
import DialogInputBarang from "~/components/barang/DialogBarang";
import TabelBarang from "~/components/barang/TabelBarang";
import AdminLayout from "~/components/layout/Admin/AdminLayout";
import { api } from "~/utils/api";

const barang = () => {
    const { data, isPending } = api.item.getItems.useQuery({});

    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-5 px-18 py-10">
                <h1 className="text-3xl font-semibold">Data Barang</h1>
                <p>
                    Halaman ini digunakan untuk menginput dan mengedit barang di
                    Stappin MAUNC
                </p>
                <div>
                    <DialogInputBarang />
                </div>
                <TabelBarang data={data?.items as Item[]} />
            </div>
        </AdminLayout>
    );
};

export default barang;
