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
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export const BestPostsSection = () => {
    const posts = [
        {
            id: 1,
            title: "Platform Update: New Features",
            subtitle: "feature_release_v2.4.pdf",
            date: "Sep 12, 2024",
            likes: "1.2k",
            comments: 45,
            status: "Published",
            statusColor: "bg-green-100 text-green-700 hover:bg-green-100/80",
            image: "bg-blue-100",
            size: "2.4 MB"
        },
        {
            id: 2,
            title: "Community Spotlight: Jane Doe",
            subtitle: "interview_transcript.docx",
            date: "Sep 11, 2024",
            likes: "856",
            comments: 23,
            status: "Scheduled",
            statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
            image: "bg-purple-100",
            size: "1.1 MB"
        },
        {
            id: 3,
            title: "Tips for Better Workflow",
            subtitle: "workflow_guide_2024.pdf",
            date: "Sep 10, 2024",
            likes: "2.5k",
            comments: 112,
            status: "Published",
            statusColor: "bg-green-100 text-green-700 hover:bg-green-100/80",
            image: "bg-green-100",
            size: "5.6 MB"
        },
        {
            id: 4,
            title: "Weekly Digest: Top Trends",
            subtitle: "newsletter_draft.docx",
            date: "Sep 09, 2024",
            likes: "943",
            comments: 31,
            status: "Draft",
            statusColor: "bg-orange-100 text-orange-700 hover:bg-orange-100/80",
            image: "bg-orange-100",
            size: "800 KB"
        },
        {
            id: 5,
            title: "Behind the Scenes",
            subtitle: "bts_footage_raw.mp4",
            date: "Sep 08, 2024",
            likes: "3.1k",
            comments: 205,
            status: "Published",
            statusColor: "bg-green-100 text-green-700 hover:bg-green-100/80",
            image: "bg-pink-100",
            size: "128 MB"
        },
    ];

    return (
        <div className="flex flex-col gap-4 mt-8 mb-8">
            <h2 className="text-xl font-semibold">Best posts</h2>
            <div className="bg-white rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                            <TableHead className="w-[50px] pl-6">
                                <Checkbox />
                            </TableHead>
                            <TableHead className="w-[300px] uppercase text-xs font-semibold text-muted-foreground/70 tracking-wider">Post Details</TableHead>
                            <TableHead className="w-[120px] uppercase text-xs font-semibold text-muted-foreground/70 tracking-wider">Status</TableHead>
                            <TableHead className="w-[100px] uppercase text-xs font-semibold text-muted-foreground/70 tracking-wider">Size</TableHead>
                            <TableHead className="w-[150px] uppercase text-xs font-semibold text-muted-foreground/70 tracking-wider">Engagement</TableHead>
                            <TableHead className="uppercase text-xs font-semibold text-muted-foreground/70 tracking-wider text-right pr-6">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 h-20">
                                <TableCell className="pl-6">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-sm text-gray-900">{post.title}</span>
                                        <span className="text-xs text-muted-foreground">{post.subtitle}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={`rounded-md px-2.5 py-0.5 text-xs font-medium border-none shadow-none ${post.statusColor}`}>
                                        {post.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 font-medium">
                                    {post.size}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-medium text-gray-700">{post.likes}</span>
                                            <span className="text-[10px] text-muted-foreground">likes</span>
                                        </div>
                                        {/* Simple sparkline visual */}
                                        <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full opacity-60" style={{ width: `${Math.random() * 60 + 40}%` }} />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <span>{post.date}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
