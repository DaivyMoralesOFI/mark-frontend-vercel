import { TimePeriod } from "@/modules/dashboard/data/dashboardMockData";
import { format, subDays, subHours } from "date-fns";

export interface PlatformProfile {
    name: string;
    handle: string;
    manager: string;
    managerAvatar: string;
    editedAgo: string;
    scores: {
        performance: number;
        growth: number;
        engagement: number;
    };
    status: "Connected" | "Pending" | "Disconnected";
}

export interface KPIMetric {
    title: string;
    value: string;
    trend: number;
    trendLabel: string;
}

export interface ChartPoint {
    date: string;
    followers: number;
    engagement: number;
}

export interface Post {
    id: string;
    caption: string;
    date: string;
    type: string;
    typeColor: string;
    status: string;
    statusColor: string;
    likes: string;
    comments: string;
    shares: string;
    reach: string;
    impressions: string;
    thumbnail?: string;
    permalink?: string;
}

export interface VisitorStat {
    source: string;
    views: number;
    fill: string;
}

export interface TrafficData {
    month: string;
    likes: number;
    comments: number;
}

export interface PlatformData {
    profile: PlatformProfile;
    kpis: KPIMetric[];
    chartData: ChartPoint[];
    posts: Post[];
    visitorStats: VisitorStat[];
    visitorTrend: number;
    trafficSources: TrafficData[];
    trafficTrend: number;
}

// ─── Chart Data Generator ──────────────────────────────────────────

const generateChartData = (
    baseFollowers: number,
    baseEngagement: number,
    period: TimePeriod = "30days"
): ChartPoint[] => {
    const data: ChartPoint[] = [];
    const now = new Date();

    let points = 30;
    if (period === "7days") points = 24;
    else if (period === "90days") points = 45;
    else if (period === "all" || period === "custom") points = 60;

    for (let i = 0; i < points; i++) {
        let dateLabel = "";

        if (period === "7days") {
            // roughly 1 point every 7 hours to fill 7 days with 24 points
            const d = subHours(now, (points - i) * 7);
            dateLabel = format(d, "HH:mm");
        } else if (period === "30days") {
            const d = subDays(now, points - i);
            dateLabel = format(d, "MMM d");
        } else if (period === "90days") {
            const d = subDays(now, (points - i) * 2); // Every 2 days
            dateLabel = format(d, "MMM d");
        } else { // "all" or "custom"
            const d = subDays(now, (points - i) * 5); // Longer range
            dateLabel = format(d, "MMM d, yyyy");
        }

        const freq1 = 0.8;
        const freq2 = 2.1;
        const freq3 = 4.5;

        const jitter = (Math.random() - 0.5) * 0.35;
        const trend = i * 0.004;

        const waveFollowers =
            Math.sin(i * freq1) * 0.1 +
            Math.sin(i * freq2) * 0.08 +
            Math.sin(i * freq3) * 0.05;

        const waveEngagement =
            Math.cos(i * (freq1 * 1.1)) * 0.12 +
            Math.cos(i * (freq2 * 0.9)) * 0.1 +
            Math.cos(i * (freq3 * 1.2)) * 0.07;

        data.push({
            date: dateLabel,
            followers: Math.round(
                baseFollowers * (1 + waveFollowers + jitter + trend)
            ),
            engagement: Math.round(
                baseEngagement * (1 + waveEngagement + jitter * 1.4 + trend)
            ),
        });
    }
    return data;
};

// ─── Platform Base Data ──────────────────────────────────────────

const platformConfigs: Record<string, any> = {
    instagram: {
        profile: {
            name: "Instagram",
            handle: "@markanalytics.ig",
            manager: "Jessica Parker",
            managerAvatar: "https://i.pravatar.cc/150?img=5",
            editedAgo: "Edited 3 hrs ago",
            scores: { performance: 8.4, growth: 6.2, engagement: 9.1 },
            status: "Connected",
        },
        bases: { followers: 12000, engagement: 5800 }
    },
    tiktok: {
        profile: {
            name: "TikTok",
            handle: "@markanalytics.tt",
            manager: "Alex Thompson",
            managerAvatar: "https://i.pravatar.cc/150?img=8",
            editedAgo: "Edited 1 hr ago",
            scores: { performance: 9.2, growth: 8.7, engagement: 9.5 },
            status: "Connected",
        },
        bases: { followers: 25000, engagement: 15000 }
    },
    facebook: {
        profile: {
            name: "Facebook",
            handle: "@MarkAnalytics",
            manager: "Maria Rodriguez",
            managerAvatar: "https://i.pravatar.cc/150?img=16",
            editedAgo: "Edited 5 hrs ago",
            scores: { performance: 6.8, growth: 4.5, engagement: 5.9 },
            status: "Connected",
        },
        bases: { followers: 8000, engagement: 3200 }
    },
    linkedin: {
        profile: {
            name: "LinkedIn",
            handle: "@mark-analytics",
            manager: "Robert Chen",
            managerAvatar: "https://i.pravatar.cc/150?img=22",
            editedAgo: "Edited 7 hrs ago",
            scores: { performance: 7.6, growth: 5.3, engagement: 6.8 },
            status: "Connected",
        },
        bases: { followers: 5000, engagement: 2400 }
    }
};

