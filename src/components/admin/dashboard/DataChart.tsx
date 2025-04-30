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
import { Skeleton } from "~/components/ui/skeleton";

export default function DataChart({
    data,
    label,
    tooltipLabel,
    isLoading,
}: {
    data: any;
    label: string;
    tooltipLabel: string;
    isLoading: boolean;
}) {
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
                    {isLoading
                        ? "Memuat data.."
                        : isEmpty
                          ? "Tidak ada data"
                          : `${data[0].month} - ${data[data.length - 1]!.month} `}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-72 w-full" config={chartConfig}>
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
                        <BarChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                top: 20,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
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
                                dataKey="count"
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
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
