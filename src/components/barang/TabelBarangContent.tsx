import type { Item } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import DialogBarangUpdate from "./DialogBarangUpdate";

export default function TabelBarangContent({ data }: { data: Item[] }) {
    const [error, setError] = useState<string | null>(null);
    const utils = api.useUtils();

    const { mutate: deleteItem, isPending: deleteIsPending } =
        api.item.deleteItem.useMutation({
            onSuccess: async () => {
                toast.success("Berhasil menghapus barang");
                await utils.item.getItems.invalidate();
            },
            onError: () => {
                toast.error("Gagal menghapus barang");
            },
        });

    if (error) {
        return (
            <div className="rounded-md border p-8 text-center">
                <p className="text-lg text-red-500">Error: {error}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                >
                    Coba Lagi
                </Button>
            </div>
        );
    }

    if (data && data.length === 0) {
        return (
            <div className="rounded-md border p-8 text-center">
                <p className="text-lg text-black">
                    Tidak ada data produk yang tersedia
                </p>
            </div>
        );
    }

    if (data)
        return (
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 text-center">
                    <thead className="rounded bg-gray-200">
                        <tr className="text-center">
                            <th className="w-[5%] rounded-tl-md border border-black p-2">
                                No
                            </th>
                            <th className="border border-black p-2">
                                Nama Barang
                            </th>
                            <th className="border border-black p-2">Gambar</th>
                            <th className="border border-black p-2">
                                Deskripsi
                            </th>
                            <th className="w-[10%] border border-black p-2">
                                Jumlah Barang
                            </th>
                            <th className="w-[10%] border border-black p-2">
                                Jumlah Barang Tersedia
                            </th>
                            <th className="w-[15%] rounded-tr-lg border border-black p-2">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data.map((barang, index) => (
                            <tr key={barang.id} className="hover:bg-gray-100">
                                <td className={`border border-black p-2`}>
                                    {index + 1}
                                </td>
                                <td className="border border-black p-2">
                                    {barang.name}
                                </td>
                                <td className="flex items-center justify-center border border-black p-2">
                                    <Image
                                        src={
                                            barang.imageUrl ||
                                            "/placeholder.svg"
                                        }
                                        alt={barang.name}
                                        width={120}
                                        height={80}
                                        className="object-contain w-[120px] h-[80px]"
                                    />
                                </td>
                                <td className="border border-black p-2">
                                    {barang.description}
                                </td>
                                <td className="border border-black p-2">
                                    {barang.quantity}
                                </td>
                                <td className="border border-black p-2">
                                    {barang.available}
                                </td>
                                <td className="space-x-2 border border-black p-2">
                                    <div className="flex items-center justify-center gap-3">
                                        <DialogBarangUpdate
                                            currentItem={barang}
                                        />

                                        <Button
                                            className="bg-red-500 text-white hover:bg-red-600"
                                            onClick={() =>
                                                deleteItem({
                                                    itemId: barang.id,
                                                })
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
}
