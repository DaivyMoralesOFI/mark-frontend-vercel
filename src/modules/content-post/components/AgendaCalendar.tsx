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
        <div className="flex flex-col w-full h-full bg-surface/60 backdrop-blur-md text-on-surface p-6 rounded-2xl shadow-lg border border-outline-variant transition-colors duration-300">
            {/* Navigation and Filters (Now simplified since Month/Week is outside) */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={prev} className="p-2 hover:bg-surface-container rounded-full transition-colors group">
                            <ChevronLeft className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                        </button>
                        <span className="text-xl font-bold min-w-[200px] text-center text-on-surface tracking-tight">
                            {effectiveView === 'month'
                                ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                                : `Week of ${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}`
                            }
                        </span>
                        <button onClick={next} className="p-2 hover:bg-surface-container rounded-full transition-colors group">
                            <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                        </button>
                        <Button variant="ghost" size="sm" onClick={goToToday} className="text-on-surface-variant hover:text-primary hover:bg-primary/10 ml-2 rounded-xl">
                            Today
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            <div className={cn(
                "grid grid-cols-7 border-t border-l border-outline-variant/60 rounded-tl-xl overflow-hidden",
                effectiveView === 'month' ? "flex-1" : ""
            )}>
                {/* Weekdays Labels */}
                {WEEKDAYS.map((day) => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-on-surface-variant border-r border-b border-outline-variant/60 uppercase tracking-wider bg-surface-container/30">
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
                                "p-2 border-r border-b border-outline-variant/60 flex flex-col gap-1 transition-all group/day cursor-pointer hover:bg-surface-container/40",
                                !day.isCurrentMonth && effectiveView === 'month' && "bg-transparent opacity-40 grayscale",
                                isToday && "bg-primary/5",
                                "min-h-[140px]"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-xl transition-all",
                                    isToday
                                        ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/30"
                                        : "group-hover/day:bg-surface-container-high group-hover/day:text-on-surface"
                                )}>
                                    {day.date.getDate()}
                                </span>
                                {effectiveView === 'week' && <span className="text-[10px] text-on-surface-variant/70 font-medium uppercase tracking-wider">{MONTHS[day.date.getMonth()]}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5 mt-1 pb-2">
                                {dayPosts.map((post) => (
                                    effectiveView === 'month' ? (
                                        <div
                                            key={post.id}
                                            onClick={() => handlePostClick(post)}
                                            className="flex items-center justify-between bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 shadow-xs hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group/post"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-3.5 h-3.5 text-on-surface-variant group-hover/post:text-primary transition-colors" />
                                                <span className="text-[11px] font-semibold text-on-surface">{post.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <PlatformIcon className="text-on-surface-variant group-hover/post:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            key={post.id}
                                            onClick={() => handlePostClick(post)}
                                            className="bg-surface-container-low border border-outline-variant rounded-2xl p-3 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer flex flex-col gap-2 w-full group/post"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-on-surface-variant group-hover/post:text-primary transition-colors" />
                                                <span className="text-sm font-bold text-on-surface">{post.time}</span>
                                            </div>
                                            <h3 className="text-sm font-medium leading-tight text-on-surface group-hover/post:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            {post.imageUrl && (
                                                <div className="w-full aspect-video rounded-xl overflow-hidden border border-outline-variant/50">
                                                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-7 h-7 flex items-center justify-center bg-surface-container rounded-xl border border-outline-variant/50 group-hover/post:bg-primary/10 transition-colors">
                                                    <PlatformIcon className="w-4 h-4 text-on-surface-variant group-hover/post:text-primary transition-colors" />
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
