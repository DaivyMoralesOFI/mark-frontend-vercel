// ────────────────────────────────────────────────
// Centralized mock data for the dashboard, keyed by time period
// ────────────────────────────────────────────────

export type TimePeriod = "7days" | "30days" | "90days";

// ── Helpers ──────────────────────────────────────
function generateChartPoints(count: number, min: number, max: number, startDate: string) {
    const start = new Date(startDate);
    return Array.from({ length: count }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return {
            date: d.toISOString().slice(0, 10),
            desktop: Math.round(min + Math.random() * (max - min)),
        };
    });
}

function generateMiniChart(count: number, min: number, max: number) {
    return Array.from({ length: count }, (_, i) => ({
        day: i + 1,
        value: Math.round(min + Math.random() * (max - min)),
    }));
}

// Use a seeded‑style deterministic approach by hard-coding the data so it
// doesn't flicker on every re-render.

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
};

export function getKpiData(period: TimePeriod): KpiData {
    return kpiByPeriod[period];
}

// ── Overview Chart Data ─────────────────────────
const overviewChart7 = [
    { date: "2024-04-24", desktop: 312 },
    { date: "2024-04-25", desktop: 215 },
    { date: "2024-04-26", desktop: 175 },
    { date: "2024-04-27", desktop: 383 },
    { date: "2024-04-28", desktop: 122 },
    { date: "2024-04-29", desktop: 315 },
    { date: "2024-04-30", desktop: 454 },
];

const overviewChart30 = [
    { date: "2024-04-01", desktop: 222 },
    { date: "2024-04-02", desktop: 97 },
    { date: "2024-04-03", desktop: 167 },
    { date: "2024-04-04", desktop: 242 },
    { date: "2024-04-05", desktop: 373 },
    { date: "2024-04-06", desktop: 301 },
    { date: "2024-04-07", desktop: 245 },
    { date: "2024-04-08", desktop: 409 },
    { date: "2024-04-09", desktop: 59 },
    { date: "2024-04-10", desktop: 261 },
    { date: "2024-04-11", desktop: 327 },
    { date: "2024-04-12", desktop: 292 },
    { date: "2024-04-13", desktop: 342 },
    { date: "2024-04-14", desktop: 137 },
    { date: "2024-04-15", desktop: 120 },
    { date: "2024-04-16", desktop: 138 },
    { date: "2024-04-17", desktop: 446 },
    { date: "2024-04-18", desktop: 364 },
    { date: "2024-04-19", desktop: 243 },
    { date: "2024-04-20", desktop: 89 },
    { date: "2024-04-21", desktop: 137 },
    { date: "2024-04-22", desktop: 224 },
    { date: "2024-04-23", desktop: 138 },
    { date: "2024-04-24", desktop: 387 },
    { date: "2024-04-25", desktop: 215 },
    { date: "2024-04-26", desktop: 75 },
    { date: "2024-04-27", desktop: 383 },
    { date: "2024-04-28", desktop: 122 },
    { date: "2024-04-29", desktop: 315 },
    { date: "2024-04-30", desktop: 454 },
];

const overviewChart90 = [
    { date: "2024-02-01", desktop: 180 },
    { date: "2024-02-04", desktop: 245 },
    { date: "2024-02-07", desktop: 310 },
    { date: "2024-02-10", desktop: 160 },
    { date: "2024-02-13", desktop: 420 },
    { date: "2024-02-16", desktop: 290 },
    { date: "2024-02-19", desktop: 350 },
    { date: "2024-02-22", desktop: 195 },
    { date: "2024-02-25", desktop: 480 },
    { date: "2024-02-28", desktop: 220 },
    { date: "2024-03-02", desktop: 375 },
    { date: "2024-03-05", desktop: 140 },
    { date: "2024-03-08", desktop: 450 },
    { date: "2024-03-11", desktop: 280 },
    { date: "2024-03-14", desktop: 330 },
    { date: "2024-03-17", desktop: 190 },
    { date: "2024-03-20", desktop: 410 },
    { date: "2024-03-23", desktop: 260 },
    { date: "2024-03-26", desktop: 520 },
    { date: "2024-03-29", desktop: 170 },
    { date: "2024-04-01", desktop: 380 },
    { date: "2024-04-04", desktop: 300 },
    { date: "2024-04-07", desktop: 245 },
    { date: "2024-04-10", desktop: 460 },
    { date: "2024-04-13", desktop: 210 },
    { date: "2024-04-16", desktop: 390 },
    { date: "2024-04-19", desktop: 150 },
    { date: "2024-04-22", desktop: 340 },
    { date: "2024-04-25", desktop: 270 },
    { date: "2024-04-30", desktop: 454 },
];

const overviewChartByPeriod: Record<TimePeriod, { date: string; desktop: number }[]> = {
    "7days": overviewChart7,
    "30days": overviewChart30,
    "90days": overviewChart90,
};

export function getOverviewChartData(period: TimePeriod) {
    return overviewChartByPeriod[period];
}

// ── Social Performance Data ─────────────────────
export interface SocialNetworkData {
    name: string;
    data: { day: number; value: number }[];
    color: string;
    total: string;
    trend?: number;
}

