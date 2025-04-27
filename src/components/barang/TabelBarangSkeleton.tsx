import { Skeleton } from "~/components/ui/skeleton";

export default function TabelBarangSkeleton() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-left">
                            No
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                            Nama Barang
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                            Gambar
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                            Deskripsi
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                            Jumlah Barang
                        </th>
                        <th className="border border-gray-300 p-2 text-left">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">
                                {index + 1}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Skeleton className="h-20 w-32" />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Skeleton className="h-4 w-full" />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="space-x-2 border border-gray-300 p-2">
                                <Skeleton className="inline-block h-9 w-16" />
                                <Skeleton className="inline-block h-9 w-16" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
