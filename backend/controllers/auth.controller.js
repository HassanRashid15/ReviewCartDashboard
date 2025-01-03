const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');
const crypto = require('crypto');
const {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendRegistrationNotification,
    sendPasswordUpdateNotification
} = require('../utilities/emailService');

// Register User
exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email, fullname, password } = req.body;

        // Check if all required fields are present
        if (!email || !password || !fullname?.firstname) {
            return res.status(400).json({
                status: 'error',
                message: 'Registration failed. Please try again.',
                error: 'All fields are required'
            });
        }

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
            email,
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname || '' // Make lastname optional
            },
            password: hashedPassword
        });

        // Generate verification code
        const verificationCode = user.generateVerificationCode();
        await user.save();

        // Generate auth token
        const token = user.generateAuthToken();

        // Send verification email
        await sendVerificationEmail(user.email, verificationCode);

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
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
};

// Login User
exports.loginUser = async (req, res) => {
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
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({
                message: 'Please verify your email before logging in',
                isEmailVerified: false
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = user.generateAuthToken();

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

// Verify Email
exports.verifyEmail = async (req, res) => {
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

// Resend Verification Code
exports.resendVerificationCode = async (req, res) => {
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
exports.requestPasswordReset = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email } = req.body;

        // Don't reveal if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: 'If your email is registered, you will receive reset instructions.'
            });
        }

        // Generate reset token and code
        const resetToken = user.generateResetToken();
        const resetCode = user.generateVerificationCode();

        await user.save();

        // Send reset email
        await sendPasswordResetEmail(user.email, resetCode, resetToken);

        res.status(200).json({
            message: 'If your email is registered, you will receive reset instructions.'
        });

    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            message: 'An error occurred. Please try again later.'
        });
    }
};

// Verify Reset Token
exports.verifyResetToken = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email, token, code } = req.body;

        // Hash token for comparison
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await userModel.findOne({
            email,
            resetToken: hashedToken,
            resetTokenExpires: { $gt: Date.now() },
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset credentials'
            });
        }

        res.status(200).json({
            message: 'Reset credentials verified successfully'
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            message: 'An error occurred. Please try again later.'
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { email, token, code, newPassword } = req.body;

        // Hash token for comparison
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await userModel.findOne({
            email,
            resetToken: hashedToken,
            resetTokenExpires: { $gt: Date.now() },
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset credentials'
            });
        }

        // Check if new password is same as current
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                message: 'New password must be different from current password'
            });
        }

        // Check password history
        const isInHistory = await user.isPasswordInHistory(newPassword);
        if (isInHistory) {
            return res.status(400).json({
                message: 'Please use a password you haven\'t used recently'
            });
        }

        // Update password
        const hashedPassword = await userModel.hashPassword(newPassword);

        // Add current password to history before updating
        await user.addPasswordToHistory(user.password);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        user.passwordChangedAt = new Date();

        await user.save();

        // Invalidate all existing sessions
        await blackListTokenModel.create({ userId: user._id });

        // Send notification
        await sendPasswordUpdateNotification(
            user.email,
            `${user.fullname.firstname} ${user.fullname.lastname}`
        );

        res.status(200).json({
            message: 'Password reset successful. Please login with your new password.'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            message: 'An error occurred. Please try again later.'
        });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
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

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { firstname, lastname } = req.body.fullname;

        const user = await userModel.findById(req.user._id);

        user.fullname.firstname = firstname;
        user.fullname.lastname = lastname;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update profile.',
            error: error.message
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { currentPassword, newPassword } = req.body;

        const user = await userModel.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }

        // Check if new password is same as current
        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: 'New password must be different from current password'
            });
        }

        // Check password history
        const isInHistory = await user.isPasswordInHistory(newPassword);
        if (isInHistory) {
            return res.status(400).json({
                message: 'Please use a password you haven\'t used recently'
            });
        }

        // Update password
        await user.addPasswordToHistory(user.password);
        user.password = await userModel.hashPassword(newPassword);
        user.passwordChangedAt = new Date();

        await user.save();

        // Invalidate all existing sessions except current
        await blackListTokenModel.create({
            userId: user._id,
            excludeToken: req.cookies.token || req.headers.authorization?.split(' ')[1]
        });

        // Send notification
        await sendPasswordUpdateNotification(
            user.email,
            `${user.fullname.firstname} ${user.fullname.lastname}`
        );

        res.status(200).json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to change password.',
            error: error.message
        });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [errors.array()[0]]
            });
        }

        const { password } = req.body;

        const user = await userModel.findById(req.user._id).select('+password');

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Incorrect password'
            });
        }

        // Delete user account
        await userModel.findByIdAndDelete(req.user._id);

        // Invalidate all sessions
        await blackListTokenModel.create({ userId: req.user._id });

        res.clearCookie('token');
        res.status(200).json({
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete account.',
            error: error.message
        });
    }
};

// Logout User
exports.logoutUser = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie('token');

        // Get token from cookie or authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            // Add token to blacklist
            await blackListTokenModel.create({ token });
        }

        res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Logout failed. Please try again.',
            error: error.message
        });
    }
};

// Logout from all devices
exports.logoutAllDevices = async (req, res) => {
    try {
        // Clear current session cookie
        res.clearCookie('token');

        // Add all user's tokens to blacklist
        await blackListTokenModel.create({
            userId: req.user._id
        });

        res.status(200).json({
            message: 'Logged out from all devices successfully'
        });
    } catch (error) {
        console.error('Logout all devices error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to logout from all devices. Please try again.',
            error: error.message
        });
    }
};

// Check Auth Status
exports.checkAuthStatus = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                isAuthenticated: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            isAuthenticated: true,
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Auth status check error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to check authentication status.',
            error: error.message
        });
    }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        // Generate new token
        const newToken = user.generateAuthToken();

        // If there was an old token in cookie, blacklist it
        const oldToken = req.cookies.token;
        if (oldToken) {
            await blackListTokenModel.create({ token: oldToken });
        }

        // Set new token in cookie
        res.cookie('token', newToken);

        res.status(200).json({
            message: 'Token refreshed successfully',
            token: newToken
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to refresh token.',
            error: error.message
        });
    }
};

module.exports = exports;