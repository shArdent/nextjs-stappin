import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "~/components/ui/chart";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const getCurrentMonthValue = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // bulan dimulai dari 0
    return `${year}-${month}`; // format: YYYY-MM
};

export default function BarangChartPerMonth({
    label,
    tooltipLabel,
}: {
    label: string;
    tooltipLabel: string;
}) {
    const [selectedDate, setSelectedDate] = useState(getCurrentMonthValue());

    const { data, isLoading } = api.item.itemPerMonth.useQuery(
        new Date(selectedDate),
        {
            enabled: !!selectedDate,
        },
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const isEmpty = !data || data.length === 0;

    const chartConfig = {
        count: {
            label: tooltipLabel,
        },
    } satisfies ChartConfig;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Grafik - {label}</CardTitle>
                <CardDescription>
                    <div className="flex w-fit items-center gap-5 pt-5">
                        <p className="text-nowrap">Pilih bulan </p>
                        <Input
                            defaultValue={selectedDate}
                            type="month"
                            onChange={handleChange}
                        />
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="flex h-72 items-center justify-center">
                        <p className="text-muted-foreground">Memuat data</p>
                    </Skeleton>
                ) : isEmpty ? (
                    <div className="flex h-72 items-center justify-center bg-white">
                        <p className="text-muted-foreground italic">
                            Data tidak ditemukan
                        </p>
                    </div>
                ) : (
                    <ChartContainer
                        className="h-72 w-full"
                        config={chartConfig}
                    >
                        <BarChart
                            accessibilityLayer
                            data={data}
                            margin={{ top: 20 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="quantity"
                                fill="var(--color-accent-yellow)"
                                radius={8}
                            >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
