import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { InstagramIcon } from '@/shared/components/icons/InstagramIcon';
import { Button } from '@/shared/components/ui/button';
import { MONTHS, WEEKDAYS, getDaysInMonth, getDaysInWeek } from '../utils/agenda-utils';
import { cn } from '@/shared/utils/utils';
import { PostDetailsModal } from './PostDetailsModal';

import { useFirebasePosts } from '../hooks/useFirebasePosts';
import { Post } from '../types/postTypes';

const PlatformIcon = ({ className }: { className?: string }) => {
    return <InstagramIcon className={cn("w-3 h-3", className)} />;
};

interface AgendaCalendarProps {
    view?: 'month' | 'week';
    onClose?: () => void;
    initialDate?: Date;
    initialPostId?: string;
}

export const AgendaCalendar = ({ view: externalView, initialDate, initialPostId }: AgendaCalendarProps) => {
    const { posts, loading, error } = useFirebasePosts();
    const [currentDate, setCurrentDate] = useState(initialDate || new Date());
    const [calendarView, _setCalendarView] = useState<'month' | 'week'>('month');
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Effect to open the specific post if initialPostId is provided
    useEffect(() => {
        if (initialPostId && posts.length > 0) {
            const post = posts.find(p => p.id === initialPostId);
            if (post) {
                setSelectedPost(post);
                setIsModalOpen(true);
            }
        }
    }, [initialPostId, posts]);

    // Prioritize external view if provided
    const effectiveView = externalView || calendarView;

    if (loading) return <div className="flex items-center justify-center h-full">Loading calendar...</div>;
    if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;

    const handlePostClick = (post: any) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const days = effectiveView === 'month'
        ? getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
        : getDaysInWeek(currentDate);

    const next = () => {
        if (effectiveView === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(newDate);
        }
    };

    const prev = () => {
        if (effectiveView === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - 7);
            setCurrentDate(newDate);
        }
    };

    const goToToday = () => setCurrentDate(new Date());

    return (
        <div className="flex flex-col w-full h-full bg-white text-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Navigation and Filters (Now simplified since Month/Week is outside) */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={prev} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-xl font-bold min-w-[200px] text-center">
                            {effectiveView === 'month'
                                ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                                : `Week of ${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}`
                            }
                        </span>
                        <button onClick={next} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                        <Button variant="ghost" size="sm" onClick={goToToday} className="text-gray-500 hover:text-gray-900 ml-2">
                            Today
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            <div className={cn(
                "grid grid-cols-7 border-t border-l border-gray-200",
                effectiveView === 'month' ? "flex-1" : ""
            )}>
                {/* Weekdays Labels */}
                {WEEKDAYS.map((day) => (
                    <div key={day} className="py-2 text-center text-sm font-semibold text-gray-500 border-r border-b border-gray-200">
                        {day}
                    </div>
                ))}

                {/* Calendar Cells */}
                {days.map((day, idx) => {
                    const dayPosts = posts.filter((p: Post) =>
                        p.date.getDate() === day.date.getDate() &&
                        p.date.getMonth() === day.date.getMonth() &&
                        p.date.getFullYear() === day.date.getFullYear()
                    );

                    const isToday = day.date.toDateString() === new Date().toDateString();

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "p-2 border-r border-b border-gray-200 flex flex-col gap-1 transition-all",
                                !day.isCurrentMonth && effectiveView === 'month' && "bg-gray-50/50 text-gray-400",
                                isToday && "bg-blue-50/30",
                                "min-h-[140px]"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    "text-sm font-medium",
                                    isToday && "bg-[#0095ff] text-white w-6 h-6 flex items-center justify-center rounded-full"
                                )}>
                                    {day.date.getDate()}
                                </span>
                                {effectiveView === 'week' && <span className="text-[10px] text-gray-400">{MONTHS[day.date.getMonth()]}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5 mt-1 pb-2">
                                {dayPosts.map((post) => (
                                    effectiveView === 'month' ? (
                                        <div
                                            key={post.id}
                                            onClick={() => handlePostClick(post)}
                                            className="flex items-center justify-between bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-[11px] font-medium text-gray-700">{post.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <PlatformIcon />
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            key={post.id}
                                            onClick={() => handlePostClick(post)}
                                            className="bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex flex-col gap-2 w-full"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-bold text-gray-800">{post.time}</span>
                                            </div>
                                            <h3 className="text-sm font-medium leading-tight text-gray-900 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            {post.imageUrl && (
                                                <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-100">
                                                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                                                    <PlatformIcon className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <PostDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                post={selectedPost}
            />
        </div>
    );
};
