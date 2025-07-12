const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    });
};

module.exports.getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Missing credentials' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Incorrect password' });

        const token = createToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        const userToSend = user.toObject();
        delete userToSend.password;

        res.json({ user: userToSend, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.register = async (req, res) => {
    const { name, email, password, role, location } = req.body;

    if (!name || !email || !password || !location.coordinates) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const profilePicture = req.file?.path || null;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            location: {
                type: 'Point',
                coordinates: location.coordinates
            },
            profilePicture
        });

        const token = createToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        const userToSend = user.toObject();
        delete userToSend.password;

        res.status(201).json({ user: userToSend, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.updateUser = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file && req.file.path) {
            updateData.profilePicture = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
