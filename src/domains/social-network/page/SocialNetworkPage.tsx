import { useSearchParams } from "react-router-dom";
import { getPlatformData } from "../data/mockData";
import { PlatformHeader } from "../components/PlatformHeader";
import { MetricsRow } from "../components/MetricsRow";
import { PerformanceChart } from "../components/PerformanceChart";
import { PostsTable } from "../components/PostsTable";

export const SocialNetworkPage = () => {
    const [searchParams] = useSearchParams();
    const platform = searchParams.get("platform") || "";
    const data = getPlatformData(platform);

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                Select a platform from the sidebar to view analytics.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 bg-white min-h-full">
            {/* Header */}
            <PlatformHeader profile={data.profile} />

            {/* KPI Metrics */}
            <MetricsRow metrics={data.kpis} />

            {/* Chart */}
            <PerformanceChart data={data.chartData} platformName={data.profile.name} />

            {/* Posts Table */}
            <PostsTable posts={data.posts} platformName={data.profile.name} />
        </div>
    );
};

export default SocialNetworkPage;
