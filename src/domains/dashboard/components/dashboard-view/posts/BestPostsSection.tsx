import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/Table";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Heart, MessageCircle, Share2, Eye, MoreHorizontal, ChevronDown, ChevronRight, Image as ImageIcon } from "lucide-react";
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
import { type TimePeriod, getBestPostsData } from "@/domains/dashboard/data/dashboardMockData";
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
    const posts = getBestPostsData(timePeriod);
    const [activeTab, setActiveTab] = useState("All");
    const [viewType, setViewType] = useState("Best posts");

    const tabs = ["All", "Video", "Image", "Carousel", "Link"];
    const viewOptions = ["Best posts", "All Posts"];

    return (
        <div className="flex flex-col gap-5 mb-8">
            <div className="flex items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 text-xl font-medium text-gray-900 focus:outline-none hover:opacity-80 transition-opacity">
                        {viewType}
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 p-1">
                        {viewOptions.map((option) => (
                            <DropdownMenuItem
                                key={option}
                                onClick={() => setViewType(option)}
                                className={cn(
                                    "px-3 py-2 text-sm cursor-pointer rounded-md transition-colors",
                                    viewType === option ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {option}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Header: Tabs and Search */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                <div className="flex items-center gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm transition-colors relative ${activeTab === tab
                                ? "text-gray-900 font-medium"
                                : "text-gray-400 font-normal hover:text-gray-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                            <TableHead className="w-[40px] pl-2">
                                <Checkbox className="rounded-[4px] border-gray-300" />
                            </TableHead>
                            <TableHead className="min-w-[200px] text-[11px] font-normal text-gray-500 uppercase tracking-tight py-4 text-left">
                                Content
                            </TableHead>
                            <TableHead className="w-[120px] text-[11px] font-normal text-gray-500 uppercase tracking-tight py-4 text-left">
                                Platform
                            </TableHead>
                            <TableHead className="w-[120px] text-[11px] font-normal text-gray-500 uppercase tracking-tight py-4 cursor-pointer hover:text-gray-600 transition-colors text-left">
                                <div className="flex items-center gap-1">
                                    Issue date <ChevronDown className="w-3 h-3" />
                                </div>
                            </TableHead>
                            <TableHead className="w-[100px] text-[11px] font-normal text-gray-500 uppercase tracking-tight py-4 text-left">
                                Type
                            </TableHead>
                            <TableHead className="w-[200px] text-[11px] font-normal text-gray-500 uppercase tracking-tight py-4 text-left">
                                Reach
                            </TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => {
                            const IconComp = platformIcons[post.platform];
                            return (
                                <TableRow key={post.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 h-14">
                                    <TableCell className="pl-2">
                                        <Checkbox className="rounded-[4px] border-gray-300" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="font-medium text-sm text-gray-700 line-clamp-1">{post.caption}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {IconComp && <IconComp className="w-4 h-4" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 tabular-nums">
                                        {formatDate(post.date)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-normal uppercase text-gray-600">
                                            {post.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm font-normal text-gray-900 text-left tabular-nums">
                                        {post.reach}
                                    </TableCell>
                                    <TableCell className="pr-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
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
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">Show by</span>
                    <Select defaultValue="10">
                        <SelectTrigger className="w-[70px] h-8 text-xs border-gray-200 bg-white">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                    <div className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded text-gray-900">
                        1
                    </div>
                    <span>/ 4</span>
                    <button className="p-1 hover:text-gray-900 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BestPostsSection;
