import { Post } from "../data/mockData";
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
import { Button } from "@/shared/components/ui/button";
import {
    Filter,
    ArrowUpDown,
    Search,
    MoreHorizontal,
    Download,
    Plus,
    Heart,
    MessageCircle,
    Share2,
    Eye,
} from "lucide-react";

interface PostsTableProps {
    posts: Post[];
    platformName: string;
}

export const PostsTable = ({ posts }: PostsTableProps) => {
    return (
        <div className="flex flex-col gap-3">
            {/* Table Header Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-gray-900">All Posts</h2>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {posts.length} items
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Sort
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <Search className="w-3.5 h-3.5" />
                        Search
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 gap-1.5 border-gray-200"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </Button>
                    <Button
                        size="sm"
                        className="text-xs h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add New
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/80">
                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                            <TableHead className="w-[50px] pl-4">
                                <Checkbox />
                            </TableHead>
                            <TableHead className="min-w-[280px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                Content
                            </TableHead>
                            <TableHead className="w-[100px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                Date
                            </TableHead>
                            <TableHead className="w-[90px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                Type
                            </TableHead>
                            <TableHead className="w-[100px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                Status
                            </TableHead>
                            <TableHead className="w-[80px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    Likes
                                </div>
                            </TableHead>
                            <TableHead className="w-[90px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    Comments
                                </div>
                            </TableHead>
                            <TableHead className="w-[80px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                <div className="flex items-center gap-1">
                                    <Share2 className="w-3 h-3" />
                                    Shares
                                </div>
                            </TableHead>
                            <TableHead className="w-[80px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider">
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    Reach
                                </div>
                            </TableHead>
                            <TableHead className="w-[90px] uppercase text-[10px] font-semibold text-gray-400 tracking-wider text-right pr-4">
                                Impressions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow
                                key={post.id}
                                className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 h-16"
                            >
                                <TableCell className="pl-4">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {post.caption}
                                    </span>
                                </TableCell>
                                <TableCell className="text-xs text-gray-500">
                                    {post.date}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border-none shadow-none ${post.typeColor}`}
                                    >
                                        {post.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border-none shadow-none ${post.statusColor}`}
                                    >
                                        {post.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm font-medium text-gray-900">
                                    {post.likes}
                                </TableCell>
                                <TableCell className="text-sm font-medium text-gray-900">
                                    {post.comments}
                                </TableCell>
                                <TableCell className="text-sm font-medium text-gray-900">
                                    {post.shares}
                                </TableCell>
                                <TableCell className="text-sm font-medium text-gray-900">
                                    {post.reach}
                                </TableCell>
                                <TableCell className="text-sm font-semibold text-gray-900 text-right pr-4">
                                    {post.impressions}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
