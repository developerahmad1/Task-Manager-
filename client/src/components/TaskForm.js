import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTask } from '../context/TaskContext';

const TaskForm = () => {
    const { currentTask, closeModal, createTask, updateTask } = useTask();
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'pending'
    });

    const { title, description, status } = task;

    useEffect(() => {
        if (currentTask) {
            setTask(currentTask);
        } else {
            setTask({
                title: '',
                description: '',
                status: 'pending'
            });
        }
    }, [currentTask]);

    const onChange = e => setTask({ ...task, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        if (currentTask) {
            // Update
            const result = await updateTask(currentTask._id, task);
            if (result.success) {
                closeModal(); // Clear current task (exit edit mode)
            }
        } else {
            // Create
            const result = await createTask(task);
            if (result.success) {
                // Form is cleared by logic in context if successful or manually here? 
                // Context createTask calls closeModal() which clears currentTask, but local state 'task' needs reset.
                setTask({
                    title: '',
                    description: '',
                    status: 'pending'
                });
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 sm:p-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    {currentTask ? 'Edit Task' : 'Add New Task'}
                </h3>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Task Title
                    </label>
                    <input
                        type="text"
                        placeholder="Enter task title..."
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                        className="input-field"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>
                    <input
                        type="text"
                        placeholder="Enter task description..."
                        name="description"
                        value={description}
                        onChange={onChange}
                        className="input-field"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        name="status"
                        value={status}
                        onChange={onChange}
                        className="input-field cursor-pointer"
                    >
                        <option value="pending">📋 Pending</option>
                        <option value="in-progress">⚡ In Progress</option>
                        <option value="completed">✅ Completed</option>
                    </select>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex gap-3 pt-2"
                >
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary flex-1"
                    >
                        {currentTask ? '✓ Update Task' : '+ Add Task'}
                    </motion.button>

                    {currentTask && (
                        <motion.button
                            type="button"
                            onClick={() => closeModal()}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-secondary"
                        >
                            Cancel
                        </motion.button>
                    )}
                </motion.div>
            </form>
        </motion.div>
    );
};

export default TaskForm;
