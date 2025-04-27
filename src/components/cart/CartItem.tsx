import type { Prisma } from "@prisma/client";
import { Trash } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { api } from "~/utils/api";

const CartItem = ({
    cartItem,
}: {
    cartItem: Prisma.CartGetPayload<{ include: { item: true } }>;
}) => {
    const util = api.useUtils();
    const { mutate: deleteCartItem, isPending: deleteCartItemPending } =
        api.cart.deleteCartItem.useMutation({
            onSuccess: () => {
                toast.success("Berhasil menghapus barang dari keranjang");
                util.cart.getChartByUserId.invalidate();
            },
            onError: () => {
                toast.error("Gagal menghapus barang, coba beberapa saat lagi");
            },
        });
    const { mutate: increaseItemCount, isPending: incrementPending } =
        api.cart.incrementCartItem.useMutation({
            onSuccess: () => {
                util.cart.getChartByUserId.invalidate();
            },
            onError: () => {
                toast.error("Gagal menambah, coba beberapa saat lagi");
            },
        });
    const { mutate: decreaseItemCount, isPending: decrementPending } =
        api.cart.decrementCartItem.useMutation({
            onSuccess: () => {
                util.cart.getChartByUserId.invalidate();
            },
            onError: () => {
                toast.error("Gagal mengurangi, coba beberapa saat lagi");
            },
        });
    return (
        <div className="flex w-full gap-5 rounded border p-4">
            <Image
                className="h-full w-[170px] rounded border border-[#DBDBDB] p-2"
                height={170}
                width={170}
                src={cartItem.item.imageUrl!}
                alt={cartItem.item.name}
            />
            <div className="flex w-full flex-col justify-between">
                <h1 className="text-xl font-semibold">{cartItem.item.name}</h1>
                <p className="text-sm">{cartItem.item.description}</p>
                <div className="flex w-full items-center justify-between">
                    <p className="text-sm">
                        Kuantitas: {cartItem.quantity}
                    </p>

                    <div className="flex items-center">
                        <button
                            disabled={
                                incrementPending ||
                                decrementPending ||
                                deleteCartItemPending
                            }
                            className="mr-3 cursor-pointer border px-1 py-1 disabled:opacity-60"
                            onClick={() =>
                                deleteCartItem({ cartId: cartItem.id })
                            }
                        >
                            <Trash />
                        </button>
                        <button
                            disabled={
                                incrementPending ||
                                decrementPending ||
                                deleteCartItemPending
                            }
                            className="cursor-pointer border px-3 py-1 disabled:opacity-60"
                            onClick={() =>
                                decreaseItemCount({
                                    cartId: cartItem.id,
                                    increment: 1,
                                })
                            }
                        >
                            -
                        </button>
                        <h1 className="border px-3 py-1">
                            {cartItem.quantity}
                        </h1>
                        <button
                            disabled={
                                incrementPending ||
                                decrementPending ||
                                deleteCartItemPending
                            }
                            className="cursor-pointer border px-3 py-1 disabled:opacity-60"
                            onClick={() =>
                                increaseItemCount({
                                    cartId: cartItem.id,
                                    increment: 1,
                                })
                            }
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
