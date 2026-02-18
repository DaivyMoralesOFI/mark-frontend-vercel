import { useSearchParams } from "react-router-dom";
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

    if (!data) {
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
                    <MetricsRow metrics={data.kpis} />

                    <div className="border-y border-outline-variant py-2">
                        <PerformanceChart
                            data={data.chartData}
                            platformName={data.profile.name}
                            timePeriod={timePeriod}
                        />
                    </div>
                    <FinancialOverview
                        visitorStats={data.visitorStats}
                        visitorTrend={data.visitorTrend}
                        trafficSources={data.trafficSources}
                        trafficTrend={data.trafficTrend}
                        timePeriod={timePeriod}
                    />
                </div>
            </div>

            {/* Right column: Posts Table - Also Scrollable independently if needed */}
            <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
                <PostsTable posts={data.posts} platformName={data.profile.name} timePeriod={timePeriod} />
            </div>
        </div>
    );
};

export default SocialNetworkPage;
