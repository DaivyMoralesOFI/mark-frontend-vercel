import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getInstagramFollowers, getInstagramPosts, InstagramPost } from "../services/instagramService";
import { format } from "date-fns";


import { getPlatformData } from "../data/mockData";
import { MetricsRow } from "../components/MetricsRow";
import { PerformanceChart } from "../components/PerformanceChart";
import { FinancialOverview } from "../components/FinancialOverview";
import { PostsTable } from "../components/PostsTable";
import type { TimePeriod } from "@/modules/dashboard/data/dashboardMockData";

interface SocialNetworkPageProps {
    timePeriod: TimePeriod;
}

export const SocialNetworkPage = ({ timePeriod }: SocialNetworkPageProps) => {
    const [searchParams] = useSearchParams();
    const platform = searchParams.get("platform") || "";
    const data = getPlatformData(platform, timePeriod);
    const [realFollowers, setRealFollowers] = useState<number | null>(null);
    const [realPosts, setRealPosts] = useState<InstagramPost[]>([]);

    // Instagram API Credentials
    const IG_ACCESS_TOKEN = "IGAAUfB12zZCWNBZAFpkMW11WlQxUTh1cEpwT3c5NEx4aWFyaWpZAd1VsVnFnSndLVGUyV0lVT0FEd0h5dFloZAWp2NnlaeEhiLUp3WHkxakJWR2llQlZAkSDR2Ny1ZAME1TVk9ULVB3VmFvZAEVWaHFxLWNGV2RSMlVwOTVTNlJja1QzOAZDZD"; // TODO: Move to env
    const IG_USER_ID = "25767913522879841";

    useEffect(() => {
        if (platform.toLowerCase() === "instagram") {
            const fetchData = async () => {
                const [count, posts] = await Promise.all([
                    getInstagramFollowers(IG_ACCESS_TOKEN, IG_USER_ID),
                    getInstagramPosts(IG_ACCESS_TOKEN, IG_USER_ID)
                ]);

                if (count !== null) setRealFollowers(count);
                if (posts) setRealPosts(posts);
            };
            fetchData();
        } else {
            setRealFollowers(null);
            setRealPosts([]);
        }
    }, [platform]);

    // Create a derived data object to avoid mutation issues
    const displayData = data ? { ...data } : undefined;

    // Override follower count if available
    if (displayData && realFollowers !== null && platform.toLowerCase() === "instagram") {
        const kpis = [...displayData.kpis];
        const followerKpiIndex = kpis.findIndex(k => k.title === "Followers");

        if (followerKpiIndex !== -1) {
            kpis[followerKpiIndex] = {
                ...kpis[followerKpiIndex],
                value: new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(realFollowers)
            };
            displayData.kpis = kpis;
        }
    }

    // Override posts if available
    if (displayData && realPosts.length > 0 && platform.toLowerCase() === "instagram") {
        displayData.posts = realPosts.map(post => {
            let type = "Post";
            let typeColor = "bg-gray-100 text-gray-700";

            if (post.media_type === "VIDEO") {
                type = "Reel";
                typeColor = "bg-pink-100 text-pink-700";
            } else if (post.media_type === "CAROUSEL_ALBUM") {
                type = "Carousel";
                typeColor = "bg-amber-100 text-amber-700";
            } else {
                type = "Image";
                typeColor = "bg-blue-100 text-blue-700";
            }

            return {
                id: post.id,
                caption: post.caption || "No caption",
                date: format(new Date(post.timestamp), "MMM d, yyyy"),
                type,
                typeColor,
                status: "Published",
                statusColor: "bg-green-100 text-green-700",
                likes: post.like_count !== undefined ? new Intl.NumberFormat('en-US').format(post.like_count) : "—",
                comments: post.comments_count !== undefined ? new Intl.NumberFormat('en-US').format(post.comments_count) : "—",
                shares: "—", // Not available
                reach: "—", // Not available
                impressions: "—", // Not available
            };
        });
    }

    if (!displayData) {
        return (
            <div className="flex items-center justify-center h-64 text-on-surface-variant text-sm bg-surface">
                Select a platform from the sidebar to view analytics.
            </div>
        );
    }

    return (
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface dark:bg-transparent h-full py-2 px-4 overflow-hidden">
            {/* Left column: KPIs + Chart - Scrollable */}
            <div className="lg:col-span-7 flex flex-col gap-8 lg:border-r lg:border-outline-variant lg:pr-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
                <div className="flex flex-col gap-4">
                    <MetricsRow metrics={displayData.kpis} />

                    <div className="border-y border-outline-variant py-2">
                        <PerformanceChart
                            data={displayData.chartData}
                            platformName={displayData.profile.name}
                            timePeriod={timePeriod}
                        />
                    </div>
                    <FinancialOverview
                        visitorStats={displayData.visitorStats}
                        visitorTrend={displayData.visitorTrend}
                        trafficSources={displayData.trafficSources}
                        trafficTrend={displayData.trafficTrend}
                        timePeriod={timePeriod}
                    />
                </div>
            </div>

            {/* Right column: Posts Table - Also Scrollable independently if needed */}
            <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
                <PostsTable posts={displayData.posts} platformName={displayData.profile.name} timePeriod={timePeriod} />
            </div>
        </div>
    );
};

export default SocialNetworkPage;
