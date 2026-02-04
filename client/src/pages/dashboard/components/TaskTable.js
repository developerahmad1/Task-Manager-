import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheckCircle, FiCircle, FiInbox, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useTask } from '../../../context/TaskContext';

const TaskTable = () => {
    const navigate = useNavigate();
    const { filteredTasks, searchQuery, openModal, deleteTask } = useTask();
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, task: null });

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

    const handleDelete = (e, task) => {
        e.stopPropagation();
        setDeleteConfirm({ show: true, task });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.task) {
            await deleteTask(deleteConfirm.task._id);
            setDeleteConfirm({ show: false, task: null });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ show: false, task: null });
    };

    const handleEdit = (e, task) => {
        e.stopPropagation(); // Prevent row click
        openModal(task);
    };

    if (filteredTasks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
                <div className="inline-block p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full mb-4">
                    <FiInbox className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchQuery ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-gray-500">
                    {searchQuery
                        ? `No tasks match "${searchQuery}"`
                        : 'Click "Add Task" to create your first task!'
                    }
                </p>
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTasks.map((task, index) => {
                            const statusConfig = getStatusConfig(task.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.tr
                                    key={task._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    onClick={() => navigate(`/task/${task._id}`)}
                                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-800">{task.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600 truncate max-w-md">
                                            {task.description || 'No description'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                                            <StatusIcon className="text-sm" />
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => handleEdit(e, task)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => handleDelete(e, task)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
                {filteredTasks.map((task, index) => {
                    const statusConfig = getStatusConfig(task.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            onClick={() => navigate(`/task/${task._id}`)}
                            className="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                                    <StatusIcon className="text-xs" />
                                    {statusConfig.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {task.description || 'No description'}
                            </p>
                            <div className="flex gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => handleEdit(e, task)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                    Edit
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => handleDelete(e, task)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

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

export default TaskTable;
