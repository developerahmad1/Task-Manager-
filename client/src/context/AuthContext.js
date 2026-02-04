import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Decode token and set user info
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            try {
                // Decode JWT token to get user info
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Check if token is expired
                const currentTime = Date.now() / 1000; // Convert to seconds
                if (payload.exp && payload.exp < currentTime) {
                    // Token expired, silently logout user
                    setToken(null);
                    setUser(null);
                    return;
                }

                setUser({
                    id: payload.id,
                    email: payload.email,
                    username: payload.username || payload.name || 'User'
                });
            } catch (error) {
                console.error('Error decoding token:', error);
                setToken(null);
                setUser(null);
            }
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = async (formData) => {
        setLoading(true);
        const loadingToast = toast.loading('Logging in...');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/auth/login`, formData);
            setToken(res.data.token);
            toast.success('Welcome back! 🎉', { id: loadingToast });
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check if the backend server is running.';
            toast.error(errorMessage, { id: loadingToast });
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setLoading(true);
        const loadingToast = toast.loading('Creating your account...');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/auth/register`, formData);
            setToken(res.data.token);
            toast.success('Account created successfully! 🎉', { id: loadingToast });
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please check if the backend server is running.';
            toast.error(errorMessage, { id: loadingToast });
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        toast.success('Logged out successfully');
    };

    const value = {
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
