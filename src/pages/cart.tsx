import { useRouter } from "next/router";
import React from "react";
import CartItem from "~/components/cart/CartItem";
import UserLayout from "~/components/layout/UserLayout";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const cart = () => {
    const { data, isPending } = api.cart.getChartByUserId.useQuery();

    const router = useRouter()

    if (isPending)
        return (
            <UserLayout>
                <h1 className="text-3xl font-bold">Keranjang Anda</h1>
                {[1, 2, 3, 4, 5].map((e) => (
                    <Skeleton key={e} className="h-40 w-full" />
                ))}
            </UserLayout>
        );

    if (data)
        return (
            <UserLayout>
                <h1 className="text-3xl font-bold">Keranjang Anda</h1>

                {data.cartItems.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {data?.cartItems.map((cartItem) => (
                            <CartItem cartItem={cartItem} key={cartItem.id} />
                        ))}
                        <Button onClick={() => router.push("/loan-confirm")} variant={"yellow"}>Ajukan Peminjaman</Button>
                    </div>
                ) : (
                    <h1 className="text-center italic">
                        Belum ada barang di keranjang pinjam anda
                    </h1>
                )}
            </UserLayout>
        );
};

export default cart;
