import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AllTuitions from './pages/Tuitions/AllTuitions';
import TuitionDetails from './pages/Tuitions/TuitionDetails';
import AllTutors from './pages/Tutors/AllTutors';
import TutorProfile from './pages/Tutors/TutorProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import Error404 from './pages/Error404';

// Student Dashboard
import StudentDashboard from './pages/Dashboards/Student/StudentDashboard';
import MyTuitions from './pages/Dashboards/Student/MyTuitions';
import PostTuition from './pages/Dashboards/Student/PostTuition';
import AppliedTutors from './pages/Dashboards/Student/AppliedTutors';
import PaymentHistory from './pages/Dashboards/Student/PaymentHistory';

// Tutor Dashboard
import TutorDashboard from './pages/Dashboards/Tutor/TutorDashboard';
import MyApplications from './pages/Dashboards/Tutor/MyApplications';
import OngoingTuitions from './pages/Dashboards/Tutor/OngoingTuitions';
import RevenueHistory from './pages/Dashboards/Tutor/RevenueHistory';

// Admin Dashboard
import AdminDashboard from './pages/Dashboards/Admin/AdminDashboard';
import UserManagement from './pages/Dashboards/Admin/UserManagement';
import TuitionManagement from './pages/Dashboards/Admin/TuitionManagement';
import ReportsAnalytics from './pages/Dashboards/Admin/ReportsAnalytics';

// Payment
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PaymentCancel from './pages/Payment/PaymentCancel';

// Profile
import ProfileSettings from './pages/ProfileSettings';

// Private Route Component
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="tuitions" element={<AllTuitions />} />
            <Route path="tuitions/:id" element={<TuitionDetails />} />
            <Route path="tutors" element={<AllTutors />} />
            <Route path="tutors/:id" element={<TutorProfile />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Student Dashboard */}
          <Route path="/dashboard/student" element={<PrivateRoute allowedRoles={['student']}><DashboardLayout /></PrivateRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="my-tuitions" element={<MyTuitions />} />
            <Route path="post-tuition" element={<PostTuition />} />
            <Route path="applied-tutors" element={<AppliedTutors />} />
            <Route path="payment-history" element={<PaymentHistory />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Tutor Dashboard */}
          <Route path="/dashboard/tutor" element={<PrivateRoute allowedRoles={['tutor']}><DashboardLayout /></PrivateRoute>}>
            <Route index element={<TutorDashboard />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="ongoing-tuitions" element={<OngoingTuitions />} />
            <Route path="revenue-history" element={<RevenueHistory />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/dashboard/admin" element={<PrivateRoute allowedRoles={['admin']}><DashboardLayout /></PrivateRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="tuition-management" element={<TuitionManagement />} />
            <Route path="reports" element={<ReportsAnalytics />} />
          </Route>

          {/* Payment */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
