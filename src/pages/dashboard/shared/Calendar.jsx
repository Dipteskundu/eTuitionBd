import React, { useState, useEffect } from 'react';
import useTitle from '../../../hooks/useTitle';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Input from '../../../components/ui/Input';
import useToast from '../../../hooks/useToast';
import { motion } from 'framer-motion';
import Modal from '../../../components/ui/Modal';

const Calendar = () => {
    useTitle('Class Schedule');
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role } = useRole();
    const toast = useToast();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [myPartners, setMyPartners] = useState([]);
    // Form State
    const [formData, setFormData] = useState({
        tuitionId: '',
        partnerEmail: '',
        startTime: '',
        endTime: '',
        subject: '',
        notes: '',
        meetingLink: 'https://meet.google.com/'
    });

    useEffect(() => {
        fetchSchedule();
        if (role === 'tutor' || role === 'teacher' || role === 'student') {
            fetchMyPartners();
        }
    }, [role]);

    const fetchMyPartners = async () => {
        try {
            const isTutorRole = role === 'tutor' || role === 'teacher';
            const endpoint = isTutorRole ? '/tutor/my-students' : '/student/my-tutors';
            const res = await axiosSecure.get(endpoint);
            setMyPartners(res.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

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
        if (!formData.partnerEmail) {
            toast.error(`Please select a ${role === 'tutor' ? 'student' : 'tutor'}`);
            return;
        }

        try {
            await axiosSecure.post('/schedules', {
                ...formData,
                date: selectedDate
            });
            toast.success('Class scheduled successfully');
            setShowAddModal(false);
            fetchSchedule();
            setFormData({ tuitionId: '', partnerEmail: '', startTime: '', endTime: '', subject: '', notes: '', meetingLink: 'https://meet.google.com/' });
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
            const userEmailLower = user?.email?.toLowerCase();
            const daySchedules = schedules.filter(s => {
                const sDate = new Date(s.date);
                // Strict One-to-One Participation Check
                const isParticipant = s.studentEmail?.toLowerCase() === userEmailLower ||
                    s.tutorEmail?.toLowerCase() === userEmailLower;

                return isParticipant &&
                    sDate.getFullYear() === date.getFullYear() &&
                    sDate.getMonth() === date.getMonth() &&
                    sDate.getDate() === date.getDate();
            });

            days.push(
                <div
                    key={day}
                    className={`h-24 border border-base-200 p-2 transition-colors hover:bg-base-200 relative group cursor-pointer ${isToday(day) ? 'bg-primary/5' : ''
                        }`}
                    onClick={() => {
                        const isTutorRole = role === 'tutor' || role === 'teacher';
                        if (isTutorRole || role === 'student') {
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
                        {(role === 'tutor' || role === 'student') && (
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
                    <h1 className="text-2xl font-bold text-primary">Class Schedule</h1>
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
                    {((role === 'tutor' || role === 'teacher') || role === 'student') && (
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
                        .filter(s => {
                            const userEmailLower = user?.email?.toLowerCase();
                            const isParticipant = s.studentEmail?.toLowerCase() === userEmailLower ||
                                s.tutorEmail?.toLowerCase() === userEmailLower;

                            if (!isParticipant) return false;

                            const scheduleDate = new Date(s.date);
                            scheduleDate.setHours(0, 0, 0, 0);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return scheduleDate >= today;
                        })
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map(schedule => (
                            <Card
                                key={schedule._id}
                                hover
                                glass
                                className="group relative overflow-hidden h-full flex flex-col border-none ring-1 ring-base-200/50 hover:ring-primary/50 transition-all duration-500"
                            >
                                {/* Decorative Gradient Background */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Header: Subject & Date */}
                                    <div className="flex justify-between items-start gap-4 mb-5">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-xl text-base-content leading-tight group-hover:text-primary transition-colors duration-300 truncate" title={schedule.subject}>
                                                {schedule.subject}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2 group/text">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 ring-2 ring-primary/20">
                                                        <span className="text-[10px] font-bold">
                                                            {(role === 'tutor' ? (schedule.studentName || 'S') : (schedule.tutorName || 'T'))[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-base-content/60 truncate">
                                                    {(role === 'tutor' || role === 'teacher') ?
                                                        (schedule.studentName || schedule.studentEmail) :
                                                        (schedule.tutorName || schedule.tutorEmail)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                                                Class Date
                                            </div>
                                            <span className="text-sm font-bold text-base-content/80 whitespace-nowrap">
                                                {new Date(schedule.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Middle: Time & Notes */}
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/20 transition-all">
                                                <Clock size={18} className="text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-tight">Time Slot</span>
                                                <span className="text-sm font-bold text-base-content/90 whitespace-nowrap">
                                                    {schedule.startTime} — {schedule.endTime}
                                                </span>
                                            </div>
                                        </div>

                                        {schedule.notes && (
                                            <div className="relative group/note">
                                                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary/20 rounded-full group-hover/note:bg-primary transition-colors" />
                                                <div className="pl-4 py-1">
                                                    <p className="text-sm text-base-content/60 italic leading-snug line-clamp-2">
                                                        "{schedule.notes}"
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer: Actions */}
                                    <div className="mt-6 pt-5 border-t border-base-200/60 flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            fullWidth
                                            leftIcon={Video}
                                            className="h-12 -ml-4 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 font-bold"
                                            onClick={() => window.open(schedule.meetingLink || 'https://meet.google.com/', '_blank')}
                                        >
                                            Join Class
                                        </Button>
                                        {schedule.createdBy?.toLowerCase() === user?.email?.toLowerCase() && (
                                            <button
                                                onClick={() => handleDelete(schedule._id)}
                                                className="w-11 h-11 rounded-xl flex items-center justify-center text-error/40 hover:text-error hover:bg-error/10 hover:shadow-sm active:scale-90 transition-all duration-300 shrink-0"
                                                title="Cancel Class"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
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
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Schedule Class"
                size="md"
            >
                <form onSubmit={handleCreateSchedule} className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-2xl mb-4 text-center border border-primary/20">
                        <p className="text-sm font-bold text-primary flex items-center justify-center gap-2">
                            <CalendarIcon size={16} />
                            Date: {selectedDate?.toLocaleDateString()}
                        </p>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-bold">Select Active {(role === 'tutor' || role === 'teacher') ? 'Student' : 'Tutor'}</span>
                        </label>
                        <select
                            className="select select-bordered w-full rounded-2xl focus:outline-none focus:border-primary"
                            value={formData.tuitionId + '|' + formData.partnerEmail}
                            onChange={(e) => {
                                const [tId, pEmail] = e.target.value.split('|');
                                setFormData({ ...formData, tuitionId: tId, partnerEmail: pEmail });
                            }}
                            required
                        >
                            <option value="">Choose a {(role === 'tutor' || role === 'teacher') ? 'student' : 'tutor'}...</option>
                            {myPartners.map(t => (
                                <option key={t._id} value={t._id + '|' + ((role === 'tutor' || role === 'teacher') ? (t.studentEmail || t.studentId) : (t.tutorEmail || t.assignedTutorEmail))}>
                                    {t.subject} - {(role === 'tutor' || role === 'teacher') ? t.studentName : t.tutorName} ({(role === 'tutor' || role === 'teacher') ? (t.studentEmail || t.studentId) : (t.tutorEmail || t.assignedTutorEmail)})
                                </option>
                            ))}
                        </select>
                        {myPartners.length === 0 && (
                            <p className="text-xs text-error mt-1">No active tuitions found to schedule classes.</p>
                        )}
                    </div>

                    <Input
                        label="Subject Focus"
                        placeholder="e.g. Physics Chapter 5 Discussion"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        fullWidth
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Start Time"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="End Time"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>

                    <Input
                        label="Meeting Link"
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        value={formData.meetingLink}
                        onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                        required
                        fullWidth
                    />

                    <Input
                        label="Notes (Optional)"
                        placeholder="Topic details or prep material..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        fullWidth
                    />

                    <div className="pt-6 flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowAddModal(false)}
                            className="order-2 sm:order-1 flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="order-1 sm:order-2 flex-1 shadow-lg shadow-primary/20"
                        >
                            Schedule Class
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Calendar;
