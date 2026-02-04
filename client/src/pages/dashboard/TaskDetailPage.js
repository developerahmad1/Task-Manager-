import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiCircle, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { useTask } from '../../context/TaskContext';
import TaskModal from './components/TaskModal';

const TaskDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tasks, openModal, deleteTask } = useTask();
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, task: null });

    const task = tasks.find(t => t._id === id);

    useEffect(() => {
        if (!task) {
            // If task not found, redirect to dashboard
            navigate('/');
        }
    }, [task, navigate]);

    if (!task) {
        return null;
    }

    const getStatusConfig = (status) => {
        const configs = {
            'pending': {
                icon: FiClock,
                className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                label: 'Pending'
            },
            'in-progress': {
                icon: FiCircle,
                className: 'bg-blue-100 text-blue-800 border border-blue-200',
                label: 'In Progress'
            },
            'completed': {
                icon: FiCheckCircle,
                className: 'bg-green-100 text-green-800 border border-green-200',
                label: 'Completed'
            }
        };
        return configs[status] || configs['pending'];
    };

    const handleDelete = () => {
        setDeleteConfirm({ show: true, task });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.task) {
            const result = await deleteTask(deleteConfirm.task._id);
            setDeleteConfirm({ show: false, task: null });
            if (result.success) {
                navigate('/');
            }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ show: false, task: null });
    };

    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Back Button */}
                <motion.button
                    whileHover={{ scale: 1.02, x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium"
                >
                    <FiArrowLeft className="text-lg" />
                    Back to Tasks
                </motion.button>

                {/* Task Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                                    {task.title}
                                </h1>
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.className}`}>
                                    <StatusIcon className="text-base" />
                                    {statusConfig.label}
                                </span>
                            </div>

                            {/* Action Icons */}
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => openModal(task)}
                                    className="p-3 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl transition-colors"
                                    title="Edit Task"
                                >
                                    <FiEdit2 className="text-xl" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleDelete}
                                    className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-colors"
                                    title="Delete Task"
                                >
                                    <FiTrash2 className="text-xl" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 space-y-6">
                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                Description
                            </h2>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {task.description || 'No description provided.'}
                                </p>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {task.createdAt && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <FiCalendar className="text-lg" />
                                        <span className="font-semibold">Created</span>
                                    </div>
                                    <p className="text-gray-700">{formatDate(task.createdAt)}</p>
                                </div>
                            )}
                            {task.updatedAt && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <FiCalendar className="text-lg" />
                                        <span className="font-semibold">Last Updated</span>
                                    </div>
                                    <p className="text-gray-700">{formatDate(task.updatedAt)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Task Modal */}
            <TaskModal />

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={cancelDelete}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Icon Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <FiAlertTriangle className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Delete Task</h3>
                                    <p className="text-red-100 text-sm">This action cannot be undone</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-5">
                                <p className="text-gray-700 mb-2">
                                    Are you sure you want to delete this task?
                                </p>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <p className="font-semibold text-gray-800 truncate">
                                        "{deleteConfirm.task?.title}"
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={cancelDelete}
                                    className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 
                                             font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400
                                             transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white 
                                             font-semibold rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg 
                                             hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 
                                             focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskDetailPage;
