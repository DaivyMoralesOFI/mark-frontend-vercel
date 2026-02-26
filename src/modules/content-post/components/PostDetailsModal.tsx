import {
    Edit2,
    Trash2,
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    ChevronDown,
    Calendar,
    BadgeCheck,
    Tag,
} from 'lucide-react';
import { InstagramIcon } from '@/shared/components/icons/InstagramIcon';
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/Avatar';
import { cn } from '@/shared/utils/utils';
import { Post } from '../types/PostTypes';

interface PostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

const PlatformIcon = ({ className }: { className?: string }) => {
    return <InstagramIcon className={cn("w-4 h-4", className)} />;
};

export const PostDetailsModal = ({ isOpen, onClose, post }: PostDetailsModalProps) => {
    if (!post) return null;

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return date.toLocaleDateString('en-GB') + ' - ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + 'h';
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPortal>
                <DialogOverlay className="bg-blue-950/20 backdrop-blur-[4px] z-[100] transition-all duration-300" />
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-white rounded-2xl shadow-2xl z-[101] transition-all duration-300 ease-out sm:zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out gpu-acceleration">
                    <div className="flex flex-col md:flex-row h-full max-h-[98vh]">
                        {/* Left Column: Post Preview */}
                        <div className="flex-1 flex flex-col border-r border-gray-100 min-w-0">
                            {/* User Header */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-10 h-10 border border-gray-100">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>LL</AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            Brand User
                                        </h3>
                                        <BadgeCheck className="w-4 h-4 text-[#0095ff] fill-[#0095ff] text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>

                            {/* Post Image/Content */}
                            <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center">
                                {post.imageUrl ? (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-contain max-h-[750px]"
                                    />
                                ) : (
                                    <div className="w-full h-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Engagement Icons */}
                            <div className="p-4 pt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <Heart className="w-6 h-6 text-gray-400 cursor-pointer hover:text-[#ff3040]" />
                                        <MessageCircle className="w-6 h-6 text-gray-400 cursor-pointer" />
                                        <Send className="w-6 h-6 text-gray-400 cursor-pointer" />
                                    </div>
                                    <Bookmark className="w-6 h-6 text-gray-400 cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm font-bold block text-gray-900">Post Caption</span>
                                    <p className="text-sm text-gray-800 leading-snug whitespace-pre-wrap">
                                        {post.copy}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Metadata & Actions */}
                        <div className="w-full md:w-[340px] p-8 flex flex-col gap-8 bg-white overflow-y-auto">
                            {/* Post Info Section */}
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Post information</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-gray-400 text-[14px] font-medium block mb-2">Platform</label>
                                        <div className="flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm cursor-pointer hover:border-gray-300 transition-all">
                                            <div className="flex items-center gap-3">
                                                <PlatformIcon className="w-5 h-5" />
                                                <span className="text-[14px] font-medium text-gray-700 capitalize">
                                                    {(post.platforms && post.platforms[0]) || 'Instagram'}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-gray-400 text-[14px] font-medium block mb-2">Post type</label>
                                        <div className="flex items-center gap-3">
                                            <Tag className="w-5 h-5 text-gray-800" />
                                            <span className="text-[14px] font-medium text-gray-700 capitalize">{post.post_type || 'Social Post'}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-gray-400 text-[14px] font-medium block mb-2">Created at</label>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-6 h-6 text-gray-800" />
                                            <span className="text-[14px] font-medium text-gray-700">{formatDate(post.created_at)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[#0095ff] text-[14px] font-medium block mb-2">Scheduled for:</label>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-6 h-6 text-[#0095ff]" />
                                            <span className="text-[14px] font-medium text-[#0095ff]">{formatDate(post.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Actions Section */}
                            <section className="mt-2">
                                <label className="text-gray-400 text-[13px] font-medium block mb-4">Actions</label>
                                <div className="flex flex-col gap-2.5">
                                    <Button className="w-full bg-[#0095ff] border-[1px] hover:bg-[#0081e0] text-white rounded-[10px] py-3.5 h-auto text-[14px] font-medium">
                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="outline" className="w-full border-gray-200 text-gray-800 rounded-[10px] py-3.5 h-auto text-[14px] font-medium hover:bg-gray-50 bg-white">
                                        <Calendar className="w-4 h-4 mr-2" /> Pause schedule
                                    </Button>
                                    <Button variant="outline" className="w-full border-red-200 text-red-500 rounded-[10px] py-3.5 h-auto text-[14px] font-medium hover:bg-red-50 hover:border-red-300 bg-white">
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </section>
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};
