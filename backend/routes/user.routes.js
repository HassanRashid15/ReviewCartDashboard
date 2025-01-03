const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const userController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Custom password validation
const passwordValidation = body('password').custom((value) => {
    const errors = [];

    if (value.length < 8) {
        errors.push('8 characters long');
    }
    if (!/[A-Z]/.test(value)) {
        errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
        errors.push('one lowercase letter');
    }
    if (!/\d/.test(value)) {
        errors.push('one number');
    }
    if (!/[@$!%*?&]/.test(value)) {
        errors.push('one special character (@$!%*?&)');
    }

    if (errors.length > 0) {
        throw new Error(`Password must contain: ${errors.join(', ')}`);
    }
    return true;
});

// Custom email validation
const emailValidation = body('email')
    .isEmail().withMessage('Invalid Email')
    .normalizeEmail()
    .trim()
    .toLowerCase();

// Name validation
const nameValidation = (field) =>
    body(`fullname.${field}`)
        .isLength({ min: 3 }).withMessage(`${field} must be at least 3 characters long`)
        .trim()
        .escape();

// ==================== Public Routes ====================

// Registration route
router.post('/register', [
    emailValidation,
    nameValidation('firstname'),
    nameValidation('lastname'),
    passwordValidation
], userController.registerUser);

// Login route
router.post('/login', [
    emailValidation,
    body('password').notEmpty().withMessage('Password is required')
], userController.loginUser);

// Email verification route
router.post('/verify-email', [
    emailValidation,
    body('code')
        .isLength({ min: 6, max: 6 }).withMessage('Invalid verification code')
        .isNumeric().withMessage('Verification code must contain only numbers')
], userController.verifyEmail);

// Resend verification code route
router.post('/resend-verification', [
    emailValidation
], userController.resendVerificationCode);

// Request password reset route (forgot password)
router.post('/forgot-password', [
    emailValidation
], userController.requestPasswordReset);

// Verify reset token
router.post('/verify-reset-token', [
    emailValidation,
    body('token').notEmpty().withMessage('Reset token is required'),
    body('code')
        .isLength({ min: 6, max: 6 }).withMessage('Invalid verification code')
        .isNumeric().withMessage('Verification code must contain only numbers')
], userController.verifyResetToken);

// Reset password route
router.post('/reset-password', [
    emailValidation,
    body('token').notEmpty().withMessage('Reset token is required'),
    body('code')
        .isLength({ min: 6, max: 6 }).withMessage('Invalid reset code')
        .isNumeric().withMessage('Reset code must contain only numbers'),
    body('newPassword').custom((value, { req }) => {
        // Password strength validation
        const errors = [];
        if (value.length < 8) errors.push('8 characters long');
        if (!/[A-Z]/.test(value)) errors.push('one uppercase letter');
        if (!/[a-z]/.test(value)) errors.push('one lowercase letter');
        if (!/\d/.test(value)) errors.push('one number');
        if (!/[@$!%*?&]/.test(value)) errors.push('one special character (@$!%*?&)');

        if (errors.length > 0) {
            throw new Error(`Password must contain: ${errors.join(', ')}`);
        }

        // Check if matches confirm password
        if (value !== req.body.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        return true;
    }),
    body('confirmPassword').notEmpty().withMessage('Please confirm your password')
], userController.resetPassword);

// ==================== Protected Routes ====================

// Profile route
router.get('/profile',
    authMiddleware.authUser,
    userController.getUserProfile
);

// Update profile route
router.put('/profile/update', [
    authMiddleware.authUser,
    nameValidation('firstname'),
    nameValidation('lastname')
], userController.updateProfile);

// Change password route
router.post('/change-password', [
    authMiddleware.authUser,
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').custom((value, { req }) => {
        // Password strength validation
        const errors = [];
        if (value.length < 8) errors.push('8 characters long');
        if (!/[A-Z]/.test(value)) errors.push('one uppercase letter');
        if (!/[a-z]/.test(value)) errors.push('one lowercase letter');
        if (!/\d/.test(value)) errors.push('one number');
        if (!/[@$!%*?&]/.test(value)) errors.push('one special character (@$!%*?&)');

        if (errors.length > 0) {
            throw new Error(`Password must contain: ${errors.join(', ')}`);
        }

        // Check if new password is same as current
        if (value === req.body.currentPassword) {
            throw new Error('New password must be different from current password');
        }

        // Check if matches confirm password
        if (value !== req.body.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        return true;
    }),
    body('confirmPassword').notEmpty().withMessage('Please confirm your password')
], userController.changePassword);

// Delete account route
router.delete('/account',
    authMiddleware.authUser,
    body('password').notEmpty().withMessage('Password is required for account deletion'),
    userController.deleteAccount
);

// Logout route
router.post('/logout',
    authMiddleware.authUser,
    userController.logoutUser
);

// Logout from all devices route
router.post('/logout-all',
    authMiddleware.authUser,
    userController.logoutAllDevices
);

module.exports = router;