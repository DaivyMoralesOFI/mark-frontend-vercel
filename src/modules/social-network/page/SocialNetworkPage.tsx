import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getInstagramFollowers, getInstagramPosts, getInstagramInsights, InstagramPost } from "../services/instagramService";
import { getFacebookPageInfo, getFacebookPosts, getFacebookPageInsights, FacebookPageInfo, FacebookPost } from "../services/facebookService";
import { format, subDays } from "date-fns";
import type { TimePeriod } from "@/modules/dashboard/data/dashboardMockData";
import { getPlatformData } from "../data/mockData";
import { MetricsRow } from "../components/MetricsRow";
import { PerformanceChart } from "../components/PerformanceChart";
import { FinancialOverview } from "../components/FinancialOverview";
import { PostsTable } from "../components/PostsTable";

// Helper to calculate chart data from real posts
const calculateRealChartData = (posts: any[], baseFollowers: number, period: TimePeriod): any[] => {
    const data: any[] = [];
    const now = new Date();
    let points = 30;

    // Determine number of points based on period
    if (period === "7days") points = 7;
    else if (period === "30days") points = 30;
    else if (period === "90days") points = 45;
    else points = 60; // all/custom

    // Group posts by date
    const postsByDate = new Map<string, { likes: number, comments: number }>();
    posts.forEach(post => {
        const dateStr = format(new Date(post.created_time || post.timestamp), "yyyy-MM-dd");
        const current = postsByDate.get(dateStr) || { likes: 0, comments: 0 };

        // Handle different API response structures
        let likes = 0;
        let comments = 0;

        // Facebook structure
        if (post.likes?.summary) likes = post.likes.summary.total_count;
        // Instagram structure
        else if (post.like_count) likes = post.like_count; // Instagram

        // Facebook structure
        if (post.comments?.summary) comments = post.comments.summary.total_count;
        // Instagram structure
        else if (post.comments_count) comments = post.comments_count;

        postsByDate.set(dateStr, {
            likes: current.likes + likes,
            comments: current.comments + comments
        });
    });

    // Generate points
    for (let i = 0; i < points; i++) {
        let dateObj: Date;
        let dateLabel: string;
        let dateKey: string;

        if (period === "7days") {
            dateObj = subDays(now, points - 1 - i);
            dateLabel = format(dateObj, "EEE"); // Mon, Tue
            dateKey = format(dateObj, "yyyy-MM-dd");
        } else if (period === "90days") {
            dateObj = subDays(now, (points - 1 - i) * 2);
            dateLabel = format(dateObj, "MMM d");
            dateKey = format(dateObj, "yyyy-MM-dd");
        } else if (period === "all" || period === "custom") {
            dateObj = subDays(now, (points - 1 - i) * 5);
            dateLabel = format(dateObj, "MMM d, yyyy");
            dateKey = format(dateObj, "yyyy-MM-dd");
        } else { // 30days
            dateObj = subDays(now, points - 1 - i);
            dateLabel = format(dateObj, "MMM d");
            dateKey = format(dateObj, "yyyy-MM-dd");
        }

        const dayMetrics = postsByDate.get(dateKey) || { likes: 0, comments: 0 };

        // Simulate a slight trend in followers around the current base
        // Since we don't have historical follower data from API
        const randomVariation = Math.floor(Math.random() * 10) - 5;
        // Trend slightly down as we go back in time
        const historyFactor = i * 2;
        let estimatedFollowers = baseFollowers - (points * 2) + historyFactor + randomVariation;

        // Ensure never negative
        if (estimatedFollowers < 0) estimatedFollowers = 0;

        const engagement = dayMetrics.likes + dayMetrics.comments;

        data.push({
            date: dateLabel,
            followers: estimatedFollowers,
            engagement: engagement < 0 ? 0 : engagement
        });
    }

    return data;
};

interface SocialNetworkPageProps {
    timePeriod: TimePeriod;
}

