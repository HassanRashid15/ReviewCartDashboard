const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');
const {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendRegistrationNotification,
    sendPasswordUpdateNotification
} = require('../utilities/emailService');

// Register User
module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Only return the first error
            return res.status(400).json({
                errors: [errors.array()[0]]  // Take only the first error
            });
        }

        const { fullname, email, password } = req.body;
        const isUserAlready = await userModel.findOne({ email });

        if (isUserAlready) {
            return res.status(400).json({
                status: 'error',
                message: 'This email is already registered. Please login or use a different email',
                action: 'registration_failed'
            });
        }

        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        // Generate verification code
        const verificationCode = user.generateVerificationCode();
        await user.save();

        // Generate auth token
        const token = user.generateAuthToken();
        res.cookie('token', token);

        // Send verification email
        await sendVerificationEmail(user.email, verificationCode);

        // Send registration notification to user and admin
        await sendRegistrationNotification(
            user.email,
            `${fullname.firstname} ${fullname.lastname}`
        );

        res.status(201).json({
            message: 'Registration successful. Please check your email for verification code.',
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
};

// Verify Email
module.exports.verifyEmail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { code, email } = req.body;

        const user = await userModel.findOne({
            email: email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification code'
            });
        }

        user.isEmailVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;

        await user.save();

        res.status(200).json({
            message: 'Email verified successfully',
            isEmailVerified: true
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Email verification failed. Please try again.',
            error: error.message
        });
    }
};

// Login User
module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({
                message: 'Please verify your email before logging in',
                isEmailVerified: false
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Login failed. Please try again.',
            error: error.message
        });
    }
};

// Get User Profile
module.exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get user profile.',
            error: error.message
        });
    }
};

// Logout User
module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            await blackListTokenModel.create({ token });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Logout failed. Please try again.',
            error: error.message
        });
    }
};

// Resend Verification Code
module.exports.resendVerificationCode = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                message: 'Email is already verified'
            });
        }

        const verificationCode = user.generateVerificationCode();
        await user.save();

        await sendVerificationEmail(user.email, verificationCode);

        res.status(200).json({
            message: 'Verification code resent successfully. Please check your email.'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to resend verification code. Please try again.',
            error: error.message
        });
    }
};

// Request Password Reset
module.exports.requestPasswordReset = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const resetCode = user.generateVerificationCode();
        await user.save();

        await sendPasswordResetEmail(user.email, resetCode);

        res.status(200).json({
            message: 'Password reset instructions sent to your email'
        });

    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process password reset request. Please try again.',
            error: error.message
        });
    }
};

// Reset Password
module.exports.resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email, code, newPassword } = req.body;

        const user = await userModel.findOne({
            email: email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset code'
            });
        }

        const hashedPassword = await userModel.hashPassword(newPassword);
        user.password = hashedPassword;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;

        await user.save();

        await sendPasswordUpdateNotification(
            user.email,
            `${user.fullname.firstname} ${user.fullname.lastname}`
        );

        res.status(200).json({
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to reset password. Please try again.',
            error: error.message
        });
    }
};