import type { LucideIcon } from "lucide-react";
import React from "react";

const StatCard = ({
    Icon,
    label,
    value,
    isLoading,
}: {
    Icon: LucideIcon;
    label: string;
    value?: number;
    isLoading: boolean;
}) => {
    return (
        <div className="shadow-card flex w-full gap-4 rounded-md bg-white p-5">
            <Icon />
            <div>
                <h2 className="font-semibold">{label}</h2>
                <p className="text-2xl font-medium">
                    {isLoading ? "Memuat data.." : value}
                </p>
            </div>
        </div>
    );
};

export default StatCard;
