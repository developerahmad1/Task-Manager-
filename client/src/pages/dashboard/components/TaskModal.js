import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave } from 'react-icons/fi';
import { useTask } from '../../../context/TaskContext';

const TaskModal = () => {
    const { isModalOpen, closeModal, currentTask, createTask, updateTask } = useTask();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending'
    });
    const textareaRef = useRef(null);

    useEffect(() => {
        if (currentTask) {
            setFormData(currentTask);
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'pending'
            });
        }
    }, [currentTask]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [formData.description]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (currentTask) {
            await updateTask(currentTask._id, formData);
        } else {
            await createTask(formData);
        }
        // Clear form after successful submission
        setFormData({ title: '', description: '', status: 'pending' });
    };

    const handleClose = () => {
        closeModal();
        setFormData({ title: '', description: '', status: 'pending' });
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ margin: 0 }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[100vh] min-h-[90vh]"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                            zIndex: 10
                        }}
                    >
                        {/* Header - Fixed */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-500 to-blue-600 px-6 sm:px-8 py-3 rounded-t-2xl border-b border-blue-700/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                                        {currentTask ? 'Edit Task' : 'Create New Task'}
                                    </h3>
                                    <p className="text-blue-100 text-xs mt-0.5">
                                        {currentTask ? 'Update your task details' : 'Add a new task to your list'}
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <FiX className="text-2xl" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Form - Scrollable */}
                        <div className="overflow-y-auto px-6 sm:px-8 py-6" style={{ maxHeight: 'calc(100vh - 12rem)', minHeight: 'calc(100vh - 12rem)' }}>
                            <form onSubmit={onSubmit} className="space-y-6">
                                {/* Title Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Task Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter a clear, concise title..."
                                        name="title"
                                        value={formData.title}
                                        onChange={onChange}
                                        required
                                        autoFocus
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                         transition-all duration-300 text-gray-800 placeholder-gray-400
                                                         hover:border-gray-300"
                                    />
                                </div>

                                {/* Description Textarea - Auto-resize */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        ref={textareaRef}
                                        placeholder="Describe your task in detail..."
                                        name="description"
                                        value={formData.description}
                                        onChange={onChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                         transition-all duration-300 text-gray-800 placeholder-gray-400
                                                         hover:border-gray-300 resize-none overflow-hidden"
                                        style={{ minHeight: '80px', maxHeight: '300px' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.description.length} characters
                                    </p>
                                </div>

                                {/* Status Select */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                         transition-all duration-300 text-gray-800 cursor-pointer
                                                         hover:border-gray-300"
                                    >
                                        <option value="pending">🟡 Pending</option>
                                        <option value="in-progress">🔵 In Progress</option>
                                        <option value="completed">🟢 Completed</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        {/* Footer - Fixed */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 sm:px-8 py-3.5 rounded-b-2xl border-t border-gray-200">
                            <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                                <motion.button
                                    type="button"
                                    onClick={handleClose}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-gray-700 
                                                     font-semibold rounded-xl border border-gray-200
                                                     shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md
                                                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="submit"
                                    onClick={onSubmit}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5
                                                     bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl
                                                     hover:from-sky-600 hover:to-blue-700 shadow-lg hover:shadow-xl
                                                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <FiSave className="text-lg" />
                                    {currentTask ? 'Update Task' : 'Create Task'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskModal;
