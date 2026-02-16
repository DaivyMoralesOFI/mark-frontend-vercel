// ────────────────────────────────────────────────
// Centralized mock data for the dashboard, keyed by time period
// ────────────────────────────────────────────────

export type TimePeriod = "7days" | "30days" | "90days" | "all" | "custom";

// ── KPI Data ────────────────────────────────────
export interface KpiData {
    totalFollowers: { value: string; trend: number };
    impressions: { value: string; trend: number };
    engagementRate: { value: string; trend: number };
    totalPosts: { value: string; trend: number };
}

const kpiByPeriod: Record<TimePeriod, KpiData> = {
    "7days": {
        totalFollowers: { value: "151.2K", trend: 1.8 },
        impressions: { value: "198.4K", trend: 5.1 },
        engagementRate: { value: "6.1%", trend: 0.9 },
        totalPosts: { value: "24", trend: 14.3 },
    },
    "30days": {
        totalFollowers: { value: "152.4K", trend: 12.5 },
        impressions: { value: "892.1K", trend: 8.2 },
        engagementRate: { value: "5.2%", trend: -2.4 },
        totalPosts: { value: "142", trend: 4.5 },
    },
    "90days": {
        totalFollowers: { value: "158.9K", trend: 22.1 },
        impressions: { value: "2.4M", trend: 15.7 },
        engagementRate: { value: "4.8%", trend: -4.1 },
        totalPosts: { value: "386", trend: 11.2 },
    },
    "all": {
        totalFollowers: { value: "152.4K", trend: 12.5 },
        impressions: { value: "892.1K", trend: 8.2 },
        engagementRate: { value: "5.2%", trend: -2.4 },
        totalPosts: { value: "142", trend: 4.5 },
    },
    "custom": {
        totalFollowers: { value: "152.4K", trend: 12.5 },
        impressions: { value: "892.1K", trend: 8.2 },
        engagementRate: { value: "5.2%", trend: -2.4 },
        totalPosts: { value: "142", trend: 4.5 },
    },
};

export function getKpiData(period: TimePeriod): KpiData {
    if (period === "all" || period === "custom") return kpiByPeriod["30days"];
    return kpiByPeriod[period];
}

// ── Overview Chart Data ─────────────────────────

const generateOverviewData = (length: number, period: TimePeriod) => {
    return Array.from({ length }, (_, i) => {
        const freq1 = 0.8;
        const freq2 = 2.1;
        const freq3 = 4.5;
        const jitter = (Math.random() - 0.5) * 0.8;
        const trend = i * 0.005;

        const wave = 1 + trend + jitter +
            Math.sin(i * freq1) * 0.15 +
            Math.sin(i * freq2) * 0.12 +
            Math.sin(i * freq3) * 0.08;

        let dateLabel = "";
        if (period === "7days") dateLabel = `${i.toString().padStart(2, '0')}:00`;
        else if (period === "30days") dateLabel = (i + 1).toString();
        else if (period === "90days") dateLabel = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12];
        else dateLabel = (i + 1).toString();

        return {
            date: dateLabel,
            followers: Math.round(150000 * wave),
            impressions: Math.round(890000 * wave),
            engagement: Number((5.2 * wave).toFixed(1)),
            posts: Math.round(140 * wave),
        };
    });
};

export function getOverviewChartData(period: TimePeriod) {
    const lengths: Record<TimePeriod, number> = {
        "7days": 24,
        "30days": 30,
        "90days": 12,
        "all": 12,
        "custom": 30
    };
    return generateOverviewData(lengths[period], period);
}

// ── Social Performance Data ─────────────────────
export interface SocialNetworkData {
    name: string;
    data: { day: number; value: number }[];
    color: string;
    total: string;
    trend?: number;
}

interface RawSocialNetworkData {
    name: string;
    metrics: Record<string, {
        total: string;
        trend: number;
        data: { day: number; value: number }[];
    }>;
    color: string;
}

