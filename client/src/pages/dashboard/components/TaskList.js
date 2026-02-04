import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClipboard, FiInbox } from 'react-icons/fi';
import TaskCard from './TaskCard';
import { useTask } from '../../../context/TaskContext';

const TaskList = () => {
    const { tasks } = useTask();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg">
                    <FiClipboard className="w-6 h-6 text-white" />
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
                        <FiInbox className="w-16 h-16 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
                    <p className="text-gray-500">Click "Add Task" to create your first task!</p>
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
                            <TaskCard key={task._id} task={task} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default TaskList;
