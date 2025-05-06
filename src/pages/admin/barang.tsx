import type { Item } from "@prisma/client";
import { useState } from "react";
import DialogInputBarang from "~/components/barang/DialogBarang";
import TabelBarang from "~/components/barang/TabelBarang";
import AdminLayout from "~/components/layout/Admin/AdminLayout";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";

const barang = () => {
    const [search, setSearch] = useState("");

    const { data, isPending } = api.item.getItems.useQuery({
        query: search === "" ? undefined : search,
    });

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
                <div className="w-full max-w-md space-y-1">
                    <Label className="text-sm font-medium">
                        Cari Nama Barang
                    </Label>
                    <Input
                        placeholder="Cari nama barang..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white"
                    />
                </div>

                <DialogInputBarang />
                <TabelBarang data={data?.items as Item[]} />
            </div>
        </AdminLayout>
    );
};

export default barang;
