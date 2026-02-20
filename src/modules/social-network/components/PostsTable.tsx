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
            {/* Chrome-style Tabs */}
            <div className="flex items-end gap-0.5 px-1 pt-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-2 text-sm transition-all relative rounded-t-lg",
                            activeTab === tab
                                ? "bg-surface-container-high dark:bg-[#2a2720] text-on-surface font-medium"
                                : "text-on-surface-variant/60 font-normal hover:bg-on-surface/[0.04] hover:text-on-surface-variant"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="h-px bg-outline-variant" />

            {/* Table Container with Localized Scrolling */}
            <div className="flex flex-col overflow-hidden">
                <div className="overflow-y-auto w-full max-h-[600px] scrollbar-thin scrollbar-thumb-outline-variant pr-1">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 bg-surface dark:bg-[#1c1a14] z-20">
                            <TableRow className="hover:bg-transparent border-b border-outline-variant">

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

                                    <TableCell>
                                        <div className="flex items-start gap-3">
                                            {post.thumbnail && (
                                                <img
                                                    src={post.thumbnail}
                                                    alt="Post thumbnail"
                                                    className="w-10 h-10 object-cover rounded-md border border-outline-variant flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                {post.permalink ? (
                                                    <a
                                                        href={post.permalink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-medium text-on-surface line-clamp-2 break-words hover:text-primary transition-colors hover:underline"
                                                        title={post.caption}
                                                    >
                                                        {post.caption}
                                                    </a>
                                                ) : (
                                                    <span className="text-sm font-medium text-on-surface line-clamp-2 break-words" title={post.caption}>
                                                        {post.caption}
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-on-surface-variant">
                                                    {post.date}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-normal text-on-surface">
                                        {post.type}
                                    </TableCell>
                                    <TableCell className="text-xs font-normal text-on-surface">
                                        {post.likes}
                                    </TableCell>
                                    <TableCell className="text-xs font-normal text-on-surface">
                                        {post.comments}
                                    </TableCell>
                                    <TableCell className="text-xs font-normal text-on-surface">
                                        {post.shares}
                                    </TableCell>
                                    <TableCell className="text-xs font-normal text-on-surface">
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
