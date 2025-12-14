import useAuth from './useAuth';
import { ROLES } from '../utils/constants';

const useRole = () => {
    const { role, loading } = useAuth();

    const isStudent = role === ROLES.STUDENT;
    const isTutor = role === ROLES.TUTOR;
    const isAdmin = role === ROLES.ADMIN;

    return {
        role,
        loading,
        isStudent,
        isTutor,
        isAdmin,
    };
};

export default useRole;
