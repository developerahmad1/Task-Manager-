import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }) => {
    const { token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tasks based on search query
    const filteredTasks = tasks.filter(task => {
        const query = searchQuery.toLowerCase();
        return (
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        );
    });

    // Socket.IO setup
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const socket = io(apiUrl);

        socket.on('taskCreated', (task) => {
            setTasks(prev => [task, ...prev]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
        });

        socket.on('taskDeleted', (id) => {
            setTasks(prev => prev.filter(task => task._id !== id));
        });

        return () => socket.close();
    }, []);

    // Fetch tasks when authenticated
    useEffect(() => {
        if (token) {
            fetchTasks();
        } else {
            setTasks([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchTasks = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/tasks`, {
                headers: { 'x-auth-token': token }
            });
            setTasks(res.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData) => {
        const loadingToast = toast.loading('Creating task...');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/tasks`, taskData, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
            toast.success('Task created successfully! 🎉', { id: loadingToast });
            closeModal();
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error('Error creating task. Please try again.', { id: loadingToast });
            return { success: false };
        }
    };

    const updateTask = async (id, taskData) => {
        const loadingToast = toast.loading('Updating task...');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            await axios.put(`${apiUrl}/tasks/${id}`, taskData, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
            toast.success('Task updated successfully! ✅', { id: loadingToast });
            closeModal();
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error('Error updating task. Please try again.', { id: loadingToast });
            return { success: false };
        }
    };

    const deleteTask = async (id) => {
        const loadingToast = toast.loading('Deleting task...');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            await axios.delete(`${apiUrl}/tasks/${id}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Task deleted successfully! 🗑️', { id: loadingToast });
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error('Error deleting task', { id: loadingToast });
            return { success: false };
        }
    };

    const openModal = (task = null) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentTask(null);
        setIsModalOpen(false);
    };

    const value = {
        tasks,
        filteredTasks,
        loading,
        isModalOpen,
        currentTask,
        searchQuery,
        setSearchQuery,
        createTask,
        updateTask,
        deleteTask,
        openModal,
        closeModal,
        fetchTasks
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};
