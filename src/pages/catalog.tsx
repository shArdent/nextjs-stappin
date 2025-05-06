import React, { useEffect, useState } from "react";
import ProductCard from "~/components/catalog/ProductCard";
import Navbar from "~/components/layout/common/Navbar";
import { api } from "~/utils/api";

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // delay 500ms

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const { data } = api.item.getItems.useQuery({ query: debouncedQuery });
    return (
        <div className="h-full min-h-screen w-full bg-white">
            <Navbar onSearchChange={setSearchQuery} displaySearch />
            <div className="flex flex-col gap-8 px-20 py-10">
                <h1 className="text-3xl font-bold">Katalog</h1>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    {data?.items.map((item) => (
                        <ProductCard item={item} key={item.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
