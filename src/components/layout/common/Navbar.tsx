import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CartHover from "~/components/catalog/CartHover";
import ProfilePopOver from "~/components/navbar/ProfilePopOver";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const Navbar = ({
    onSearchChange,
    displaySearch,
}: {
    onSearchChange?: (q: string) => void;
    displaySearch?: boolean;
}) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (displaySearch && onSearchChange) onSearchChange(value); // notify parent
    };
    return (
        <div className="bg-background z-40 flex justify-between items-center gap-10 px-20 py-6">
            <Link
                href={"/catalog"}
                className="flex w-auto items-center gap-5 pr-20"
            >
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
            {displaySearch && (
                <div className="relative w-full">
                    <Input
                        className="h-12 w-full rounded border-none bg-white shadow-md"
                        placeholder="cari komponen"
                        onChange={handleSearch}
                    />
                    <Button
                        variant={"secondary"}
                        className="absolute top-[50%] right-3 translate-y-[-50%]"
                    >
                        <Search />
                    </Button>
                </div>
            )}

            <div className="flex w-[40%] justify-end items-center gap-8">
                <CartHover />
                <ProfilePopOver />
            </div>
        </div>
    );
};

export default Navbar;
