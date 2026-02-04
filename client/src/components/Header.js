import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckSquare, FiLogOut, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - closes on click */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="text-xl" />
                                </motion.button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to logout? You'll need to login again to access your tasks.
                            </p>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onConfirm}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-xl
                                             hover:shadow-lg transition-all duration-300"
                                >
                                    Yes, Logout
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl
                                             hover:bg-gray-200 transition-all duration-300"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const Header = () => {
    const { logout, isAuthenticated, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const menuRef = useRef(null);

    // Get user info from context
    const userEmail = user?.email || 'user@example.com';
    const userName = user?.username || 'User';

    // Get first letter of name
    const firstLetter = userName.charAt(0).toUpperCase();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    if (!isAuthenticated) return null;

    const handleLogout = () => {
        setIsLogoutModalOpen(false);
        setIsMenuOpen(false);
        logout();
    };

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex items-center gap-2.5"
                        >
                            <div className="p-1.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg">
                                <FiCheckSquare className="text-white text-xl" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                Task Manager
                            </h1>
                        </motion.div>

                        {/* Profile Menu */}
                        <div className="relative" ref={menuRef}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-600 
                                         text-white font-bold text-base rounded-full hover:shadow-lg
                                         transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                            >
                                {firstLetter}
                            </motion.button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 
                                                 overflow-hidden z-20"
                                    >
                                        {/* User Info */}
                                        <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-3 border-b border-gray-200">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-600 
                                                              text-white font-bold text-base rounded-full">
                                                    {firstLetter}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">{userName}</p>
                                                    <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Logout Button */}
                                        <div className="p-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02, x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsLogoutModalOpen(true);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 
                                                         hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                                            >
                                                <FiLogOut className="text-lg" />
                                                <span>Logout</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />
        </>
    );
};

export default Header;
