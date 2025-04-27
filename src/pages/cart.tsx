import React from "react";
import AjukanDialog from "~/components/cart/AjukanDialog";
import CartItem from "~/components/cart/CartItem";
import Navbar from "~/components/layout/common/Navbar";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const cart = () => {
    const { data, isPending } = api.cart.getChartByUserId.useQuery();

    if (isPending)
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3, 4, 5].map((e) => (
                    <Skeleton key={e} className="h-40 w-full" />
                ))}
            </div>
        );

    if (data)
        return (
            <div className="h-full min-h-screen w-full bg-white">
                <Navbar />
                <div className="flex flex-col gap-5 px-20 py-10">
                    <h1 className="text-3xl font-bold">Keranjang Anda</h1>

                    {data.cartItems.length > 0 ? (
                        <div className="flex flex-col gap-5">
                            {data?.cartItems.map((cartItem) => (
                                <CartItem
                                    cartItem={cartItem}
                                    key={cartItem.id}
                                />
                            ))}
                            <AjukanDialog cartData={data?.cartItems} />
                        </div>
                    ) : (
                        <h1 className="text-center italic">
                            Belum ada barang di keranjang pinjam anda
                        </h1>
                    )}
                </div>
            </div>
        );
};

export default cart;