const socialDataByPeriod: Record<TimePeriod, SocialNetworkData[]> = {
    "7days": [
        {
            name: "Instagram",
            data: [
                { day: 1, value: 38 }, { day: 2, value: 52 }, { day: 3, value: 41 }, { day: 4, value: 67 },
                { day: 5, value: 45 }, { day: 6, value: 58 }, { day: 7, value: 72 }, { day: 8, value: 55 },
                { day: 9, value: 48 }, { day: 10, value: 63 }, { day: 11, value: 78 }, { day: 12, value: 60 },
                { day: 13, value: 71 }, { day: 14, value: 56 }, { day: 15, value: 82 }, { day: 16, value: 74 },
                { day: 17, value: 68 }, { day: 18, value: 85 }, { day: 19, value: 79 }, { day: 20, value: 88 },
            ],
            color: "#8884d8",
            total: "8.4k",
            trend: 3.2,
        },
        {
            name: "Facebook",
            data: [
                { day: 1, value: 74 }, { day: 2, value: 68 }, { day: 3, value: 71 }, { day: 4, value: 58 },
                { day: 5, value: 65 }, { day: 6, value: 72 }, { day: 7, value: 54 }, { day: 8, value: 61 },
                { day: 9, value: 49 }, { day: 10, value: 56 }, { day: 11, value: 63 }, { day: 12, value: 45 },
                { day: 13, value: 52 }, { day: 14, value: 58 }, { day: 15, value: 41 }, { day: 16, value: 47 },
                { day: 17, value: 55 }, { day: 18, value: 38 }, { day: 19, value: 44 }, { day: 20, value: 40 },
            ],
            color: "#8884d8",
            total: "2.1k",
            trend: -1.4,
        },
        {
            name: "TikTok",
            data: [
                { day: 1, value: 25 }, { day: 2, value: 34 }, { day: 3, value: 28 }, { day: 4, value: 48 },
                { day: 5, value: 38 }, { day: 6, value: 32 }, { day: 7, value: 55 }, { day: 8, value: 42 },
                { day: 9, value: 61 }, { day: 10, value: 50 }, { day: 11, value: 44 }, { day: 12, value: 68 },
                { day: 13, value: 58 }, { day: 14, value: 75 }, { day: 15, value: 62 }, { day: 16, value: 70 },
                { day: 17, value: 82 }, { day: 18, value: 71 }, { day: 19, value: 90 }, { day: 20, value: 86 },
            ],
            color: "#8884d8",
            total: "18.2k",
            trend: 7.8,
        },
        {
            name: "LinkedIn",
            data: [
                { day: 1, value: 42 }, { day: 2, value: 36 }, { day: 3, value: 50 }, { day: 4, value: 44 },
                { day: 5, value: 39 }, { day: 6, value: 53 }, { day: 7, value: 47 }, { day: 8, value: 41 },
                { day: 9, value: 55 }, { day: 10, value: 48 }, { day: 11, value: 60 }, { day: 12, value: 52 },
                { day: 13, value: 45 }, { day: 14, value: 58 }, { day: 15, value: 64 }, { day: 16, value: 50 },
                { day: 17, value: 62 }, { day: 18, value: 56 }, { day: 19, value: 65 }, { day: 20, value: 60 },
            ],
            color: "#8884d8",
            total: "1.2k",
            trend: 2.1,
        },
    ],
    "30days": [
        {
            name: "Instagram",
            data: [
                { day: 1, value: 22 }, { day: 2, value: 35 }, { day: 3, value: 18 }, { day: 4, value: 42 },
                { day: 5, value: 30 }, { day: 6, value: 55 }, { day: 7, value: 38 }, { day: 8, value: 28 },
                { day: 9, value: 50 }, { day: 10, value: 45 }, { day: 11, value: 62 }, { day: 12, value: 48 },
                { day: 13, value: 58 }, { day: 14, value: 40 }, { day: 15, value: 70 }, { day: 16, value: 55 },
                { day: 17, value: 65 }, { day: 18, value: 72 }, { day: 19, value: 60 }, { day: 20, value: 78 },
            ],
            color: "#8884d8",
            total: "45.2k",
            trend: 12.5,
        },
        {
            name: "Facebook",
            data: [
                { day: 1, value: 82 }, { day: 2, value: 75 }, { day: 3, value: 80 }, { day: 4, value: 65 },
                { day: 5, value: 72 }, { day: 6, value: 60 }, { day: 7, value: 68 }, { day: 8, value: 75 },
                { day: 9, value: 55 }, { day: 10, value: 62 }, { day: 11, value: 48 }, { day: 12, value: 58 },
                { day: 13, value: 42 }, { day: 14, value: 55 }, { day: 15, value: 38 }, { day: 16, value: 50 },
                { day: 17, value: 44 }, { day: 18, value: 35 }, { day: 19, value: 42 }, { day: 20, value: 32 },
            ],
            color: "#8884d8",
            total: "12.9k",
            trend: -3.2,
        },
        {
            name: "TikTok",
            data: [
                { day: 1, value: 15 }, { day: 2, value: 28 }, { day: 3, value: 20 }, { day: 4, value: 38 },
                { day: 5, value: 25 }, { day: 6, value: 45 }, { day: 7, value: 35 }, { day: 8, value: 52 },
                { day: 9, value: 40 }, { day: 10, value: 58 }, { day: 11, value: 48 }, { day: 12, value: 65 },
                { day: 13, value: 55 }, { day: 14, value: 72 }, { day: 15, value: 60 }, { day: 16, value: 78 },
                { day: 17, value: 68 }, { day: 18, value: 85 }, { day: 19, value: 75 }, { day: 20, value: 92 },
            ],
            color: "#8884d8",
            total: "89.4k",
            trend: 15.3,
        },
        {
            name: "LinkedIn",
            data: [
                { day: 1, value: 30 }, { day: 2, value: 42 }, { day: 3, value: 35 }, { day: 4, value: 28 },
                { day: 5, value: 45 }, { day: 6, value: 38 }, { day: 7, value: 50 }, { day: 8, value: 42 },
                { day: 9, value: 55 }, { day: 10, value: 48 }, { day: 11, value: 38 }, { day: 12, value: 58 },
                { day: 13, value: 52 }, { day: 14, value: 62 }, { day: 15, value: 45 }, { day: 16, value: 58 },
                { day: 17, value: 65 }, { day: 18, value: 55 }, { day: 19, value: 68 }, { day: 20, value: 62 },
            ],
            color: "#8884d8",
            total: "5.6k",
            trend: 4.7,
        },
    ],
    "90days": [
        {
            name: "Instagram",
            data: [
                { day: 1, value: 18 }, { day: 2, value: 30 }, { day: 3, value: 12 }, { day: 4, value: 38 },
                { day: 5, value: 25 }, { day: 6, value: 48 }, { day: 7, value: 32 }, { day: 8, value: 55 },
                { day: 9, value: 42 }, { day: 10, value: 35 }, { day: 11, value: 60 }, { day: 12, value: 50 },
                { day: 13, value: 68 }, { day: 14, value: 58 }, { day: 15, value: 45 }, { day: 16, value: 72 },
                { day: 17, value: 65 }, { day: 18, value: 80 }, { day: 19, value: 70 }, { day: 20, value: 85 },
            ],
            color: "#8884d8",
            total: "132.8k",
            trend: 22.1,
        },
        {
            name: "Facebook",
            data: [
                { day: 1, value: 88 }, { day: 2, value: 80 }, { day: 3, value: 85 }, { day: 4, value: 72 },
                { day: 5, value: 78 }, { day: 6, value: 82 }, { day: 7, value: 65 }, { day: 8, value: 70 },
                { day: 9, value: 58 }, { day: 10, value: 65 }, { day: 11, value: 52 }, { day: 12, value: 60 },
                { day: 13, value: 48 }, { day: 14, value: 55 }, { day: 15, value: 42 }, { day: 16, value: 50 },
                { day: 17, value: 38 }, { day: 18, value: 45 }, { day: 19, value: 30 }, { day: 20, value: 35 },
            ],
            color: "#8884d8",
            total: "38.4k",
            trend: -5.8,
        },
        {
            name: "TikTok",
            data: [
                { day: 1, value: 12 }, { day: 2, value: 22 }, { day: 3, value: 8 }, { day: 4, value: 35 },
                { day: 5, value: 18 }, { day: 6, value: 42 }, { day: 7, value: 30 }, { day: 8, value: 55 },
                { day: 9, value: 38 }, { day: 10, value: 62 }, { day: 11, value: 48 }, { day: 12, value: 70 },
                { day: 13, value: 58 }, { day: 14, value: 45 }, { day: 15, value: 75 }, { day: 16, value: 65 },
                { day: 17, value: 82 }, { day: 18, value: 72 }, { day: 19, value: 88 }, { day: 20, value: 95 },
            ],
            color: "#8884d8",
            total: "245.1k",
            trend: 28.4,
        },
        {
            name: "LinkedIn",
            data: [
                { day: 1, value: 28 }, { day: 2, value: 35 }, { day: 3, value: 22 }, { day: 4, value: 40 },
                { day: 5, value: 32 }, { day: 6, value: 48 }, { day: 7, value: 38 }, { day: 8, value: 30 },
                { day: 9, value: 52 }, { day: 10, value: 45 }, { day: 11, value: 55 }, { day: 12, value: 42 },
                { day: 13, value: 60 }, { day: 14, value: 50 }, { day: 15, value: 65 }, { day: 16, value: 55 },
                { day: 17, value: 48 }, { day: 18, value: 68 }, { day: 19, value: 62 }, { day: 20, value: 72 },
            ],
            color: "#8884d8",
            total: "16.8k",
            trend: 9.3,
        },
    ],
};

export function getSocialData(period: TimePeriod): SocialNetworkData[] {
    return socialDataByPeriod[period];
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
};

export function getBestPostsData(period: TimePeriod): PostData[] {
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
    }
}
