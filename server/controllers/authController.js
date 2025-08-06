const User = require('../models/authModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Registration Success:', { _id: user._id, name: user.name, email: user.email, token });
        res.status(201).json({ message: 'User registered', _id: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login Success:', { _id: user._id, name: user.name, email: user.email, role: user.role, token });
        res.status(200).json({ message: 'Login successful', _id: user._id, name: user.name, email: user.email, role: user.role, token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Update user details
exports.updateUser = async (req, res) => {
    const { id, name, email } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        console.log('User updated:', user);
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset token (Configure nodemailer for your email provider)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Request Password Reset Error:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = await bcrypt.hash(newPassword, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};
