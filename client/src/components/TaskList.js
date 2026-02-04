import React from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTask } from '../context/TaskContext';

const TaskList = () => {
    const { filteredTasks: tasks, openModal, deleteTask } = useTask();

    const onDelete = async (id, title) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold text-gray-800">Delete this task?</p>
                <p className="text-sm text-gray-600">"{title}"</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await deleteTask(id);
                        }}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            'in-progress': 'bg-blue-100 text-blue-800 border border-blue-200',
            'completed': 'bg-green-100 text-green-800 border border-green-200'
        };

        const icons = {
            'pending': '📋',
            'in-progress': '⚡',
            'completed': '✅'
        };

        return (
            <span className={`status-badge ${badges[status]}`}>
                {icons[status]} {status.replace('-', ' ')}
            </span>
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: -100,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    Your Tasks
                </h2>
                <span className="ml-auto bg-gradient-to-r from-sky-400 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
            </div>

            {tasks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-12 text-center"
                >
                    <div className="inline-block p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full mb-4">
                        <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
                    <p className="text-gray-500">Create your first task to get started!</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                >
                    <AnimatePresence>
                        {tasks.map(task => (
                            <motion.div
                                key={task._id}
                                variants={itemVariants}
                                layout
                                className="task-card group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                        {task.title}
                                    </h3>
                                    {getStatusBadge(task.status)}
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {task.description || 'No description provided'}
                                </p>

                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openModal(task)}
                                        className="flex-1 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg
                                                 hover:shadow-lg transition-all duration-300 text-sm"
                                    >
                                        ✏️ Edit
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onDelete(task._id, task.title)}
                                        className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold py-2 px-4 rounded-lg
                                                 hover:shadow-lg transition-all duration-300 text-sm"
                                    >
                                        🗑️ Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default TaskList;
