// Mock data for Social Network platform views
// Each platform has: profile info, KPI metrics, chart data, and posts

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
}

export interface PlatformData {
    profile: PlatformProfile;
    kpis: KPIMetric[];
    chartData: ChartPoint[];
    posts: Post[];
}

// ─── Chart Data Generator ──────────────────────────────────────────

const generateChartData = (
    baseFollowers: number,
    baseEngagement: number,
): ChartPoint[] => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months.map((month, i) => ({
        date: `${month} '24`,
        followers: Math.round(baseFollowers + Math.sin(i * 0.8) * baseFollowers * 0.3 + i * baseFollowers * 0.05),
        engagement: Math.round(baseEngagement + Math.cos(i * 0.6) * baseEngagement * 0.4 + i * baseEngagement * 0.03),
    }));
};

// ─── Instagram ─────────────────────────────────────────────────────

const instagramData: PlatformData = {
    profile: {
        name: "Instagram",
        handle: "@markanalytics.ig",
        manager: "Jessica Parker",
        managerAvatar: "https://i.pravatar.cc/150?img=5",
        editedAgo: "Edited 3 hrs ago",
        scores: { performance: 8.4, growth: 6.2, engagement: 9.1 },
        status: "Connected",
    },
    kpis: [
        { title: "Followers", value: "45.2K", trend: 12.5, trendLabel: "from last month" },
        { title: "Engagement Rate", value: "4.8%", trend: 8.3, trendLabel: "from last month" },
        { title: "Impressions", value: "128.5K", trend: -3.2, trendLabel: "from last month" },
        { title: "Reach", value: "89.3K", trend: 15.7, trendLabel: "from last month" },
    ],
    chartData: generateChartData(12000, 5800),
    posts: [
        { id: "01", caption: "✨ New product drop just landed! Link in bio 🔗", date: "Feb 8, 2026", type: "Reel", typeColor: "bg-pink-100 text-pink-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "3,912", comments: "184", shares: "421", reach: "45.2K", impressions: "62.1K" },
        { id: "02", caption: "Behind the scenes of our latest photoshoot 📸", date: "Feb 6, 2026", type: "Story", typeColor: "bg-purple-100 text-purple-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "2,345", comments: "92", shares: "156", reach: "28.4K", impressions: "35.7K" },
        { id: "03", caption: "Here's what our customers are saying about us ❤️", date: "Feb 4, 2026", type: "Carousel", typeColor: "bg-amber-100 text-amber-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "5,864", comments: "312", shares: "789", reach: "72.1K", impressions: "98.3K" },
        { id: "04", caption: "🎄 Holiday Gift Guide - Save up to 40% this week!", date: "Feb 2, 2026", type: "Feed Post", typeColor: "bg-blue-100 text-blue-700", status: "Scheduled", statusColor: "bg-blue-100 text-blue-700", likes: "—", comments: "—", shares: "—", reach: "—", impressions: "—" },
        { id: "05", caption: "Collab with @designstudio on our new collection 🤝", date: "Jan 30, 2026", type: "Reel", typeColor: "bg-pink-100 text-pink-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "8,982", comments: "456", shares: "1,203", reach: "112.5K", impressions: "148.9K" },
    ],
};

// ─── TikTok ────────────────────────────────────────────────────────

const tiktokData: PlatformData = {
    profile: {
        name: "TikTok",
        handle: "@markanalytics.tt",
        manager: "Alex Thompson",
        managerAvatar: "https://i.pravatar.cc/150?img=8",
        editedAgo: "Edited 1 hr ago",
        scores: { performance: 9.2, growth: 8.7, engagement: 9.5 },
        status: "Connected",
    },
    kpis: [
        { title: "Followers", value: "89.4K", trend: 24.1, trendLabel: "from last month" },
        { title: "Engagement Rate", value: "7.2%", trend: 15.6, trendLabel: "from last month" },
        { title: "Impressions", value: "542.8K", trend: 32.4, trendLabel: "from last month" },
        { title: "Reach", value: "312.1K", trend: 28.9, trendLabel: "from last month" },
    ],
    chartData: generateChartData(25000, 15000),
    posts: [
        { id: "01", caption: "This hack will save you 3 hours a week 🤯 #productivity", date: "Feb 9, 2026", type: "Video", typeColor: "bg-cyan-100 text-cyan-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "45,200", comments: "2,340", shares: "8,910", reach: "512.3K", impressions: "780.1K" },
        { id: "02", caption: "POV: You just discovered our product 😂", date: "Feb 7, 2026", type: "Video", typeColor: "bg-cyan-100 text-cyan-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "23,100", comments: "1,120", shares: "4,560", reach: "298.7K", impressions: "425.3K" },
        { id: "03", caption: "Day in the life of a startup founder 🚀", date: "Feb 5, 2026", type: "Video", typeColor: "bg-cyan-100 text-cyan-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "18,750", comments: "892", shares: "3,210", reach: "201.4K", impressions: "312.8K" },
        { id: "04", caption: "Duet this if you agree! 🎤 #challenge", date: "Feb 3, 2026", type: "Duet", typeColor: "bg-red-100 text-red-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "31,400", comments: "1,890", shares: "6,780", reach: "389.2K", impressions: "545.6K" },
        { id: "05", caption: "Step-by-step tutorial: How to boost engagement 📈", date: "Feb 1, 2026", type: "Video", typeColor: "bg-cyan-100 text-cyan-700", status: "Draft", statusColor: "bg-orange-100 text-orange-700", likes: "—", comments: "—", shares: "—", reach: "—", impressions: "—" },
    ],
};

// ─── Facebook ──────────────────────────────────────────────────────

const facebookData: PlatformData = {
    profile: {
        name: "Facebook",
        handle: "@MarkAnalytics",
        manager: "Maria Rodriguez",
        managerAvatar: "https://i.pravatar.cc/150?img=16",
        editedAgo: "Edited 5 hrs ago",
        scores: { performance: 6.8, growth: 4.5, engagement: 5.9 },
        status: "Connected",
    },
    kpis: [
        { title: "Followers", value: "12.9K", trend: 3.2, trendLabel: "from last month" },
        { title: "Engagement Rate", value: "2.1%", trend: -1.4, trendLabel: "from last month" },
        { title: "Impressions", value: "67.3K", trend: 5.8, trendLabel: "from last month" },
        { title: "Reach", value: "45.8K", trend: 7.1, trendLabel: "from last month" },
    ],
    chartData: generateChartData(8000, 3200),
    posts: [
        { id: "01", caption: "🎉 Celebrating 5 years! Thank you to our community", date: "Feb 8, 2026", type: "Photo", typeColor: "bg-blue-100 text-blue-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "4,120", comments: "236", shares: "512", reach: "38.9K", impressions: "52.1K" },
        { id: "02", caption: "Join us LIVE for a Q&A session this Friday 🔴", date: "Feb 6, 2026", type: "Live", typeColor: "bg-red-100 text-red-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "2,890", comments: "1,450", shares: "320", reach: "25.6K", impressions: "41.3K" },
        { id: "03", caption: "📊 2026 Industry trends you need to know [Infographic]", date: "Feb 4, 2026", type: "Link", typeColor: "bg-teal-100 text-teal-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "6,540", comments: "189", shares: "1,230", reach: "67.8K", impressions: "89.4K" },
        { id: "04", caption: "🎪 Mark Analytics at Tech Summit 2026 - Meet us there!", date: "Feb 2, 2026", type: "Event", typeColor: "bg-violet-100 text-violet-700", status: "Scheduled", statusColor: "bg-blue-100 text-blue-700", likes: "—", comments: "—", shares: "—", reach: "—", impressions: "—" },
        { id: "05", caption: "How @janedoe grew her business 3x using analytics 💡", date: "Jan 31, 2026", type: "Photo", typeColor: "bg-blue-100 text-blue-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "5,780", comments: "312", shares: "890", reach: "52.3K", impressions: "71.8K" },
    ],
};

// ─── LinkedIn ──────────────────────────────────────────────────────

const linkedinData: PlatformData = {
    profile: {
        name: "LinkedIn",
        handle: "@mark-analytics",
        manager: "Robert Chen",
        managerAvatar: "https://i.pravatar.cc/150?img=22",
        editedAgo: "Edited 7 hrs ago",
        scores: { performance: 7.6, growth: 5.3, engagement: 6.8 },
        status: "Connected",
    },
    kpis: [
        { title: "Followers", value: "5.6K", trend: 6.8, trendLabel: "from last month" },
        { title: "Engagement Rate", value: "3.4%", trend: 11.2, trendLabel: "from last month" },
        { title: "Impressions", value: "34.2K", trend: 9.5, trendLabel: "from last month" },
        { title: "Reach", value: "22.7K", trend: 4.3, trendLabel: "from last month" },
    ],
    chartData: generateChartData(5000, 2400),
    posts: [
        { id: "01", caption: "The future of AI in marketing: 5 predictions for 2026 🧠", date: "Feb 9, 2026", type: "Article", typeColor: "bg-blue-100 text-blue-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "2,840", comments: "156", shares: "892", reach: "34.5K", impressions: "48.2K" },
        { id: "02", caption: "We're hiring! Join our growing engineering team 🚀", date: "Feb 7, 2026", type: "Job Post", typeColor: "bg-green-100 text-green-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "1,920", comments: "89", shares: "456", reach: "22.1K", impressions: "31.7K" },
        { id: "03", caption: "📈 Q4 Report: How data-driven brands outperform by 47%", date: "Feb 5, 2026", type: "Document", typeColor: "bg-amber-100 text-amber-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "8,450", comments: "423", shares: "2,310", reach: "89.6K", impressions: "124.3K" },
        { id: "04", caption: "Excited to announce our partnership with TechCorp! 🤝", date: "Feb 3, 2026", type: "Post", typeColor: "bg-indigo-100 text-indigo-700", status: "Published", statusColor: "bg-green-100 text-green-700", likes: "4,670", comments: "234", shares: "1,120", reach: "51.2K", impressions: "72.8K" },
        { id: "05", caption: "Missed our webinar? Watch the full recap here 🎥", date: "Feb 1, 2026", type: "Video", typeColor: "bg-purple-100 text-purple-700", status: "Scheduled", statusColor: "bg-blue-100 text-blue-700", likes: "—", comments: "—", shares: "—", reach: "—", impressions: "—" },
    ],
};

// ─── Platform Map ──────────────────────────────────────────────────

export const platformDataMap: Record<string, PlatformData> = {
    instagram: instagramData,
    tiktok: tiktokData,
    facebook: facebookData,
    linkedin: linkedinData,
};

export const getPlatformData = (platform: string): PlatformData | undefined => {
    return platformDataMap[platform.toLowerCase()];
};
