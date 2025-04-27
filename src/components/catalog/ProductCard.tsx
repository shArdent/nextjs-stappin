import type { Item } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import { toast } from "sonner";

const ProductCard = ({ item }: { item: Item }) => {
    const util = api.useUtils();

    const { mutate, isPending } = api.cart.addToChart.useMutation({
        onSuccess: () => {
            toast.success("Berhasil menambahkan barang ke keranjang");
            util.item.getItems.invalidate();
            util.cart.getChartByUserId.invalidate();
        },
        onError: () => {
            toast.error(
                "Gagal menambahkan barang ke keranajang. Coba beberapa saat lagi",
            );
        },
    });

    return (
        <div className="flex flex-col justify-between gap-3 rounded border border-[#DBDBDB] p-5">
            <Image
                src={item.imageUrl as string}
                height={170}
                width={170}
                alt={item.name}
                className="h-[170px] w-full rounded border border-[#DBDBDB] p-2"
            />
            <h1 className="text-lg font-semibold">{item.name}</h1>
            <p className="text-sm">Tersedia: {item.available}</p>
            <Button
                variant={"yellow"}
                onClick={() => mutate({ itemId: item.id, quantity: 1 })}
            >
                + keranjang
            </Button>
        </div>
    );
};

export default ProductCard;