const rawSocialData7: RawSocialNetworkData[] = [
    {
        name: "Instagram",
        color: "#8884d8",
        metrics: {
            engagement: { total: "8.4k", trend: 3.2, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 30 + Math.random() * 50 })) },
            followers: { total: "152.4k", trend: 1.5, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 100 + i * 2 })) },
            impressions: { total: "892.1k", trend: 8.2, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 500 + Math.random() * 400 })) },
        }
    },
    {
        name: "Facebook",
        color: "#8884d8",
        metrics: {
            engagement: { total: "2.1k", trend: -1.4, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 50 + Math.random() * 20 })) },
            followers: { total: "45.2k", trend: 0.8, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 80 + i * 0.5 })) },
            impressions: { total: "124.5k", trend: -2.1, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 300 + Math.random() * 150 })) },
        }
    },
    {
        name: "TikTok",
        color: "#8884d8",
        metrics: {
            engagement: { total: "18.2k", trend: 7.8, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 20 + Math.random() * 80 })) },
            followers: { total: "89.4k", trend: 12.5, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 50 + i * 5 })) },
            impressions: { total: "1.2M", trend: 15.3, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 800 + Math.random() * 600 })) },
        }
    },
    {
        name: "LinkedIn",
        color: "#8884d8",
        metrics: {
            engagement: { total: "1.2k", trend: 2.1, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 40 + Math.random() * 30 })) },
            followers: { total: "5.6k", trend: 4.7, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 30 + i * 1 })) },
            impressions: { total: "45.8k", trend: 5.6, data: Array.from({ length: 20 }, (_, i) => ({ day: i + 1, value: 200 + Math.random() * 100 })) },
        }
    },
];

const socialDataByMetricPeriod: Record<TimePeriod, RawSocialNetworkData[]> = {
    "7days": rawSocialData7,
    "30days": rawSocialData7,
    "90days": rawSocialData7,
    "all": rawSocialData7,
    "custom": rawSocialData7,
};

export function getSocialData(period: TimePeriod, metric: string = "engagement"): SocialNetworkData[] {
    const rawData = socialDataByMetricPeriod[period] || rawSocialData7;
    return rawData.map(item => ({
        name: item.name,
        color: item.color,
        total: item.metrics[metric]?.total || "0",
        trend: item.metrics[metric]?.trend || 0,
        data: item.metrics[metric]?.data || [],
    }));
}

// ── Best Posts Data ──────────────────────────────
export interface PostData {
    id: number;
    caption: string;
    date: string;
    type: string;
    typeColor: string;
    status: string;
    statusColor: string;
    platform: string;
    likes: string;
    comments: string;
    shares: string;
    reach: string;
}

const posts7days: PostData[] = [
    {
        id: 1,
        caption: "This hack will save you 3 hours a week 🤯 #productivity",
        date: "Feb 9, 2026",
        type: "Video",
        typeColor: "bg-cyan-100 text-cyan-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "TikTok",
        likes: "45,200",
        comments: "2,340",
        shares: "8,910",
        reach: "512.3K",
    },
    {
        id: 2,
        caption: "Here's what our customers are saying about us ❤️",
        date: "Feb 8, 2026",
        type: "Carousel",
        typeColor: "bg-amber-100 text-amber-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Instagram",
        likes: "5,864",
        comments: "312",
        shares: "789",
        reach: "72.1K",
    },
    {
        id: 3,
        caption: "📈 Q4 Report: How data-driven brands outperform by 47%",
        date: "Feb 7, 2026",
        type: "Document",
        typeColor: "bg-amber-100 text-amber-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "LinkedIn",
        likes: "8,450",
        comments: "423",
        shares: "2,310",
        reach: "89.6K",
    },
    {
        id: 4,
        caption: "Behind the scenes: Our creative process unveiled 🎨",
        date: "Feb 11, 2026",
        type: "Reel",
        typeColor: "bg-pink-100 text-pink-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Instagram",
        likes: "12,400",
        comments: "845",
        shares: "1,520",
        reach: "145.2K",
    },
    {
        id: 5,
        caption: "Top 5 tips for sustainable growth in 2026 🌿",
        date: "Feb 10, 2026",
        type: "Image",
        typeColor: "bg-green-100 text-green-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Facebook",
        likes: "3,120",
        comments: "156",
        shares: "432",
        reach: "45.8K",
    },
    {
        id: 6,
        caption: "Why remote work is here to stay (and how to bridge the gap) 💻",
        date: "Feb 9, 2026",
        type: "Link",
        typeColor: "bg-blue-100 text-blue-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "LinkedIn",
        likes: "2,840",
        comments: "189",
        shares: "567",
        reach: "38.4K",
    },
    {
        id: 7,
        caption: "Join our upcoming webinar on AI-driven marketing 🤖",
        date: "Feb 8, 2026",
        type: "Event",
        typeColor: "bg-purple-100 text-purple-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Facebook",
        likes: "1,240",
        comments: "98",
        shares: "215",
        reach: "22.1K",
    },
];

