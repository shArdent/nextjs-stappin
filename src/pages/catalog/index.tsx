import React from "react";
import ProductCard from "~/components/catalog/ProductCard";
import Navbar from "~/components/layout/common/Navbar";
import { api } from "~/utils/api";

const Page = () => {
    const { data } = api.item.getItems.useQuery({});
    console.log(data);
    return (
        <div className="h-full min-h-screen w-full bg-white">
            <Navbar />
            <div className="grid grid-cols-2 gap-5 px-20 py-20 md:grid-cols-4">
                {data?.items.map((item) => (
                    <ProductCard item={item} key={item.id} />
                ))}
            </div>
        </div>
    );
};

export default Page;
