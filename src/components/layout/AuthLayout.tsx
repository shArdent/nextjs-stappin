import type { PropsWithChildren } from "react";
import { GuestRoute } from "~/components/layout/GuestRoute";
import Image from "next/image";

const AuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <GuestRoute>
            <div className="flex h-full items-center justify-center">
                <div className="flex h-full w-[70%] flex-col items-center justify-center gap-5 px-32">
                    {children}
                </div>
                <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-white px-30">
                    <Image
                        src={"/images/logo.svg"}
                        width={200}
                        height={200}
                        alt="logo maunc"
                    />
                    <h1 className="text-center text-2xl font-bold">
                        Stapin MAUNC
                    </h1>
                    <p className="text-center">
                        Aplikasi pencatatan peminjaman dan ketersediaan barang,
                        praktis dan efisien untuk memantau inventaris kapan saja
                    </p>
                </div>
            </div>
        </GuestRoute>
    );
};

export default AuthLayout;
