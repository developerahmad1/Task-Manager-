import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTask } from '../../../context/TaskContext';

const TaskCard = ({ task }) => {
    const { openModal, deleteTask } = useTask();

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
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold text-gray-800">Delete this task?</p>
                <p className="text-sm text-gray-600">"{task.title}"</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await deleteTask(task._id);
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

    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="task-card group"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 flex-1 pr-2">
                    {task.title}
                </h3>
                <span className={`status-badge flex items-center gap-1 ${statusConfig.className}`}>
                    <StatusIcon className="text-sm" />
                    <span className="hidden sm:inline">{statusConfig.label}</span>
                </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
                {task.description || 'No description provided'}
            </p>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal(task)}
                    className="flex-1 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg
                             hover:shadow-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                >
                    <FiEdit2 className="text-base" />
                    <span>Edit</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold py-2 px-4 rounded-lg
                             hover:shadow-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                >
                    <FiTrash2 className="text-base" />
                    <span>Delete</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default TaskCard;
