import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Input from '../../../components/ui/Input';
import useToast from '../../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role } = useRole();
    const toast = useToast();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        studentEmail: '',
        startTime: '',
        endTime: '',
        subject: '',
        notes: ''
    });

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await axiosSecure.get('/my-schedule');
            setSchedules(res.data || []);
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchedule = async (e) => {
        e.preventDefault();
        try {
            await axiosSecure.post('/schedules', {
                ...formData,
                date: selectedDate,
                tuitionId: 'manual' // Simplified for now
            });
            toast.success('Class scheduled successfully');
            setShowAddModal(false);
            fetchSchedule();
            setFormData({ studentEmail: '', startTime: '', endTime: '', subject: '', notes: '' });
        } catch (error) {
            toast.error('Failed to schedule class');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to cancel this class?')) return;
        try {
            await axiosSecure.delete(`/schedules/${id}`);
            toast.success('Class cancelled');
            setSchedules(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            toast.error('Failed to cancel class');
        }
    };

    // Calendar Logic
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-base-200/30 border border-base-200" />);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const daySchedules = schedules.filter(s =>
                new Date(s.date).toDateString() === date.toDateString()
            );

            days.push(
                <div
                    key={day}
                    className={`h-24 border border-base-200 p-2 transition-colors hover:bg-base-200 relative group cursor-pointer ${isToday(day) ? 'bg-primary/5' : ''
                        }`}
                    onClick={() => {
                        if (role === 'tutor') {
                            setSelectedDate(date);
                            setShowAddModal(true);
                        }
                    }}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-primary text-white' : ''
                            }`}>
                            {day}
                        </span>
                        {role === 'tutor' && (
                            <button className="opacity-0 group-hover:opacity-100 text-primary hover:bg-primary/10 rounded p-1 transition-all">
                                <Plus size={14} />
                            </button>
                        )}
                    </div>

                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
                        {daySchedules.map((schedule, idx) => (
                            <div
                                key={idx}
                                className="text-xs p-1 bg-primary/10 text-primary rounded truncate font-medium cursor-help"
                                title={`${schedule.startTime} - ${schedule.subject}`}
                            >
                                {schedule.startTime} {schedule.subject}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    if (loading) return <Spinner variant="dots" size="lg" fullScreen />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold gradient-text">Class Schedule</h1>
                    <p className="text-base-content/60">Manage your classes and upcoming sessions</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-base-100 rounded-lg border border-base-200 p-1">
                        <button onClick={prevMonth} className="btn btn-ghost btn-sm btn-square">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold min-w-[150px] text-center">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={nextMonth} className="btn btn-ghost btn-sm btn-square">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    {role === 'tutor' && (
                        <Button
                            leftIcon={Plus}
                            onClick={() => {
                                setSelectedDate(new Date());
                                setShowAddModal(true);
                            }}
                        >
                            Schedule Class
                        </Button>
                    )}
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-base-200 bg-base-200/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-3 text-center font-bold text-sm text-base-content/60">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 bg-base-100">
                    {renderCalendarDays()}
                </div>
            </Card>

            {/* Upcoming Classes List */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="text-primary" />
                    Upcoming Classes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schedules
                        .filter(s => new Date(s.date) >= new Date().setHours(0, 0, 0, 0))
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map(schedule => (
                            <Card key={schedule._id} hover className="border-l-4 border-l-primary">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg">{schedule.subject}</h4>
                                        <p className="text-sm text-base-content/60">
                                            with {schedule.studentEmail || schedule.tutorEmail}
                                        </p>
                                    </div>
                                    <div className="badge badge-primary badge-outline">
                                        {new Date(schedule.date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-base-content/70 my-3">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {schedule.startTime} - {schedule.endTime}
                                    </div>
                                    {schedule.notes && (
                                        <div className="bg-base-200 px-2 py-0.5 rounded text-xs truncate max-w-[150px]">
                                            {schedule.notes}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button size="sm" variant="outline" fullWidth leftIcon={Video}>
                                        Join Class
                                    </Button>
                                    {role === 'tutor' && (
                                        <button
                                            onClick={() => handleDelete(schedule._id)}
                                            className="btn btn-sm btn-square btn-ghost text-error"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    {schedules.length === 0 && (
                        <div className="col-span-full text-center py-8 text-base-content/40">
                            No upcoming classes scheduled
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-base-200 flex justify-between items-center">
                                <h3 className="text-xl font-bold">
                                    Schedule Class
                                </h3>
                                <button onClick={() => setShowAddModal(false)} className="btn btn-sm btn-circle btn-ghost">
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
                                <div className="bg-primary/5 p-3 rounded-lg mb-4 text-center">
                                    <p className="text-sm font-semibold text-primary">
                                        Date: {selectedDate?.toLocaleDateString()}
                                    </p>
                                </div>

                                <Input
                                    label="Subject"
                                    placeholder="e.g. Physics Chapter 5"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Student Email"
                                    type="email"
                                    placeholder="student@example.com"
                                    value={formData.studentEmail}
                                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Start Time"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="End Time"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        required
                                    />
                                </div>

                                <Input
                                    label="Notes (Optional)"
                                    placeholder="Meeting link or topic details..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        fullWidth
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" fullWidth>
                                        Schedule Class
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Calendar;