export const SocialNetworkPage = ({ timePeriod }: SocialNetworkPageProps) => {
    const [searchParams] = useSearchParams();
    const platform = searchParams.get("platform") || "";
    const data = getPlatformData(platform, timePeriod);

    // Instagram State
    const [realIgFollowers, setRealIgFollowers] = useState<number | null>(null);
    const [realIgPosts, setRealIgPosts] = useState<InstagramPost[]>([]);
    const [realIgInsights, setRealIgInsights] = useState<{ impressions: number; reach: number; profileViews: number } | null>(null);

    // Facebook State
    const [realFbPageInfo, setRealFbPageInfo] = useState<FacebookPageInfo | null>(null);
    const [realFbPosts, setRealFbPosts] = useState<FacebookPost[]>([]);
    const [realFbInsights, setRealFbInsights] = useState<{ impressions: number; reach: number; engagement: number; pageViews: number } | null>(null);

    // Loading & Error States
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Instagram API Credentials
    const IG_ACCESS_TOKEN = import.meta.env.VITE_IG_ACCESS_TOKEN;
    const IG_USER_ID = import.meta.env.VITE_IG_USER_ID;

    // Facebook API Credentials
    const FB_ACCESS_TOKEN = import.meta.env.VITE_FB_PAGE_ACCESS_TOKEN;
    const FB_PAGE_ID = import.meta.env.VITE_FB_PAGE_ID;

    useEffect(() => {
        const fetchInstagramData = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const [count, posts, insights] = await Promise.all([
                    getInstagramFollowers(IG_ACCESS_TOKEN, IG_USER_ID),
                    getInstagramPosts(IG_ACCESS_TOKEN, IG_USER_ID),
                    getInstagramInsights(IG_ACCESS_TOKEN, IG_USER_ID)
                ]);

                if (count === null && (!posts || posts.length === 0)) {
                    setFetchError("Unable to fetch Instagram data. Please check your API credentials.");
                } else {
                    if (count !== null) setRealIgFollowers(count);
                    if (posts) setRealIgPosts(posts);
                    if (insights) setRealIgInsights(insights);
                }
            } catch {
                setFetchError("Failed to connect to Instagram API. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchFacebookData = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const [pageInfo, posts, insights] = await Promise.all([
                    getFacebookPageInfo(FB_ACCESS_TOKEN, FB_PAGE_ID),
                    getFacebookPosts(FB_ACCESS_TOKEN, FB_PAGE_ID),
                    getFacebookPageInsights(FB_ACCESS_TOKEN, FB_PAGE_ID)
                ]);

                if (!pageInfo && (!posts || posts.length === 0)) {
                    setFetchError("Unable to fetch Facebook data. Please check your API credentials.");
                } else {
                    if (pageInfo) setRealFbPageInfo(pageInfo);
                    if (posts) setRealFbPosts(posts);
                    if (insights) setRealFbInsights(insights);
                }
            } catch {
                setFetchError("Failed to connect to Facebook API. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (platform.toLowerCase() === "instagram") {
            fetchInstagramData();
            setRealFbPageInfo(null);
            setRealFbPosts([]);
            setRealFbInsights(null);
        } else if (platform.toLowerCase() === "facebook") {
            fetchFacebookData();
            setRealIgFollowers(null);
            setRealIgPosts([]);
            setRealIgInsights(null);
        } else {
            setRealIgFollowers(null);
            setRealIgPosts([]);
            setRealIgInsights(null);
            setRealFbPageInfo(null);
            setRealFbPosts([]);
            setRealFbInsights(null);
            setIsLoading(false);
            setFetchError(null);
        }
    }, [platform]);

    // Create a derived data object to avoid mutation issues
    const displayData = data ? { ...data } : undefined;

    // --- Instagram Overrides ---
    if (displayData && platform.toLowerCase() === "instagram") {
        const kpis = [...displayData.kpis];

        if (realIgFollowers !== null) {
            const followerIndex = kpis.findIndex(k => k.title === "Followers");
            if (followerIndex !== -1) {
                kpis[followerIndex] = {
                    ...kpis[followerIndex],
                    value: new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(realIgFollowers)
                };
            }
        }

        // Calculate Totals from Posts
        let totalEngagement = 0;
        let totalImpressions = 0;
        let totalReach = 0;

        if (realIgPosts.length > 0) {
            realIgPosts.forEach(post => {
                totalEngagement += (post.like_count || 0) + (post.comments_count || 0);

                // Aggregate insights from posts if available
                if (post.insights && post.insights.data) {
                    const impData = post.insights.data.find(d => d.name === "impressions");
                    const reachData = post.insights.data.find(d => d.name === "reach");
                    if (impData && impData.values.length > 0) totalImpressions += impData.values[0].value;
                    if (reachData && reachData.values.length > 0) totalReach += reachData.values[0].value;
                }
            });
        }

        // Determine values to display
        // Use Page Insights if available and valid (>0), otherwise use Aggregated Post Data
        // If Page Insights is null, we assume it failed or no permission, so we fallback to posts.
        const finalImpressions = (realIgInsights && realIgInsights.impressions > 0) ? realIgInsights.impressions : totalImpressions;
        const finalReach = (realIgInsights && realIgInsights.reach > 0) ? realIgInsights.reach : totalReach;
        const finalEngagement = totalEngagement; // Instagram API doesn't give a "total engagement" metric for user, so we sum posts.

        const engagementRate = finalReach > 0 ? (finalEngagement / finalReach) * 100 : 0;

        // Update Engagement Rate
        const engagementIndex = kpis.findIndex(k => k.title === "Engagement Rate");
        if (engagementIndex !== -1) {
            kpis[engagementIndex] = {
                title: "Engagement Rate",
                value: engagementRate.toFixed(1) + "%",
                trend: 0,
                trendLabel: "vs last fetching"
            };
        }

        // Update Impressions
        const impressionsIndex = kpis.findIndex(k => k.title === "Impressions");
        if (impressionsIndex !== -1) {
            kpis[impressionsIndex] = {
                ...kpis[impressionsIndex],
                value: new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(finalImpressions)
            };
        }

        // Update Reach
        const reachIndex = kpis.findIndex(k => k.title === "Reach");
        if (reachIndex !== -1) {
            kpis[reachIndex] = {
                ...kpis[reachIndex],
                value: new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(finalReach)
            };
        }

        displayData.kpis = kpis;

        // Chart Data
        if (realIgPosts.length > 0 && realIgFollowers !== null) {
            displayData.chartData = calculateRealChartData(realIgPosts, realIgFollowers, timePeriod);
        }

        // Profile Views (Radial Chart)
        const profileViews = (realIgInsights && realIgInsights.profileViews > 0) ? realIgInsights.profileViews : 0;
        displayData.visitorStats = [{ source: "profile", views: profileViews, fill: "#d946ef" }];
        displayData.visitorTrend = 0;

        // Engagement Breakdown (Bar Chart) — aggregate likes/comments by month from posts
        if (realIgPosts.length > 0) {
            const engagementByMonth = new Map<string, { likes: number; comments: number }>();
            realIgPosts.forEach(post => {
                const monthKey = format(new Date(post.timestamp), "MMM");
                const current = engagementByMonth.get(monthKey) || { likes: 0, comments: 0 };
                engagementByMonth.set(monthKey, {
                    likes: current.likes + (post.like_count || 0),
                    comments: current.comments + (post.comments_count || 0),
                });
            });
            displayData.trafficSources = Array.from(engagementByMonth.entries()).map(([month, data]) => ({
                month,
                likes: data.likes,
                comments: data.comments,
            }));
            displayData.trafficTrend = 0;
        }

        // Post Mapping
        if (realIgPosts.length > 0) {
            displayData.posts = realIgPosts.map(post => {
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

                // Extract insights if available
                let impressions = "—";
                let reach = "—";

                if (post.insights && post.insights.data) {
                    const impData = post.insights.data.find(d => d.name === "impressions");
                    const reachData = post.insights.data.find(d => d.name === "reach");

                    if (impData && impData.values.length > 0) {
                        impressions = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(impData.values[0].value);
                    }
                    if (reachData && reachData.values.length > 0) {
                        reach = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(reachData.values[0].value);
                    }
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
                    shares: "—",
                    reach,
                    impressions,
                    thumbnail: post.media_url || undefined,
                    permalink: post.permalink || undefined,
                };
            });
        }
    }

    // --- Facebook Overrides ---
    if (displayData && platform.toLowerCase() === "facebook") {
        displayData.posts = []; // Clear mock

        const kpis = [...displayData.kpis];

        if (realFbPageInfo) {
            const followerIndex = kpis.findIndex(k => k.title === "Followers");
            if (followerIndex !== -1) {
                kpis[followerIndex] = {
                    ...kpis[followerIndex],
                    value: new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(realFbPageInfo.followers_count)
                };
            }
        }

        // Calculate Totals from Posts
        let totalEngagement = 0;
        let totalImpressions = 0;
        let totalReach = 0;

        if (realFbPosts.length > 0) {
            realFbPosts.forEach(post => {
                const likes = post.likes?.summary?.total_count || 0;
                const comments = post.comments?.summary?.total_count || 0;
                const shares = post.shares?.count || 0;
                totalEngagement += (likes + comments + shares);

                // Aggregate insights from posts if available
                if (post.insights && post.insights.data) {
                    const impData = post.insights.data.find(d => d.name === "post_impressions");
                    const reachData = post.insights.data.find(d => d.name === "post_impressions_unique");
                    if (impData && impData.values.length > 0) totalImpressions += impData.values[0].value;
                    if (reachData && reachData.values.length > 0) totalReach += reachData.values[0].value;
                }
            });
        }

        // Use Page Insights if available and valid (>0)
        // Otherwise use aggregated Post Data
        const finalImpressions = (realFbInsights && realFbInsights.impressions > 0) ? realFbInsights.impressions : totalImpressions;
        const finalReach = (realFbInsights && realFbInsights.reach > 0) ? realFbInsights.reach : totalReach;
        const finalEngagement = (realFbInsights && realFbInsights.engagement > 0) ? realFbInsights.engagement : totalEngagement;

        const engagementRate = finalReach > 0 ? (finalEngagement / finalReach) * 100 : 0;

        // Update Engagement Rate
        const engagementIndex = kpis.findIndex(k => k.title.includes("Engagement"));
        if (engagementIndex !== -1) {
            kpis[engagementIndex] = {
                title: "Engagement Rate",
                value: engagementRate.toFixed(1) + "%",
                trend: 0,
                trendLabel: "vs last fetching"
            };
        }

        // Update Impressions
        const impressionsIndex = kpis.findIndex(k => k.title === "Impressions");
        if (impressionsIndex !== -1) {
            kpis[impressionsIndex] = {
                ...kpis[impressionsIndex],
                value: new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(finalImpressions)
            };
        }

        // Update Reach
        const reachIndex = kpis.findIndex(k => k.title === "Reach");
        if (reachIndex !== -1) {
            kpis[reachIndex] = {
                ...kpis[reachIndex],
                value: new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(finalReach)
            };
        }

        displayData.kpis = kpis;

        // Chart Data
        const currentFollowers = realFbPageInfo?.followers_count || 0;
        if (realFbPosts.length > 0) {
            displayData.chartData = calculateRealChartData(realFbPosts, currentFollowers, timePeriod);
        }

        // Profile Views (Radial Chart)
        const pageViews = (realFbInsights && realFbInsights.pageViews > 0) ? realFbInsights.pageViews : 0;
        displayData.visitorStats = [{ source: "profile", views: pageViews, fill: "#d946ef" }];
        displayData.visitorTrend = 0;

        // Engagement Breakdown (Bar Chart) — aggregate likes/comments by month from posts
        if (realFbPosts.length > 0) {
            const engagementByMonth = new Map<string, { likes: number; comments: number }>();
            realFbPosts.forEach(post => {
                const monthKey = format(new Date(post.created_time), "MMM");
                const current = engagementByMonth.get(monthKey) || { likes: 0, comments: 0 };
                engagementByMonth.set(monthKey, {
                    likes: current.likes + (post.likes?.summary?.total_count || 0),
                    comments: current.comments + (post.comments?.summary?.total_count || 0),
                });
            });
            displayData.trafficSources = Array.from(engagementByMonth.entries()).map(([month, data]) => ({
                month,
                likes: data.likes,
                comments: data.comments,
            }));
            displayData.trafficTrend = 0;
        }

        // Map Posts
        if (realFbPosts.length > 0) {
            displayData.posts = realFbPosts.map(post => {
                let type = "Post";
                let typeColor = "bg-blue-100 text-blue-700";

                // Try to determine type from attachments
                if (post.attachments && post.attachments.data && post.attachments.data.length > 0) {
                    const mediaType = post.attachments.data[0].media_type;
                    if (mediaType === "video") {
                        type = "Video";
                        typeColor = "bg-cyan-100 text-cyan-700";
                    } else if (mediaType === "photo") {
                        type = "Photo";
                        typeColor = "bg-blue-100 text-blue-700";
                    } else if (mediaType === "album") {
                        type = "Album";
                        typeColor = "bg-amber-100 text-amber-700";
                    } else if (mediaType === "link") {
                        type = "Link";
                        typeColor = "bg-teal-100 text-teal-700";
                    } else if (mediaType === "event") {
                        type = "Event";
                        typeColor = "bg-purple-100 text-purple-700";
                    }
                }

                // Extract insights if available
                let impressions = "—";
                let reach = "—";

                if (post.insights && post.insights.data) {
                    const impData = post.insights.data.find(d => d.name === "post_impressions");
                    const reachData = post.insights.data.find(d => d.name === "post_impressions_unique");

                    if (impData && impData.values.length > 0) {
                        impressions = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(impData.values[0].value);
                    }
                    if (reachData && reachData.values.length > 0) {
                        reach = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(reachData.values[0].value);
                    }
                }

                return {
                    id: post.id,
                    caption: post.message || "No caption",
                    date: format(new Date(post.created_time), "MMM d, yyyy"),
                    type,
                    typeColor,
                    status: "Published",
                    statusColor: "bg-green-100 text-green-700",
                    likes: post.likes?.summary?.total_count !== undefined ? new Intl.NumberFormat('en-US').format(post.likes.summary.total_count) : "0",
                    comments: post.comments?.summary?.total_count !== undefined ? new Intl.NumberFormat('en-US').format(post.comments.summary.total_count) : "0",
                    shares: post.shares?.count !== undefined ? new Intl.NumberFormat('en-US').format(post.shares.count) : "0",
                    reach,
                    impressions,
                    thumbnail: post.full_picture || undefined,
                    permalink: post.permalink_url || undefined,
                };
            });
        }
    }


    // --- Resizable Panel ---
    const [leftWidthPercent, setLeftWidthPercent] = useState(58); // default ~7/12 cols
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        const onMouseMove = (moveEvent: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = moveEvent.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            // Clamp between 30% and 80%
            setLeftWidthPercent(Math.min(80, Math.max(30, percent)));
        };

        const onMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, []);

    if (!displayData) {
        return (
            <div className="flex items-center justify-center h-64 text-on-surface-variant text-sm bg-surface">
                Select a platform from the sidebar to view analytics.
            </div>
        );
    }

    // Loading State
    if (isLoading) {
        return (
            <div className="col-span-12 flex items-center justify-center h-full bg-surface dark:bg-transparent">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-2 border-outline-variant/30" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-sm font-medium text-on-surface">Fetching {platform} data</p>
                        <p className="text-xs text-on-surface-variant/60">Connecting to Meta API...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (fetchError) {
        return (
            <div className="col-span-12 flex items-center justify-center h-full bg-surface dark:bg-transparent">
                <div className="flex flex-col items-center gap-4 max-w-sm text-center">
                    <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-on-surface">Something went wrong</p>
                        <p className="text-xs text-on-surface-variant/70">{fetchError}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="col-span-12 flex bg-surface dark:bg-transparent h-full py-2 px-4 overflow-hidden"
        >
            {/* Left column: KPIs + Chart - Scrollable */}
            <div
                className="flex flex-col gap-8 pr-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent"
                style={{ width: `${leftWidthPercent}%`, minWidth: "30%", maxWidth: "80%" }}
            >
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

            {/* Draggable Divider */}
            <div
                onMouseDown={handleMouseDown}
                className="relative flex-shrink-0 w-px bg-outline-variant cursor-col-resize"
                title="Drag to resize"
            >
                <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
            </div>

            {/* Right column: Posts Table - Fills remaining space */}
            <div
                className="flex flex-col gap-4 h-full overflow-y-auto pl-4 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent"
                style={{ width: `${100 - leftWidthPercent}%`, minWidth: "20%", maxWidth: "70%" }}
            >
                <PostsTable posts={displayData.posts} platformName={displayData.profile.name} timePeriod={timePeriod} />
            </div>
        </div>
    );
};

export default SocialNetworkPage;
