import React from 'react';
import useTitle from '../../../hooks/useTitle';
import ProfileSettings from '../../../components/dashboard/ProfileSettings';

const AdminProfile = () => {
    useTitle('Admin Profile');
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-8">Admin Profile</h1>
            <ProfileSettings />
        </div>
    );
};

export default AdminProfile;
