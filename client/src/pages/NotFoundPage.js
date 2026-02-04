import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertcircle } from 'react-icons/fi';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg mx-auto"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-6"
                >
                    <span className="text-9xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                        404
                    </span>
                </motion.div>

                <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 
                             text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 
                             transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <FiHome className="text-xl" />
                    Back to Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