const mockPosts: Post[] = [
    { id: "01", caption: "✨ New product drop just landed! Link in bio 🔗", date: "Feb 12, 2026", type: "Reel", typeColor: "bg-pink-100 text-pink-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "3,912", comments: "184", shares: "421", reach: "45.2K", impressions: "62.1K" },
    { id: "02", caption: "Behind the scenes of our latest photoshoot 📸", date: "Feb 11, 2026", type: "Story", typeColor: "bg-purple-100 text-purple-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "2,345", comments: "92", shares: "156", reach: "28.4K", impressions: "35.7K" },
    { id: "03", caption: "Here's what our customers are saying about us ❤️", date: "Feb 10, 2026", type: "Carousel", typeColor: "bg-amber-100 text-amber-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "5,864", comments: "312", shares: "789", reach: "72.1K", impressions: "98.3K" },
    { id: "04", caption: "🎄 Holiday Gift Guide - Save up to 40% this week!", date: "Feb 15, 2026", type: "Feed Post", typeColor: "bg-blue-100 text-blue-700", status: "Scheduled", statusColor: "bg-blue-100 text-blue-700", likes: "—", comments: "—", shares: "—", reach: "—", impressions: "—" },
    { id: "05", caption: "Collab with @designstudio on our new collection 🤝", date: "Feb 8, 2026", type: "Reel", typeColor: "bg-pink-100 text-pink-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "8,982", comments: "456", shares: "1,203", reach: "112.5K", impressions: "148.9K" },
    { id: "06", caption: "5 tips for better social media engagement 📈", date: "Feb 7, 2026", type: "Feed Post", typeColor: "bg-blue-100 text-blue-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "1,245", comments: "56", shares: "89", reach: "15.2K", impressions: "22.1K" },
    { id: "07", caption: "How we scaled our team to 100+ members 🚀", date: "Feb 6, 2026", type: "Video", typeColor: "bg-cyan-100 text-cyan-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "6,782", comments: "214", shares: "567", reach: "89.4K", impressions: "124.5K" },
    { id: "08", caption: "Join our upcoming webinar on AI marketing 🤖", date: "Feb 18, 2026", type: "Link", typeColor: "bg-teal-100 text-teal-700", status: "Scheduled", statusColor: "bg-blue-100 text-blue-700", likes: "—", comments: "—", shares: "—", reach: "—", impressions: "—" },
    { id: "09", caption: "A day in the life of a social media manager ☕", date: "Feb 4, 2026", type: "Story", typeColor: "bg-purple-100 text-purple-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "3,120", comments: "128", shares: "45", reach: "12.8K", impressions: "18.6K" },
    { id: "10", caption: "Why data-driven brands outperform by 47% 📊", date: "Feb 3, 2026", type: "Carousel", typeColor: "bg-amber-100 text-amber-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "4,567", comments: "189", shares: "312", reach: "56.2K", impressions: "82.1K" },
    { id: "11", caption: "POV: When you finally finish that project 🥳", date: "Feb 2, 2026", type: "Reel", typeColor: "bg-pink-100 text-pink-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "12,450", comments: "845", shares: "2,310", reach: "185.6K", impressions: "245.2K" },
    { id: "12", caption: "Check out our latest case study with @brandX 📂", date: "Feb 1, 2026", type: "Link", typeColor: "bg-teal-100 text-teal-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "890", comments: "34", shares: "124", reach: "9.8K", impressions: "14.2K" },
    { id: "13", caption: "New office vibes! 🌿✨", date: "Jan 30, 2026", type: "Feed Post", typeColor: "bg-blue-100 text-blue-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "2,345", comments: "92", shares: "156", reach: "28.4K", impressions: "35.7K" },
    { id: "14", caption: "Employee spotlight: Meet our creative director 👩‍🎨", date: "Jan 28, 2026", type: "Video", typeColor: "bg-cyan-100 text-cyan-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "5,678", comments: "234", shares: "789", reach: "72.1K", impressions: "98.3K" },
    { id: "15", caption: "Coming soon: Something big is landing... 👀", date: "Feb 22, 2026", type: "Feed Post", typeColor: "bg-blue-100 text-blue-700", status: "Draft", statusColor: "bg-gray-100 text-gray-700", likes: "—", comments: "—", shares: "—", reach: "—", impressions: "—" },
    { id: "16", caption: "Our philosophy on user-centric design 💡", date: "Jan 25, 2026", type: "Carousel", typeColor: "bg-amber-100 text-amber-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "3,456", comments: "123", shares: "456", reach: "45.2K", impressions: "62.1K" },
    { id: "17", caption: "Behind the design: The iteration process 🎨", date: "Jan 22, 2026", type: "Reel", typeColor: "bg-pink-100 text-pink-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "7,890", comments: "345", shares: "1,234", reach: "112.5K", impressions: "148.9K" },
    { id: "18", caption: "Happy Friday! ☕✨ #fridayvibes", date: "Jan 20, 2026", type: "Story", typeColor: "bg-purple-100 text-purple-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "1,234", comments: "45", shares: "67", reach: "10.2K", impressions: "14.5K" },
    { id: "19", caption: "Sustainable growth: Our commitment to the future 🌿", date: "Jan 18, 2026", type: "Feed Post", typeColor: "bg-blue-100 text-blue-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "4,567", comments: "189", shares: "312", reach: "56.2K", impressions: "82.1K" },
    { id: "20", caption: "Thank you for 100K followers! 🥳🎉", date: "Jan 15, 2026", type: "Reel", typeColor: "bg-pink-100 text-pink-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "25,600", comments: "1,240", shares: "5,670", reach: "412.3K", impressions: "512.4K" },
];

export const getPlatformData = (platform: string, period: TimePeriod = "30days"): PlatformData | undefined => {
    const config = platformConfigs[platform.toLowerCase()];
    if (!config) return undefined;

    // Scale factors based on period
    const multipliers: Record<TimePeriod, number> = {
        "7days": 0.25,
        "30days": 1,
        "90days": 3,
        "all": 12,
        "custom": 1.5
    };

    const m = multipliers[period] || 1;
    const baseF = config.bases.followers;
    const baseE = config.bases.engagement;

    return {
        profile: config.profile,
        kpis: [
            { title: "Followers", value: `${(baseF * m / 1000).toFixed(1)}K`, trend: 12.5, trendLabel: `from prev period` },
            { title: "Engagement Rate", value: `${(4.8 + Math.random()).toFixed(1)}%`, trend: 8.3, trendLabel: `from prev period` },
            { title: "Impressions", value: `${(128.5 * m).toFixed(1)}K`, trend: -3.2, trendLabel: `from prev period` },
            { title: "Reach", value: `${(89.3 * m).toFixed(1)}K`, trend: 15.7, trendLabel: `from prev period` },
        ],
        chartData: generateChartData(baseF, baseE, period),
        posts: mockPosts.slice(0,
            period === "7days" ? 5 :
                period === "30days" ? 12 : 20
        ),
        visitorStats: [
            { source: "profile", views: Math.round(1200 * m), fill: "#d946ef" }
        ],
        visitorTrend: 5.2 + (Math.random() * 2),
        trafficSources: [
            { month: "Jan", likes: Math.round(150 * m), comments: Math.round(80 * m) },
            { month: "Feb", likes: Math.round(200 * m), comments: Math.round(150 * m) },
            { month: "Mar", likes: Math.round(180 * m), comments: Math.round(100 * m) },
            { month: "Apr", likes: Math.round(250 * m), comments: Math.round(190 * m) },
            { month: "May", likes: Math.round(210 * m), comments: Math.round(130 * m) },
            { month: "Jun", likes: Math.round(230 * m), comments: Math.round(140 * m) },
        ].slice(period === "7days" ? -2 : (period === "30days" ? -4 : -6)),
        trafficTrend: 3.8 + (Math.random() * 3),
    };
};
