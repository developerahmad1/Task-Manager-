const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET /tasks: Get all tasks (visible to all users)
router.get('/', auth, async (req, res) => {
    try {
        // Get all tasks, not filtered by user
        const tasks = await Task.find().sort({ created_at: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /tasks/:id: Get a single task (visible to all users)
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /tasks: Create a task
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({
        title,
        description,
        status: 'pending', // Default status
        user: req.user.id // Associate task with authenticated user
    });

    try {
        const newTask = await task.save(); // Fixed: task.save() instead of Task.save()

        // Emit real-time event
        req.io.emit('taskCreated', newTask);

        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /tasks/:id: Update task status/details (any user can update)
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.body.title) task.title = req.body.title;
        if (req.body.description) task.description = req.body.description;
        if (req.body.status) task.status = req.body.status;

        const updatedTask = await task.save();

        // Emit real-time event
        req.io.emit('taskUpdated', updatedTask);

        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /tasks/:id: Delete a task (any user can delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();

        // Emit real-time event
        req.io.emit('taskDeleted', req.params.id);

        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
