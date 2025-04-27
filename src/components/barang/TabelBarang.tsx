import { Suspense } from "react";
import TabelBarangContent from "./TabelBarangContent";
import TabelBarangSkeleton from "./TabelBarangSkeleton";
import type { Item } from "@prisma/client";
export default function TabelBarang({ data }: { data: Item[] }) {
    return (
        <Suspense fallback={<TabelBarangSkeleton />}>
            <TabelBarangContent data={data} />
        </Suspense>
    );
}
