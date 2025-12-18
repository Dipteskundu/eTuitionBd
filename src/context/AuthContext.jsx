import { createContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import axiosInstance from '../utils/axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [dbUser, setDbUser] = useState(null);

    // Sync with backend to get user role and details
    const fetchUserRole = async (email) => {
        try {
            // Check localStorage first for immediate UI update if available
            const cachedRole = localStorage.getItem('userRole');
            if (cachedRole) {
                setRole(cachedRole);
            }

            // Allow role fetching even if no token yet (public endpoint or user just logged in)
            const res = await axiosInstance.get(`/users/${email}`);
            if (res.data) {
                const backendRole = res.data.role;
                if (backendRole) {
                    setRole(backendRole);
                    setDbUser(res.data);
                    localStorage.setItem('userRole', backendRole);
                } else {
                    // Backend returned user but no role? Or user not found but res.data exists?
                    // Fallback to localStorage if available to salvage the session
                    const cachedRole = localStorage.getItem('userRole');
                    if (cachedRole) {
                        setRole(cachedRole);
                        // Ideally we should sync back to DB here, but for now we trust cache
                    }
                    setDbUser(res.data);
                }
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            // Fallback to localStorage if backend fails
            const cachedRole = localStorage.getItem('userRole');
            if (cachedRole) {
                setRole(cachedRole);
            }
        }
    };

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logOut = () => {
        setLoading(true);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole'); // Clear role on logout
        return signOut(auth);
    };

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
    };

    const updateUserPassword = (newPassword) => {
        return updatePassword(auth.currentUser, newPassword);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // 1. Get Token FIRST
                try {
                    const token = await currentUser.getIdToken();
                    localStorage.setItem('token', token);

                    // 2. Set User (triggers PrivateRoute check, but token is now ready)
                    setUser(currentUser);

                    // 3. Fetch Role (non-blocking for auth, but good to have)
                    await fetchUserRole(currentUser.email);
                } catch (error) {
                    console.error("Error setting up auth:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                // Logout case
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                setUser(null);
                setRole(null);
                setDbUser(null);
            }

            // 4. Finally stop loading
            setLoading(false);
        });

        return () => {
            return unsubscribe();
        };
    }, []);

    const authInfo = {
        user,
        role,
        dbUser,
        loading,
        createUser,
        signIn,
        signInGoogle,
        logOut,
        updateUserProfile,
        updateUserPassword
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
