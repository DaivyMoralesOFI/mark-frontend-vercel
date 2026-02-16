import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Actions } from "@/shared/types/types";
import { Bot, Plus } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AiChatModal } from "@/domains/creation-studio/chat-coach/chat-coach-modal/page/AiChatModal";
import { CreatePostModal } from "@/domains/creation-studio/post-creator/components/CreatePostModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/Table";
import { Badge as SharedBadge } from "@/shared/components/ui/badge";

interface CampaignData {
  date: string;
  spend: number;
  clicks: number;
  conversions: number;
  ctr: number; // click-through rate
}

interface CampaignTableData {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Ended";
  budget: string;
  clicks: number;
  social: string;
}

// Mock data
const mockCampaigns: CampaignData[] = [
  { date: "2025-06-01", spend: 200, clicks: 400, conversions: 50, ctr: 0.02 },
  { date: "2025-06-02", spend: 250, clicks: 450, conversions: 60, ctr: 0.018 },
  { date: "2025-06-03", spend: 180, clicks: 350, conversions: 45, ctr: 0.019 },
  { date: "2025-06-04", spend: 300, clicks: 500, conversions: 75, ctr: 0.021 },
  { date: "2025-06-05", spend: 220, clicks: 420, conversions: 55, ctr: 0.019 },
  { date: "2025-06-06", spend: 275, clicks: 480, conversions: 65, ctr: 0.02 },
  { date: "2025-06-07", spend: 240, clicks: 440, conversions: 58, ctr: 0.019 },
];

const mockCampaignsTable: CampaignTableData[] = [
  {
    id: "1",
    name: "Summer Sale",
    status: "Active",
    budget: "$2,000",
    clicks: 400,
    social: "Facebook",
  },
  {
    id: "2",
    name: "Winter Promo",
    status: "Paused",
    budget: "$1,500",
    clicks: 320,
    social: "Instagram",
  },
  {
    id: "3",
    name: "Spring Launch",
    status: "Ended",
    budget: "$1,800",
    clicks: 280,
    social: "Twitter",
  },
  {
    id: "4",
    name: "Black Friday",
    status: "Active",
    budget: "$3,000",
    clicks: 500,
    social: "LinkedIn",
  },
];

const SOCIAL_COLORS: Record<string, string> = {
  Facebook: "#1877F3", // Azul Facebook
  Instagram: "#E1306C", // Rosado Instagram
  Twitter: "#1DA1F2", // Azul Twitter
  LinkedIn: "#0077B5", // Azul LinkedIn
};

export default function CampaignsDashboard() {
  const [data, setData] = useState<CampaignData[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignTableData[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAskMark, setShowAskMark] = useState(false);

  useEffect(() => {
    setData(mockCampaigns);
    setCampaigns(mockCampaignsTable);
  }, []);

  const pageActions: Actions[] = [
    {
      type: "button",
      children: "Create Post",
      icon: Plus,
      onClick: () => setShowCreatePost(true),
      variant: "default",
    },
    {
      type: "button",
      children: "Ask Mark",
      icon: Bot,
      onClick: () => setShowAskMark(true),
      variant: "secondary",
    },
  ];

  // Colores personalizados para las áreas, barras y pie chart
  const AREA_COLORS = {
    spend: "#1DA1F2", // azul Twitter
    clicks: "#E1306C", // rosa Instagram
  };
  const BAR_COLORS = {
    conversions: "#FFC658", // amarillo pastel
    ctr: "#B39DDB", // morado pastel
  };
  const PIE_COLORS = [
    "#E1306C",
    "#1DA1F2",
    "#FFC658",
    "#B39DDB",
    "#1877F3",
    "#0077B5",
  ];

  return (
    <>
      <PageOutletLayout<"with-actions"> pageTitle="Campaigns Overview" actions={pageActions}>
        <Card className="shadow-lg col-span-12 md:col-span-4 my-auto min-h-[28rem] flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Spend & Clicks Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="spend"
                  name="Spend ($)"
                  stroke={AREA_COLORS.spend}
                  fill={AREA_COLORS.spend}
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  name="Clicks"
                  stroke={AREA_COLORS.clicks}
                  fill={AREA_COLORS.clicks}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg col-span-12 md:col-span-4 my-auto min-h-[28rem] flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Conversion Rate (CTR) & Conversions</CardTitle>
          </CardHeader>
          <CardContent className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="conversions"
                  name="Conversions"
                  fill={BAR_COLORS.conversions}
                />
                <Bar dataKey="ctr" name="CTR" fill={BAR_COLORS.ctr} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg col-span-12 md:col-span-4 my-auto min-h-[28rem] flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Spend Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 md:h-96 flex flex-col justify-center items-center">
            <ResponsiveContainer width="90%" height="90%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="spend"
                  nameKey="date"
                  outerRadius={100}
                  label={({ value, percent }) =>
                    `$${value} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _, props) => {
                    const total = data.reduce((acc, cur) => acc + cur.spend, 0);
                    const percent = ((Number(value) / total) * 100).toFixed(1);
                    return [`$${value} (${percent}%)`, props.payload.date];
                  }}
                />
                <Legend
                  payload={data.map((item, i) => {
                    const total = data.reduce((acc, cur) => acc + cur.spend, 0);
                    const percent = ((item.spend / total) * 100).toFixed(0);
                    return {
                      id: item.date,
                      type: "square",
                      value: `$${item.spend} (${percent}%)`,
                      color: PIE_COLORS[i % PIE_COLORS.length],
                    };
                  })}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="col-span-12 p-4">
          <Card className="overflow-auto">
            <CardHeader>
              <CardTitle>Campaigns Summary by Social Network</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Social Network</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">{c.name}</TableCell>
                    <TableCell className="text-center">
                      <SharedBadge
                        variant={
                          c.status === "Active"
                            ? "low"
                            : c.status === "Paused"
                              ? "medium"
                              : "high"
                        }
                        className="capitalize"
                      >
                        {c.status}
                      </SharedBadge>
                    </TableCell>
                    <TableCell className="text-center">{c.budget}</TableCell>
                    <TableCell className="text-center">
                      {c.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        style={{
                          color: "#fff",
                          backgroundColor: SOCIAL_COLORS[c.social] || "#888",
                          borderRadius: "0.375rem",
                          padding: "0.25em 0.75em",
                          display: "inline-block",
                          fontWeight: 500,
                        }}
                      >
                        {c.social}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </PageOutletLayout>
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
      <AiChatModal isOpen={showAskMark} onClose={() => setShowAskMark(false)} />
    </>
  );
}
