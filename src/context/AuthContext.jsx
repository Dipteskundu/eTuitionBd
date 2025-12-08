import { createContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const googleProvider = new GoogleAuthProvider();

    // Register with email and password
    const register = async (name, email, password, role, phone, photoURL) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Get Token
            const idToken = await firebaseUser.getIdToken();

            // Send user data to backend for syncing
            const userData = {
                name,
                email,
                role, // Backend sets 'student' if missing, but we pass it if we have it
                phone,
                photoURL
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/user`, userData);

            // Store token
            localStorage.setItem('token', idToken);
            setToken(idToken);

            // We can optimistic update user or fetch it
            // For now, let's wait for onAuthStateChanged or set it manually with basic info
            setUser({ ...userData, uid: firebaseUser.uid });

            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    // Login with email and password
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const idToken = await firebaseUser.getIdToken();

            // Sync login time with backend
            // For login, we just send email so backend finds and updates 'last_loggedIn'
            // But backend expects req.body.email to find query
            await axios.post(`${import.meta.env.VITE_API_URL}/user`, { email });

            // Store token
            localStorage.setItem('token', idToken);
            setToken(idToken);
            // User state will be updated by onAuthStateChanged fetching full profile

            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    // Google login
    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            const idToken = await firebaseUser.getIdToken();

            // Send to backend to create user if not exists or update login time
            const userData = {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                role: 'student' // Default role for Google Login, or backend handles it
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/user`, userData);

            // Store token
            localStorage.setItem('token', idToken);
            setToken(idToken);

            return result;
        } catch (error) {
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } catch (error) {
            throw error;
        }
    };

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log("[AuthContext] Firebase User detected:", firebaseUser.email);
                try {
                    const idToken = await firebaseUser.getIdToken();
                    console.log("[AuthContext] ID Token retrieved");
                    setToken(idToken);
                    localStorage.setItem('token', idToken);

                    // Fetch full user profile (role) from backend
                    console.log("[AuthContext] Fetching user role from backend...");
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/role`, {
                        headers: { Authorization: `Bearer ${idToken}` }
                    });

                    console.log("[AuthContext] Backend Role Response:", res.data);

                    // Update user with role
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        role: res.data.role
                    });

                } catch (error) {
                    console.error('[AuthContext] Error fetching user data:', error);
                    // Fallback using just firebase data if backend fails
                    setUser({
                        ...firebaseUser,
                        role: 'student' // Default fallback to prevent crash
                    });
                }
            } else {
                console.log("[AuthContext] No User");
                setToken(null);
                localStorage.removeItem('token');
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        token,
        register,
        login,
        googleLogin,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
