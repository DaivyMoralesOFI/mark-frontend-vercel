import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { AppHeaderActions } from "@/shared/types/types";
import { Bot, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { CreatePostModal } from "../create-post/components/CreatePostModal";
import { AiChatModal } from "../chat-coach-modal/page/AiChatModal";

interface AnalyticsData {
  date: string;
  impressions: number;
  clicks: number;
  engagements: number;
}

// Mock data for demonstration
const mockData: AnalyticsData[] = [
  { date: "2025-06-01", impressions: 1200, clicks: 300, engagements: 180 },
  { date: "2025-06-02", impressions: 1500, clicks: 400, engagements: 240 },
  { date: "2025-06-03", impressions: 1100, clicks: 200, engagements: 130 },
  { date: "2025-06-04", impressions: 1700, clicks: 500, engagements: 300 },
  { date: "2025-06-05", impressions: 1300, clicks: 350, engagements: 210 },
  { date: "2025-06-06", impressions: 1600, clicks: 450, engagements: 275 },
  { date: "2025-06-07", impressions: 1400, clicks: 380, engagements: 220 },
];

// Colors for pie chart por red social
const SOCIAL_COLORS: Record<string, string> = {
  Instagram: "#E1306C",
  Twitter: "#1DA1F2",
  Facebook: "#1877F3",
  LinkedIn: "#0077B5",
  TikTok: "#000000"
};

const socialData = [
  { platform: "Instagram", engagements: 800 },
  { platform: "Twitter", engagements: 500 },
  { platform: "Facebook", engagements: 300 },
  { platform: "LinkedIn", engagements: 200 },
  { platform: "TikTok", engagements: 150 },
];

// Colores personalizados para las líneas y barras
const LINE_COLORS = {
  impressions: '#1DA1F2', // azul Twitter
  clicks: '#E1306C',      // rosa Instagram
  engagements: '#FFC658', // amarillo pastel
};
const BAR_COLOR = '#B39DDB'; // morado pastel

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData[]>([]);

  // Load mock data on mount
  useEffect(() => {
    setData(mockData);
  }, []);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAskMark, setShowAskMark] = useState(false);

  const pageActions: AppHeaderActions[] = [
    {
      label: "Create Post",
      icon: Plus,
      onClick: () => setShowCreatePost(true),
      variant: "default",
    },
    {
      label: "Ask Mark",
      icon: Bot,
      onClick: () => setShowAskMark(true),
      variant: "secondary",
    },
  ];


  return (
    <>
      <PageOutletLayout pageTitle="Social Analytics" actions={pageActions}>
        <Card className="shadow-lg col-span-12 md:col-span-4 my-auto min-h-[28rem] flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="impressions" stroke={LINE_COLORS.impressions} />
                <Line type="monotone" dataKey="clicks" stroke={LINE_COLORS.clicks} />
                <Line type="monotone" dataKey="engagements" stroke={LINE_COLORS.engagements} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg col-span-12 md:col-span-4 my-auto min-h-[28rem] flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Top Performing Days</CardTitle>
          </CardHeader>
          <CardContent className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="engagements" fill={BAR_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg col-span-12 md:col-span-4 my-auto min-h-[28rem] flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 md:h-96 flex flex-col justify-center items-center">
            <ResponsiveContainer width="90%" height="90%">
              <PieChart>
                <Pie
                  data={socialData}
                  dataKey="engagements"
                  nameKey="platform"
                  outerRadius={100}
                  label={({ percent, platform }) =>
                    `${platform}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {socialData.map((entry) => (
                    <Cell key={entry.platform} fill={SOCIAL_COLORS[entry.platform]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _, props) => {
                    const total = socialData.reduce((acc, cur) => acc + cur.engagements, 0);
                    const percent = ((Number(value) / total) * 100).toFixed(1);
                    return [`${value} engagements (${percent}%)`, props.payload.platform];
                  }}
                />
                <Legend
                  payload={socialData.map((item) => ({
                    id: item.platform,
                    type: "square",
                    value: item.platform,
                    color: SOCIAL_COLORS[item.platform],
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </PageOutletLayout>
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
      <AiChatModal isOpen={showAskMark} onClose={() => setShowAskMark(false)} />
    </>
  );
}
