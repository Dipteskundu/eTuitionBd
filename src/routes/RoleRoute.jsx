import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loader from '../components/ui/Loader';

const RoleRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading: authLoading } = useAuth();
    const { role, loading: roleLoading } = useRole();
    const location = useLocation();

    if (authLoading || roleLoading) {
        return <Loader fullScreen text="Verifying permissions..." />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!role || !allowedRoles.includes(role)) {
        // Redirect to home if authorized but wrong role, or unauthorized page
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleRoute;
