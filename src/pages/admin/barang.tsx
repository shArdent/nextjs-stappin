import type { Item } from "@prisma/client";
import DialogInputBarang from "~/components/barang/DialogBarang";
import TabelBarang from "~/components/barang/TabelBarang";
import AdminLayout from "~/components/layout/Admin/AdminLayout";
import { api } from "~/utils/api";

const barang = () => {
    const { data, isPending } = api.item.getItems.useQuery({});

    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-5 px-10 py-5">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-2xl font-bold">Data Barang</h1>
                    <h2>
                        Halaman ini digunakan untuk menginput dan mengedit
                        barang di Stappin MAUNC
                    </h2>
                </div>

                <div>
                    <DialogInputBarang />
                </div>
                <TabelBarang data={data?.items as Item[]} />
            </div>
        </AdminLayout>
    );
};

export default barang;
