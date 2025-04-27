import { CircleUser, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CartHover from "~/components/catalog/CartHover";
import SearchBar from "~/components/navbar/SearchBar";

const Navbar = () => {
    return (
        <div className="bg-background flex items-center gap-10 px-20 py-6 z-40">
            <Link href={"/catalog"} className="flex w-auto items-center pr-20 gap-5">
                <Image
                    src={"/images/logo.svg"}
                    width={90}
                    height={90}
                    alt="MAUNC"
                />
                <h1 className="w-full text-2xl font-bold text-nowrap">
                    Stapin Maunc
                </h1>
            </Link>
            <SearchBar />
            <div className="flex items-center gap-8">
                <CartHover />
                <CircleUser width={40} height={40} strokeWidth={1.25} />
                <h1 className="text-xl">nama</h1>
            </div>
        </div>
    );
};

export default Navbar;
