const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const userController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Custom password validation using custom validator
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

// Registration route
router.post('/register', [
    emailValidation,
    body('fullname.firstname')
        .isLength({ min: 3 }).withMessage('First name must be at least 3 characters long')
        .trim()
        .escape(),
    passwordValidation
], userController.registerUser);

// Login route
router.post('/login', [
    emailValidation,
    body('password').notEmpty().withMessage('Password is required')
], userController.loginUser);

// Profile route
router.get('/profile',
    authMiddleware.authUser,
    userController.getUserProfile
);

// Logout route
router.get('/logout',
    authMiddleware.authUser,
    userController.logoutUser
);

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

// Request password reset route
router.post('/forgot-password', [
    emailValidation
], userController.requestPasswordReset);

// Reset password route
router.post('/reset-password', [
    emailValidation,
    body('code')
        .isLength({ min: 6, max: 6 }).withMessage('Invalid reset code')
        .isNumeric().withMessage('Reset code must contain only numbers'),
    body('newPassword').custom((value) => {
        if (value.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(value)) {
            throw new Error('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(value)) {
            throw new Error('Password must contain at least one number');
        }
        if (!/[@$!%*?&]/.test(value)) {
            throw new Error('Password must contain at least one special character (@$!%*?&)');
        }
        return true;
    })
], userController.resetPassword);

module.exports = router;