const posts30days: PostData[] = [
    ...posts7days,
    {
        id: 8,
        caption: "Collab with @designstudio on our new collection 🤝",
        date: "Jan 30, 2026",
        type: "Reel",
        typeColor: "bg-pink-100 text-pink-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Instagram",
        likes: "8,982",
        comments: "456",
        shares: "1,203",
        reach: "112.5K",
    },
    {
        id: 9,
        caption: "📊 2026 Industry trends you need to know [Infographic]",
        date: "Feb 4, 2026",
        type: "Link",
        typeColor: "bg-teal-100 text-teal-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Facebook",
        likes: "6,540",
        comments: "189",
        shares: "1,230",
        reach: "67.8K",
    },
    {
        id: 10,
        caption: "New office reveal! Come take a tour with us 🏢",
        date: "Jan 25, 2026",
        type: "Video",
        typeColor: "bg-cyan-100 text-cyan-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "TikTok",
        likes: "28,500",
        comments: "1,120",
        shares: "3,400",
        reach: "320.4K",
    },
    {
        id: 11,
        caption: "Our philosophy on design and user experience 💡",
        date: "Jan 22, 2026",
        type: "Carousel",
        typeColor: "bg-amber-100 text-amber-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Instagram",
        likes: "4,230",
        comments: "215",
        shares: "567",
        reach: "58.2K",
    },
    {
        id: 12,
        caption: "How we scaled our team to 100+ members in 2 years 🚀",
        date: "Jan 18, 2026",
        type: "Document",
        typeColor: "bg-amber-100 text-amber-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "LinkedIn",
        likes: "15,200",
        comments: "945",
        shares: "4,120",
        reach: "210.5K",
    },
];

const posts90days: PostData[] = [
    ...posts30days,
    {
        id: 13,
        caption: "Our 2025 year in review — a thread 🧵",
        date: "Jan 2, 2026",
        type: "Thread",
        typeColor: "bg-indigo-100 text-indigo-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "LinkedIn",
        likes: "12,340",
        comments: "890",
        shares: "4,560",
        reach: "198.2K",
    },
    {
        id: 14,
        caption: "POV: When you finally automate your social 😅 #relatable",
        date: "Dec 18, 2025",
        type: "Video",
        typeColor: "bg-cyan-100 text-cyan-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "TikTok",
        likes: "78,500",
        comments: "5,420",
        shares: "15,300",
        reach: "1.2M",
    },
    {
        id: 15,
        caption: "Holiday campaign wrap-up 🎄 Thank you for the love!",
        date: "Dec 10, 2025",
        type: "Carousel",
        typeColor: "bg-amber-100 text-amber-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Facebook",
        likes: "9,120",
        comments: "678",
        shares: "2,340",
        reach: "124.5K",
    },
    {
        id: 16,
        caption: "5 mistakes you're making with your social strategy ❌",
        date: "Dec 5, 2025",
        type: "Image",
        typeColor: "bg-green-100 text-green-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Instagram",
        likes: "7,450",
        comments: "312",
        shares: "890",
        reach: "82.4K",
    },
    {
        id: 17,
        caption: "The future of e-commerce: What to expect in 2026 💸",
        date: "Nov 28, 2025",
        type: "Link",
        typeColor: "bg-blue-100 text-blue-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "Facebook",
        likes: "5,230",
        comments: "245",
        shares: "1,120",
        reach: "65.7K",
    },
    {
        id: 18,
        caption: "Employee spotlight: Meet our lead engineer, Sarah 👩‍💻",
        date: "Nov 20, 2025",
        type: "Image",
        typeColor: "bg-green-100 text-green-700",
        status: "Published",
        statusColor: "bg-green-100 text-green-700",
        platform: "LinkedIn",
        likes: "4,890",
        comments: "156",
        shares: "324",
        reach: "42.8K",
    },
];

const postsByPeriod: Record<TimePeriod, PostData[]> = {
    "7days": posts7days,
    "30days": posts30days,
    "90days": posts90days,
    "all": posts30days,
    "custom": posts30days,
};

export function getBestPostsData(period: TimePeriod): PostData[] {
    if (period === "all" || period === "custom") return postsByPeriod["30days"];
    return postsByPeriod[period];
}

// ── Period label helper ─────────────────────────
export function getPeriodLabel(period: TimePeriod): string {
    switch (period) {
        case "7days":
            return "Last 7 days";
        case "30days":
            return "Last 30 days";
        case "90days":
            return "Last 3 months";
        case "all":
            return "All time";
        case "custom":
            return "Custom range";
        default:
            return "Select period";
    }
}

// ── Trend label helper ──────────────────────────
export function getTrendLabel(period: TimePeriod): string {
    switch (period) {
        case "7days":
            return "from last week";
        case "30days":
            return "from last month";
        case "90days":
            return "from last quarter";
        default:
            return "vs previous period";
    }
}
