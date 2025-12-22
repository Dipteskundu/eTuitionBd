import React from 'react';
import useTitle from '../../../hooks/useTitle';
import ProfileSettings from '../../../components/dashboard/ProfileSettings';

const StudentProfile = () => {
    useTitle('My Profile');
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <ProfileSettings />
        </div>
    );
};

export default StudentProfile;
