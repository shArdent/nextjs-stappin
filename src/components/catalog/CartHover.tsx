import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { api } from "~/utils/api";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function CartHover() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isPending } = api.cart.getChartByUserId.useQuery();

    return (
        <div className="relative">
            {isOpen && (
                <div
                    className="fixed inset-0 z-10 bg-black opacity-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div
                className={`relative z-50 cursor-pointer rounded-lg p-1 ${isOpen && "bg-white"}`}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <ShoppingCart className="h-8 w-8" />
                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {data?.cartItems.length}
                </span>
            </div>

            {isOpen && (
                <div
                    className="absolute right-0 z-50 mt-1 w-80 rounded-lg bg-white p-4 shadow-lg"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <h3 className="mb-2 font-semibold">
                        Keranjang ({data?.cartItems.length})
                    </h3>
                    <div className="max-h-60 overflow-y-auto">
                        {isPending ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4"
                                    >
                                        <Skeleton className="h-10 w-10 rounded" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-3 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            data?.cartItems.map((cartItem) => (
                                <div
                                    key={cartItem.id}
                                    className="mb-3 flex gap-3 items-center"
                                >
                                    <Image
                                        src={cartItem.item.imageUrl!}
                                        alt={cartItem.item.name}
                                        width={50}
                                        height={50}
                                        className={"rounded"}

                                    />
                                    <div className="flex w-full items-center justify-between">
                                        <p className="truncate font-medium">
                                            {cartItem.item.name}
                                        </p>
                                        <p>{cartItem.quantity}x</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-4 text-right">
                        <Link
                            href={"/cart"}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Lihat Keranjang
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
