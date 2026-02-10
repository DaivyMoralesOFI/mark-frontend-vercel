import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Area, AreaChart } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart";

const instagramData = [
    { day: 1, value: 35 },
    { day: 2, value: 82 },
    { day: 3, value: 45 },
    { day: 4, value: 91 },
    { day: 5, value: 25 },
    { day: 6, value: 87 },
    { day: 7, value: 62 },
];

const facebookData = [
    { day: 1, value: 65 },
    { day: 2, value: 25 },
    { day: 3, value: 78 },
    { day: 4, value: 30 },
    { day: 5, value: 85 },
    { day: 6, value: 22 },
    { day: 7, value: 70 },
];

const tiktokData = [
    { day: 1, value: 20 },
    { day: 2, value: 95 },
    { day: 3, value: 45 },
    { day: 4, value: 85 },
    { day: 5, value: 30 },
    { day: 6, value: 98 },
    { day: 7, value: 55 },
];

const linkedinData = [
    { day: 1, value: 70 },
    { day: 2, value: 20 },
    { day: 3, value: 85 },
    { day: 4, value: 45 },
    { day: 5, value: 90 },
    { day: 6, value: 35 },
    { day: 7, value: 80 },
];

const networks = [
    {
        name: "Instagram",
        data: instagramData,
        color: "#8884d8",
        total: "45.2k",
    },
    {
        name: "Facebook",
        data: facebookData,
        color: "#8884d8",
        total: "12.9k",
    },
    {
        name: "TikTok",
        data: tiktokData,
        color: "#8884d8",
        total: "89.4k",
    },
    {
        name: "LinkedIn",
        data: linkedinData,
        color: "#8884d8",
        total: "5.6k",
    },
];

const SmallChartCard = ({
    name,
    data,
    color,
    total,
}: {
    name: string;
    data: any[];
    color: string;
    total: string;
}) => {
    const chartConfig = {
        value: {
            label: name,
            color: color,
        },
    } satisfies ChartConfig;

    return (
        <div className="bg-white border border-outline-variant rounded-xl p-4 h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-muted-foreground">{name}</div>
                <div className="text-2xl font-bold text-gray-900">{total}</div>
            </div>
            <div className="h-[60px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 5,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Area
                            dataKey="value"
                            type="natural"
                            fill={color}
                            fillOpacity={0.1}
                            stroke={color}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    );
};

export const SocialPerformanceSection = () => {
    return (
        <div className="flex flex-col gap-4 mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Performance by Social Network</h2>
                <Select defaultValue="engagement">
                    <SelectTrigger className="w-[180px] bg-white border-outline-variant">
                        <SelectValue placeholder="Metric" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="followers">Followers</SelectItem>
                        <SelectItem value="impressions">Impressions</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {networks.map((network) => (
                    <SmallChartCard
                        key={network.name}
                        name={network.name}
                        data={network.data}
                        color={network.color}
                        total={network.total}
                    />
                ))}
            </div>
        </div>
    );
};
