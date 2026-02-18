import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/Table";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { MoreHorizontal, ChevronDown, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/utils";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";
import { type TimePeriod, getBestPostsData } from "@/modules/dashboard/data/dashboardMockData";
import { useState } from "react";

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
    Instagram: InstagramIcon,
    TikTok: TikTokIcon,
    Facebook: FacebookIcon,
    LinkedIn: LinkedInIcon,
};

interface BestPostsSectionProps {
    timePeriod: TimePeriod;
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

export const BestPostsSection = ({ timePeriod }: BestPostsSectionProps) => {
    const rawPosts = getBestPostsData(timePeriod);
    const [activeTab, setActiveTab] = useState("All");
    const [viewType, setViewType] = useState("Best posts");

    const parseReach = (r: string) => {
        const num = parseFloat(r.replace(/[^0-9.]/g, ''));
        if (r.toLowerCase().includes('k')) return num * 1000;
        if (r.toLowerCase().includes('m')) return num * 1000000;
        return num;
    };

    const filteredPosts = rawPosts
        .filter((post) => {
            if (activeTab === "All") return true;
            if (activeTab === "Video") return post.type === "Video" || post.type === "Reel";
            return post.type === activeTab;
        })
        .sort((a, b) => {
            if (viewType === "Best posts") {
                return parseReach(b.reach) - parseReach(a.reach);
            }
            // For "All Posts", show newest first
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    const tabs = ["All", "Video", "Image", "Carousel", "Link"];
    const viewOptions = ["Best posts", "All Posts"];

    return (
        <div className="flex flex-col gap-5 mb-8 h-full">
            <div className="flex items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 text-xl font-medium text-on-surface focus:outline-none hover:opacity-80 transition-opacity">
                        {viewType}
                        <ChevronDown className="w-5 h-5 text-on-surface-variant" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 p-1">
                        {viewOptions.map((option) => (
                            <DropdownMenuItem
                                key={option}
                                onClick={() => setViewType(option)}
                                className={cn(
                                    "px-3 py-2 text-sm cursor-pointer rounded-md transition-colors",
                                    viewType === option ? "bg-surface-container text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                                )}
                            >
                                {option}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Header: Tabs and Search */}
            <div className="flex items-center justify-between border-b border-outline-variant pb-1">
                <div className="flex items-center gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-3 text-sm transition-all relative",
                                activeTab === tab
                                    ? "text-primary font-semibold"
                                    : "text-on-surface-variant font-normal hover:text-on-surface"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-surface dark:bg-transparent w-full flex flex-col overflow-hidden">
                <div className="overflow-y-auto w-full max-h-[600px] scrollbar-thin scrollbar-thumb-outline-variant pr-1">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 bg-surface dark:bg-[#1c1a14] z-20">
                            <TableRow className="hover:bg-transparent border-b border-outline-variant">
                                <TableHead className="w-[40px] pl-2">
                                    <Checkbox className="rounded-[4px] border-outline" />
                                </TableHead>
                                <TableHead className="min-w-[200px] text-[11px] font-normal text-on-surface-variant uppercase tracking-tight py-3 text-left">
                                    Content
                                </TableHead>
                                <TableHead className="w-[120px] text-[11px] font-normal text-on-surface-variant uppercase tracking-tight py-3 text-left">
                                    Platform
                                </TableHead>
                                <TableHead className="w-[120px] text-[11px] font-normal text-on-surface-variant uppercase tracking-tight py-3 cursor-pointer hover:text-on-surface transition-colors text-left">
                                    <div className="flex items-center gap-1">
                                        Issue date <ChevronDown className="w-3 h-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="w-[100px] text-[11px] font-normal text-on-surface-variant uppercase tracking-tight py-3 text-left">
                                    Type
                                </TableHead>
                                <TableHead className="w-[100px] text-[11px] font-normal text-on-surface-variant uppercase tracking-tight py-3 text-left">
                                    Reach
                                </TableHead>
                                <TableHead className="w-[40px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPosts.map((post) => {
                                const IconComp = platformIcons[post.platform];
                                return (
                                    <TableRow key={post.id} className="group hover:bg-surface-container/30 transition-colors border-b border-outline-variant h-10">
                                        <TableCell className="pl-2">
                                            <Checkbox className="rounded-[4px] border-outline" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    <ImageIcon className="w-4 h-4 text-on-surface-variant" />
                                                </div>
                                                <span className="font-medium text-sm text-on-surface line-clamp-1">{post.caption}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {IconComp && <IconComp className="w-4 h-4" />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-on-surface-variant tabular-nums">
                                            {formatDate(post.date)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[12px] font-normal  text-on-surface-variant">
                                                {post.type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm font-normal text-on-surface text-left tabular-nums">
                                            {post.reach}
                                        </TableCell>
                                        <TableCell className="pr-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-on-surface">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer: Pagination */}
                <div className="mt-auto px-4 py-3 border-t border-outline-variant bg-surface dark:bg-transparent flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-on-surface-variant">Show by</span>
                        <Select defaultValue="10">
                            <SelectTrigger className="w-[70px] h-8 text-xs border-outline-variant bg-surface dark:bg-transparent">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant">
                        <div className="flex items-center justify-center w-8 h-8 bg-surface dark:bg-transparent border border-outline-variant rounded text-on-surface shadow-sm">
                            1
                        </div>
                        <span>/ 4</span>
                        <button className="p-1 hover:text-on-surface transition-colors">
                            <ChevronRight className="w-5 h-5 border rounded" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BestPostsSection;
