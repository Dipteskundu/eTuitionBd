import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

// Layouts - Keep these as regular imports since they're used frequently
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Loading Component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-base-content/70 font-medium">Loading...</p>
        </div>
    </div>
);

// Lazy-loaded Public Pages
const Home = lazy(() => import('../pages/public/Home'));
const Tuitions = lazy(() => import('../pages/public/Tuitions'));
const TuitionDetails = lazy(() => import('../pages/public/TuitionDetails'));
const Tutors = lazy(() => import('../pages/public/Tutors'));
const TutorDetails = lazy(() => import('../pages/public/TutorDetails'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const About = lazy(() => import('../pages/public/About'));
const Contact = lazy(() => import('../pages/public/Contact'));

// Lazy-loaded Auth Pages
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));

// Lazy-loaded Dashboard Pages - Student
const StudentOverview = lazy(() => import('../pages/dashboard/student/StudentOverview'));
const PostTuition = lazy(() => import('../pages/dashboard/student/PostTuition'));
const MyTuitions = lazy(() => import('../pages/dashboard/student/MyTuitions'));
const StudentApplications = lazy(() => import('../pages/dashboard/student/Applications'));
const PaymentHistory = lazy(() => import('../pages/dashboard/student/PaymentHistory'));
const PaymentSuccess = lazy(() => import('../pages/dashboard/student/PaymentSuccess'));
const StudentProfile = lazy(() => import('../pages/dashboard/student/StudentProfile'));
const PaymentPage = lazy(() => import('../pages/dashboard/student/PaymentPage'));
const UpdateTuition = lazy(() => import('../pages/dashboard/student/UpdateTuition'));

// Lazy-loaded Dashboard Pages - Tutor
const TutorOverview = lazy(() => import('../pages/dashboard/tutor/TutorOverview'));
const AvailableTuitions = lazy(() => import('../pages/dashboard/tutor/AvailableTuitions'));
const AppliedTuitions = lazy(() => import('../pages/dashboard/tutor/AppliedTuitions'));
const Earnings = lazy(() => import('../pages/dashboard/tutor/Earnings'));
const TutorProfile = lazy(() => import('../pages/dashboard/tutor/TutorProfile'));

// Lazy-loaded Dashboard Pages - Admin
const AdminOverview = lazy(() => import('../pages/dashboard/admin/AdminOverview'));
const ManageUsers = lazy(() => import('../pages/dashboard/admin/ManageUsers'));
const TeacherRequests = lazy(() => import('../pages/dashboard/admin/TeacherRequests'));
const ManageTuitions = lazy(() => import('../pages/dashboard/admin/ManageTuitions'));
const Transactions = lazy(() => import('../pages/dashboard/admin/Transactions'));
const Reports = lazy(() => import('../pages/dashboard/admin/Reports'));
const AdminProfile = lazy(() => import('../pages/dashboard/admin/AdminProfile'));
const StudentProfileDetails = lazy(() => import('../pages/dashboard/admin/StudentProfileDetails'));

// Lazy-loaded Shared Components
const ProfileSettings = lazy(() => import('../components/dashboard/ProfileSettings'));
const MyTransactions = lazy(() => import('../pages/dashboard/common/MyTransactions'));
const Messages = lazy(() => import('../pages/dashboard/shared/Messages'));
const Bookmarks = lazy(() => import('../pages/dashboard/shared/Bookmarks'));
const Calendar = lazy(() => import('../pages/dashboard/shared/Calendar'));
const NotificationBell = lazy(() => import('../components/ui/NotificationBell'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/tuitions" element={<Tuitions />} />
                    <Route path="/tutors" element={<Tutors />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/unauthorized" element={<div className="p-10 text-center text-red-500 font-bold text-2xl">Unauthorized Access</div>} />
                </Route>

                {/* Protected Detail Pages - Requires Login */}
                <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                    <Route path="/tuitions/:id" element={<TuitionDetails />} />
                    <Route path="/tutors/:id" element={<TutorDetails />} />
                </Route>

                {/* Protected Student & Tutor Dashboard Routes */}
                <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                    {/* Student Routes */}
                    <Route path="/dashboard/student" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentOverview /></RoleRoute>} />
                    <Route path="/dashboard/student/post-tuition" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PostTuition /></RoleRoute>} />
                    <Route path="/dashboard/student/my-tuitions" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><MyTuitions /></RoleRoute>} />
                    <Route path="/dashboard/student/update-tuition/:id" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><UpdateTuition /></RoleRoute>} />

                    {/* Tuition Applications Route (Moved out of student/ specific namespace but protected) */}
                    <Route path="/dashboard/student/applications" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentApplications /></RoleRoute>} />
                    <Route path="/dashboard/student/applications/:tuitionId" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentApplications /></RoleRoute>} />
                    {/* Legacy Route Support (to prevent 404 on stale links) */}
                    <Route path="/dashboard/tuition/:tuitionId/applications" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentApplications /></RoleRoute>} />


                    <Route path="/dashboard/payment/:applicationId" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PaymentPage /></RoleRoute>} />
                    <Route path="/dashboard/student/payments" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PaymentHistory /></RoleRoute>} />
                    <Route path="/dashboard/transactions" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PaymentHistory /></RoleRoute>} />
                    <Route path="/dashboard/student/payment/success" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PaymentSuccess /></RoleRoute>} />
                    <Route path="/dashboard/student/profile" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentProfile /></RoleRoute>} />
                    <Route path="/dashboard/student/messages" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><Messages /></RoleRoute>} />
                    <Route path="/dashboard/student/bookmarks" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><Bookmarks /></RoleRoute>} />
                    <Route path="/dashboard/student/calendar" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><Calendar /></RoleRoute>} />

                    {/* Tutor Routes */}
                    <Route path="/dashboard/tutor" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><TutorOverview /></RoleRoute>} />
                    <Route path="/dashboard/tutor/available-tuitions" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><AvailableTuitions /></RoleRoute>} />
                    <Route path="/dashboard/tutor/applied-tuitions" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><AppliedTuitions /></RoleRoute>} />
                    <Route path="/dashboard/tutor/earnings" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><Earnings /></RoleRoute>} />
                    <Route path="/dashboard/tutor/profile" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><TutorProfile /></RoleRoute>} />
                    <Route path="/dashboard/tutor/messages" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><Messages /></RoleRoute>} />
                    <Route path="/dashboard/tutor/calendar" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><Calendar /></RoleRoute>} />

                    {/* Shared Profile Settings Route */}
                    <Route path="/profile-settings" element={
                        <div className="w-full">
                            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                            <ProfileSettings />
                        </div>
                    } />
                    <Route path="/dashboard/notifications" element={<div className="p-6"><h1 className="text-2xl font-bold mb-4">Notifications</h1><NotificationBell fullPage /></div>} />
                </Route>

                {/* Protected Admin Dashboard Routes */}
                <Route path="/dashboard/admin" element={
                    <PrivateRoute>
                        <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                            <AdminLayout />
                        </RoleRoute>
                    </PrivateRoute>
                }>
                    <Route index element={<AdminOverview />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="teacher-requests" element={<TeacherRequests />} /> {/* New Route */}
                    <Route path="tuitions" element={<ManageTuitions />} />
                    <Route path="student-profile/:email" element={<StudentProfileDetails />} /> {/* New Route */}
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="messages" element={<Messages />} />
                    {/* Can add AdminProfile or ProfileSettings if needed */}
                    <Route path="profile" element={<ProfileSettings />} />
                </Route>

                {/* Catch-all for any unmatched routes */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
