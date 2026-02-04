import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import SearchBar from './components/SearchBar';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import { useTask } from '../../context/TaskContext';

const DashboardPage = () => {
    const { openModal, filteredTasks } = useTask();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-sky-50">
            {/* Beautiful Light Theme Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm my-5 mx-5 rounded-2xl shadow-lg">
                <div className="max-w-7xl mx-auto px-2  px-6 py-3 ">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        {/* Heading and Task Count */}
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                My Tasks
                            </h2>
                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                                    {filteredTasks.length}
                                </span>
                                {filteredTasks.length === 1 ? 'task' : 'tasks'} in total
                            </p>
                        </div>

                        {/* Add Task Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 
                                     text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-sky-600 
                                     hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 
                                     focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <FiPlus className="text-xl" />
                            <span>Add Task</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* Search Bar */}
                    <SearchBar />

                    {/* Task Table */}
                    <TaskTable />

                    {/* Task Modal */}
                    <TaskModal />
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardPage;
