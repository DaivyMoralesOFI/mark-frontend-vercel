import { useState, useMemo } from "react";
import type { Post } from "../data/mockData";
import type { TimePeriod } from "@/modules/dashboard/data/dashboardMockData";
import { cn } from "@/shared/utils/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/Table";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Heart, MessageCircle, Share2, Eye } from "lucide-react";

interface PostsTableProps {
    posts: Post[];
    platformName: string;
    timePeriod: TimePeriod;
}

// Note: platformName and timePeriod are passed for future data filtering integration
export const PostsTable = ({ posts }: PostsTableProps) => {
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Video", "Image", "Carousel", "Link"];

    const filteredPosts = useMemo(() => {
        if (activeTab === "All") return posts;
        return posts.filter((post) => {
            const type = post.type.toLowerCase();
            if (activeTab === "Video") return type.includes("video") || type.includes("reel");
            if (activeTab === "Image") return type.includes("photo") || type.includes("image") || type.includes("post");
            if (activeTab === "Carousel") return type.includes("carousel");
            if (activeTab === "Link") return type.includes("link") || type.includes("article");
            return true;
        });
    }, [posts, activeTab]);

    return (
        <div className="flex flex-col h-full bg-surface dark:bg-transparent">
            {/* Header Tabs with Title */}
            <div className="flex items-center justify-between border-b border-outline-variant mb-2 min-h-[44px]">
                <div className="flex items-center gap-8">
                    <h2 className="text-lg font-medium text-on-surface whitespace-nowrap">Content Library</h2>
                    <div className="flex items-center gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-3 text-sm transition-all relative mt-3",
                                    activeTab === tab
                                        ? "text-primary font-semibold"
                                        : "text-on-surface-variant font-normal hover:text-on-surface"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full transition-all" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Container with Localized Scrolling */}
            <div className="flex flex-col overflow-hidden">
                <div className="overflow-y-auto w-full max-h-[600px] scrollbar-thin scrollbar-thumb-outline-variant pr-1">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 bg-surface dark:bg-[#1c1a14] z-20">
                            <TableRow className="hover:bg-transparent border-b border-outline-variant">
                                <TableHead className="w-[40px] pl-2">
                                    <Checkbox className="rounded-[4px] border-outline" />
                                </TableHead>
                                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant py-2">
                                    Content
                                </TableHead>
                                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant py-2">
                                    Type
                                </TableHead>
                                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant py-2">
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        Likes
                                    </div>
                                </TableHead>
                                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant py-2">
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" />
                                        Comments
                                    </div>
                                </TableHead>
                                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant py-2">
                                    <div className="flex items-center gap-1">
                                        <Share2 className="w-3 h-3" />
                                        Shares
                                    </div>
                                </TableHead>
                                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant py-2">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        Reach
                                    </div>
                                </TableHead>
                                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant py-2 text-right pr-4">
                                    Impressions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPosts.map((post) => (
                                <TableRow
                                    key={post.id}
                                    className="hover:bg-on-surface/[0.02] border-b border-outline-variant/50 transition-colors h-14"
                                >
                                    <TableCell className="pl-2">
                                        <Checkbox className="rounded-[4px] border-outline" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-on-surface line-clamp-1">
                                                {post.caption}
                                            </span>
                                            <span className="text-[11px] text-on-surface-variant">
                                                {post.date}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "rounded-full px-2 py-0 text-[10px] font-medium border-none shadow-none uppercase tracking-tight",
                                                post.typeColor
                                            )}
                                        >
                                            {post.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-on-surface">
                                        {post.likes}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-on-surface">
                                        {post.comments}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-on-surface">
                                        {post.shares}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-on-surface">
                                        {post.reach}
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-on-surface text-right pr-4">
                                        {post.impressions}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
