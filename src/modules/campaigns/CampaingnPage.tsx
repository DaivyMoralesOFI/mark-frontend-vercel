import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/Card";
import PageOutletLayout from "@/shared/layout/PageOutletLayout";
import { Actions } from "@/shared/types/Types";
import {
  ArrowUp,
  ArrowDown,
  Bot,
  DollarSign,
  MousePointerClick,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/Chart";
import { AiChatModal } from "@/modules/chat-coach-modal/page/AiChatModal";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/Table";
import { Badge as SharedBadge } from "@/shared/components/ui/Badge";

interface CampaignData {
  date: string;
  spend: number;
  clicks: number;
  conversions: number;
  ctr: number;
}

interface CampaignTableData {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Ended";
  budget: string;
  clicks: number;
  social: string;
}

const mockCampaigns: CampaignData[] = [
  { date: "Jun 01", spend: 200, clicks: 400, conversions: 50, ctr: 2.0 },
  { date: "Jun 02", spend: 250, clicks: 450, conversions: 60, ctr: 1.8 },
  { date: "Jun 03", spend: 180, clicks: 350, conversions: 45, ctr: 1.9 },
  { date: "Jun 04", spend: 300, clicks: 500, conversions: 75, ctr: 2.1 },
  { date: "Jun 05", spend: 220, clicks: 420, conversions: 55, ctr: 1.9 },
  { date: "Jun 06", spend: 275, clicks: 480, conversions: 65, ctr: 2.0 },
  { date: "Jun 07", spend: 240, clicks: 440, conversions: 58, ctr: 1.9 },
];

const mockCampaignsTable: CampaignTableData[] = [
  { id: "1", name: "Summer Sale", status: "Active", budget: "$2,000", clicks: 400, social: "Facebook" },
  { id: "2", name: "Winter Promo", status: "Paused", budget: "$1,500", clicks: 320, social: "Instagram" },
  { id: "3", name: "Spring Launch", status: "Ended", budget: "$1,800", clicks: 280, social: "Twitter" },
  { id: "4", name: "Black Friday", status: "Active", budget: "$3,000", clicks: 500, social: "LinkedIn" },
];

const SOCIAL_COLORS: Record<string, string> = {
  Facebook: "#1877F3",
  Instagram: "#E1306C",
  Twitter: "#1DA1F2",
  LinkedIn: "#0077B5",
};

const areaChartConfig = {
  spend: { label: "Spend ($)", color: "#d946ef" },
  clicks: { label: "Clicks", color: "#38bdf8" },
} satisfies ChartConfig;

const barChartConfig = {
  conversions: { label: "Conversions", color: "#f59e0b" },
  ctr: { label: "CTR (%)", color: "#a78bfa" },
} satisfies ChartConfig;

export default function CampaignsDashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAskMark, setShowAskMark] = useState(false);

  const totalSpend = mockCampaigns.reduce((sum, d) => sum + d.spend, 0);
  const totalClicks = mockCampaigns.reduce((sum, d) => sum + d.clicks, 0);
  const totalConversions = mockCampaigns.reduce((sum, d) => sum + d.conversions, 0);
  const avgCtr = mockCampaigns.reduce((sum, d) => sum + d.ctr, 0) / mockCampaigns.length;

  const kpis = [
    { title: "Total Spend", value: `$${totalSpend.toLocaleString()}`, trend: 12.5, icon: DollarSign },
    { title: "Total Clicks", value: totalClicks.toLocaleString(), trend: 8.2, icon: MousePointerClick },
    { title: "Conversions", value: totalConversions.toLocaleString(), trend: -3.1, icon: Target },
    { title: "Avg. CTR", value: `${avgCtr.toFixed(1)}%`, trend: 1.4, icon: TrendingUp },
  ];

  const pageActions: Actions[] = [
    { type: "button", children: "Create Post", icon: Plus, onClick: () => setShowCreatePost(true), variant: "default" },
    { type: "button", children: "Ask Mark", icon: Bot, onClick: () => setShowAskMark(true), variant: "secondary" },
  ];

  return (
    <>
      <PageOutletLayout<"with-actions"> pageTitle="Campaigns Overview" actions={pageActions}>
        {/* KPI Cards */}
        <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 py-2">
          {kpis.map((kpi) => (
            <div
              key={kpi.title}
              className="bg-surface rounded-xl border border-outline-variant p-4 flex flex-col gap-2 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-normal uppercase tracking-wider text-on-surface-variant">
                  {kpi.title}
                </p>
                <kpi.icon className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium text-on-surface tabular-nums">{kpi.value}</span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    kpi.trend > 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {kpi.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(kpi.trend)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="col-span-12 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Spend & Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={areaChartConfig} className="h-[320px] w-full">
                <AreaChart data={mockCampaigns} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-spend)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-spend)" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--outline-variant)" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: "var(--on-surface-variant)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    width={40}
                    tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "var(--on-surface)", strokeDasharray: "4 4", strokeWidth: 1 }}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    fill="url(#fillSpend)"
                    fillOpacity={1}
                    stroke="var(--color-spend)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "var(--color-spend)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    fill="url(#fillClicks)"
                    fillOpacity={1}
                    stroke="var(--color-clicks)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "var(--color-clicks)" }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Conversions & CTR</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[320px] w-full">
                <BarChart data={mockCampaigns} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--outline-variant)" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: "var(--on-surface-variant)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    width={40}
                    tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }}
                  />
                  <ChartTooltip
                    cursor={{ fill: "var(--outline-variant)", fillOpacity: 0.1 }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ctr" fill="var(--color-ctr)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-outline-variant hover:bg-transparent">
                    <TableHead className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">Name</TableHead>
                    <TableHead className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">Budget</TableHead>
                    <TableHead className="text-on-surface-variant font-medium text-xs uppercase tracking-wider text-right">Clicks</TableHead>
                    <TableHead className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">Network</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCampaignsTable.map((c) => (
                    <TableRow key={c.id} className="border-outline-variant hover:bg-surface-container-lowest/50">
                      <TableCell className="font-medium text-on-surface">{c.name}</TableCell>
                      <TableCell>
                        <SharedBadge
                          variant={
                            c.status === "Active" ? "low" : c.status === "Paused" ? "medium" : "high"
                          }
                        >
                          {c.status}
                        </SharedBadge>
                      </TableCell>
                      <TableCell className="text-on-surface tabular-nums">{c.budget}</TableCell>
                      <TableCell className="text-right text-on-surface tabular-nums">
                        {c.clicks.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: SOCIAL_COLORS[c.social] || "#888" }}
                        >
                          {c.social}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </PageOutletLayout>
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
      <AiChatModal isOpen={showAskMark} onClose={() => setShowAskMark(false)} />
    </>
  );
}
