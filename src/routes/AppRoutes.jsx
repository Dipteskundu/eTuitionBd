import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { ROLES } from '../utils/constants';

// Public Pages
import Home from '../pages/public/Home';
import Tuitions from '../pages/public/Tuitions';
import TuitionDetails from '../pages/public/TuitionDetails';
import Tutors from '../pages/public/Tutors';
import TutorDetails from '../pages/public/TutorDetails';
import NotFound from '../pages/public/NotFound';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard Pages - Student
import StudentOverview from '../pages/dashboard/student/StudentOverview';
import PostTuition from '../pages/dashboard/student/PostTuition';
import MyTuitions from '../pages/dashboard/student/MyTuitions';
import StudentApplications from '../pages/dashboard/student/Applications';
import PaymentHistory from '../pages/dashboard/student/PaymentHistory';
import PaymentSuccess from '../pages/dashboard/student/PaymentSuccess';
import StudentProfile from '../pages/dashboard/student/StudentProfile';

// Dashboard Pages - Tutor
import TutorOverview from '../pages/dashboard/tutor/TutorOverview';
import AvailableTuitions from '../pages/dashboard/tutor/AvailableTuitions';
import AppliedTuitions from '../pages/dashboard/tutor/AppliedTuitions';
import Earnings from '../pages/dashboard/tutor/Earnings';
import TutorProfile from '../pages/dashboard/tutor/TutorProfile';

// Dashboard Pages - Admin
import AdminOverview from '../pages/dashboard/admin/AdminOverview';
import ManageUsers from '../pages/dashboard/admin/ManageUsers';
import TeacherRequests from '../pages/dashboard/admin/TeacherRequests'; // New Import
import ManageTuitions from '../pages/dashboard/admin/ManageTuitions';
import Transactions from '../pages/dashboard/admin/Transactions';
import Reports from '../pages/dashboard/admin/Reports';
import AdminProfile from '../pages/dashboard/admin/AdminProfile';
import StudentProfileDetails from '../pages/dashboard/admin/StudentProfileDetails'; // New Import
import ProfileSettings from '../components/dashboard/ProfileSettings'; // Import directly
import MyTransactions from '../pages/dashboard/common/MyTransactions'; // New Import

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/tuitions" element={<Tuitions />} />
                <Route path="/tuitions/:id" element={<TuitionDetails />} />
                <Route path="/tutors" element={<Tutors />} />
                <Route path="/tutors/:id" element={<TutorDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<div className="p-10 text-center text-red-500 font-bold text-2xl">Unauthorized Access</div>} />
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Student & Tutor Dashboard Routes */}
            <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                {/* Student Routes */}
                <Route path="/dashboard/student" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentOverview /></RoleRoute>} />
                <Route path="/dashboard/student/post-tuition" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PostTuition /></RoleRoute>} />
                <Route path="/dashboard/student/my-tuitions" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><MyTuitions /></RoleRoute>} />
                <Route path="/dashboard/student/my-tuitions" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><MyTuitions /></RoleRoute>} />

                {/* Tuition Applications Route (Moved out of student/ specific namespace but protected) */}
                <Route path="/dashboard/tuition/:tuitionId/applications" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentApplications /></RoleRoute>} />

                <Route path="/dashboard/transactions" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PaymentHistory /></RoleRoute>} />
                <Route path="/dashboard/student/payment/success" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><PaymentSuccess /></RoleRoute>} />
                <Route path="/dashboard/student/profile" element={<RoleRoute allowedRoles={[ROLES.STUDENT]}><StudentProfile /></RoleRoute>} />

                {/* Tutor Routes */}
                <Route path="/dashboard/tutor" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><TutorOverview /></RoleRoute>} />
                <Route path="/dashboard/tutor/available-tuitions" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><AvailableTuitions /></RoleRoute>} />
                <Route path="/dashboard/tutor/applied-tuitions" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><AppliedTuitions /></RoleRoute>} />
                <Route path="/dashboard/tutor/earnings" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><Earnings /></RoleRoute>} />
                <Route path="/dashboard/tutor/profile" element={<RoleRoute allowedRoles={[ROLES.TUTOR]}><TutorProfile /></RoleRoute>} />

                {/* Shared Profile Settings Route */}
                <Route path="/profile-settings" element={
                    <div className="w-full">
                        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                        <ProfileSettings />
                    </div>
                } />
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
                {/* Can add AdminProfile or ProfileSettings if needed */}
                <Route path="profile" element={<ProfileSettings />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
