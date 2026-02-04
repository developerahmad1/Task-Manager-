const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /register: Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if email already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered. Please use a different email or login.' });
        }

        // Check if username already exists
        existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'This username is already taken. Please choose a different username.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create Token with user data
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }, // 1 day expiration
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err);
                    return res.status(500).json({ message: 'Error creating token' });
                }
                res.status(201).json({ token });
            }
        );

    } catch (err) {
        console.error('Register Error:', err.message);

        // Handle MongoDB duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            if (field === 'email') {
                return res.status(400).json({ message: 'This email is already registered. Please use a different email or login.' });
            } else if (field === 'username') {
                return res.status(400).json({ message: 'This username is already taken. Please choose a different username.' });
            }
        }

        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
});

// POST /login: Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Return Token with user data
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }, // 1 day expiration
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err);
                    return res.status(500).json({ message: 'Error creating token' });
                }
                res.json({ token });
            }
        );

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
});

module.exports = router;
