import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useFirebasePosts } from "@/modules/content-post/hooks/useFirebasePosts";
import { Calendar, Clock, MessageSquare, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export function LastPostCard() {
    const { posts, loading, error } = useFirebasePosts();
    const navigate = useNavigate();

    // Get the most recent post based on created_at or date
    const lastPost = posts.length > 0
        ? [...posts].sort((a, b) => {
            const dateA = a.created_at || a.date;
            const dateB = b.created_at || b.date;
            return dateB.getTime() - dateA.getTime();
        })[0]
        : null;

    if (loading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Last Post</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </CardContent>
            </Card>
        );
    }

    if (error || !lastPost) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Last Post</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[200px] text-gray-500">
                    {error ? "Error loading post" : "No posts found"}
                </CardContent>
            </Card>
        );
    }

    const handleNavigate = () => {
        if (lastPost) {
            const dateStr = lastPost.date.toISOString();
            navigate(`/calendar?date=${dateStr}&postId=${lastPost.id}`);
        }
    };

    return (
        <Card
            onClick={handleNavigate}
            className="h-full overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group/card"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Last Post
                </CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100 capitalize">
                    {lastPost.status}
                </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1 flex flex-col">
                    {lastPost.imageUrl ? (
                        <div className="relative h-60 rounded-xl overflow-hidden border border-gray-100 group">
                            <img
                                src={lastPost.imageUrl}
                                alt={lastPost.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2">
                                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                                    <ImageIcon className="w-4 h-4 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-60 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center border border-purple-100">
                            <MessageSquare className="w-8 h-8 text-purple-200" />
                        </div>
                    )}

                    <div className="space-y-1 overflow-hidden">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 text-sm">{lastPost.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic">
                            "{lastPost.copy}"
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {lastPost.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-[10px] px-2 py-0 border-purple-200 text-purple-600">
                                {platform}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-50 dark:border-slate-800">
                        <div className="flex items-center text-xs text-gray-500 gap-3">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(lastPost.date, "MMM dd, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lastPost.time}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
