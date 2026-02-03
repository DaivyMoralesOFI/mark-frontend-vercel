import { useState } from 'react';
import { ChevronLeft, ChevronRight, List, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { InstagramIcon } from '@/shared/components/icons/InstagramIcon';
import { Button } from '@/shared/components/ui/button';
import { MONTHS, WEEKDAYS, getDaysInMonth, getDaysInWeek } from '../utils/agenda-utils';
import { cn } from '@/core/lib/utils';
import { PostDetailsModal } from './PostDetailsModal';

// Mock data for scheduled posts
const MOCK_POSTS = [
    {
        id: '1',
        time: '10:42',
        date: new Date(2026, 1, 3),
        platforms: ['instagram', 'facebook', 'twitter'],
        title: 'How to create a complete portfolio',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300'
    },
    {
        id: '2',
        time: '10:55',
        date: new Date(2026, 1, 3),
        platforms: ['instagram', 'facebook'],
        title: 'Mastering Next.js 14',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=300'
    },
    { id: '3', time: '11:02', date: new Date(2026, 1, 3), platforms: ['instagram', 'facebook'], title: 'UI Design Tips', imageUrl: '' },
    { id: '4', time: '11:25', date: new Date(2026, 1, 4), platforms: ['instagram', 'facebook'], title: 'Daily Inspiration', imageUrl: '' },
    { id: '5', time: '11:25', date: new Date(2026, 1, 4), platforms: ['instagram', 'facebook'], title: 'Work Habit', imageUrl: '' },
];

const PlatformIcon = ({ className }: { className?: string }) => {
    return <InstagramIcon className={cn("w-3 h-3", className)} />;
};

export const AgendaCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<'list' | 'week' | 'month'>('month');
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostClick = (post: any) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const days = calendarView === 'month'
        ? getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
        : getDaysInWeek(currentDate);

    const next = () => {
        if (calendarView === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(newDate);
        }
    };

    const prev = () => {
        if (calendarView === 'month') {
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
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Agenda</h1>
                    <p className="text-gray-500 text-sm">Plan your marketing calendar by creating, scheduling, and managing content.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCalendarView('list')}
                            className={cn(
                                "transition-all px-4",
                                calendarView === 'list' ? "bg-white shadow-sm text-gray-900 font-semibold" : "text-gray-600 hover:bg-white/50"
                            )}
                        >
                            <List className="w-4 h-4 mr-2" /> List
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCalendarView('month')}
                            className={cn(
                                "transition-all px-4",
                                calendarView !== 'list' ? "bg-white shadow-sm text-gray-900 font-semibold" : "text-gray-600 hover:bg-white/50"
                            )}
                        >
                            <CalendarIcon className="w-4 h-4 mr-2" /> Calendar
                        </Button>
                    </div>
                    <Button className="bg-[#0095ff] hover:bg-[#0081e0] text-white">
                        <CalendarIcon className="w-4 h-4 mr-2" /> Schedule Post
                    </Button>
                </div>
            </div>

            {/* Sub-header with Navigation and Filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {calendarView !== 'list' && (
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCalendarView('week')}
                                className={cn("px-4 transition-all", calendarView === 'week' ? "bg-white shadow-sm text-gray-900 font-semibold" : "text-gray-500")}
                            >
                                Week
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCalendarView('month')}
                                className={cn("px-4 transition-all", calendarView === 'month' ? "bg-white shadow-sm text-gray-900 font-semibold" : "text-gray-500")}
                            >
                                Month
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 ml-8">
                        <button onClick={prev} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-xl font-bold min-w-[200px] text-center">
                            {calendarView === 'month'
                                ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                                : calendarView === 'week'
                                    ? `Week of ${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}`
                                    : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                            }
                        </span>
                        <button onClick={next} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Button variant="outline" className="text-gray-600 min-w-[140px] justify-between">
                            All <ChevronRight className="w-4 h-4 rotate-90" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Button variant="outline" className="text-gray-600 min-w-[140px] justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    <InstagramIcon className="w-4 h-4 bg-white rounded-full border border-white" />
                                </div>
                                Instagram
                            </div>
                            <ChevronRight className="w-4 h-4 rotate-90" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            {calendarView === 'list' ? (
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                    {MOCK_POSTS
                        .filter(post => {
                            if (calendarView === 'list') {
                                // Filter by current month for list view
                                return post.date.getMonth() === currentDate.getMonth() &&
                                    post.date.getFullYear() === currentDate.getFullYear();
                            }
                            return true;
                        })
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((post) => (
                            <div
                                key={post.id}
                                onClick={() => handlePostClick(post)}
                                className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                    {post.imageUrl ? (
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <PlatformIcon className="w-6 h-6 opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[13px] font-bold text-[#0095ff] bg-blue-50 px-2 py-0.5 rounded-full">
                                            {post.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - {post.time}
                                        </span>
                                        <div className="flex -space-x-1">
                                            <div className="w-5 h-5 rounded-full border border-white bg-gray-50 flex items-center justify-center shadow-sm">
                                                <PlatformIcon className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#0095ff] transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        Instagram Feed Post • {post.platforms.length} Platforms
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600">
                                        View details
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className={cn(
                    "grid grid-cols-7 border-t border-l border-gray-200",
                    calendarView === 'month' ? "flex-1" : ""
                )}>
                    {/* Weekdays Labels */}
                    {WEEKDAYS.map((day) => (
                        <div key={day} className="py-2 text-center text-sm font-semibold text-gray-500 border-r border-b border-gray-200">
                            {day}
                        </div>
                    ))}

                    {/* Calendar Cells */}
                    {days.map((day, idx) => {
                        const dayPosts = MOCK_POSTS.filter(p =>
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
                                    !day.isCurrentMonth && calendarView === 'month' && "bg-gray-50/50 text-gray-400",
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
                                    {calendarView === 'week' && <span className="text-[10px] text-gray-400">{MONTHS[day.date.getMonth()]}</span>}
                                </div>

                                <div className="flex flex-col gap-1.5 mt-1 pb-2">
                                    {dayPosts.map((post) => (
                                        calendarView === 'month' ? (
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
            )}

            <PostDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                post={selectedPost}
            />
        </div>
    );
};
