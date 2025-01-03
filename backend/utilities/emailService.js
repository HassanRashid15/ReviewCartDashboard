const nodemailer = require('nodemailer');

// Admin email constant
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Verify transporter configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Send email helper function
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to,
            subject,
            html
        });
        return true;
    } catch (error) {
        console.error('Send email error:', error);
        throw new Error('Failed to send email');
    }
};

// Registration notification (with admin notification)
const sendRegistrationNotification = async (userEmail, username) => {
    try {
        // Send welcome email to user
        await sendEmail(
            userEmail,
            'Welcome to Our Platform',
            `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Welcome to Our Platform!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #374151; font-size: 16px; line-height: 24px;">
                                Hello ${username},<br><br>
                                Thank you for registering on our platform! We're excited to have you as a member.<br><br>
                                Your account has been created successfully. You can now access all our features and services.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #6b7280; font-size: 14px;">
                                If you didn't create this account, please contact our support team immediately.
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `
        );

        // Send notification to admin
        await sendEmail(
            ADMIN_EMAIL,
            'Admin Notification: New User Registration',
            `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>New User Registration</h2>
                <p>A new user has registered on the platform.</p>
                <p><strong>User Details:</strong></p>
                <ul>
                    <li>Email: ${userEmail}</li>
                    <li>Name: ${username}</li>
                    <li>Registration Time: ${new Date().toLocaleString()}</li>
                </ul>
            </body>
            </html>
            `
        );

        return true;
    } catch (error) {
        console.error('Registration notification error:', error);
        throw new Error('Failed to send registration notifications');
    }
};

// Password update notification
const sendPasswordUpdateNotification = async (userEmail, username) => {
    return sendEmail(
        userEmail,
        'Password Updated Successfully',
        `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Updated</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <p style="color: #374151; font-size: 16px; line-height: 24px;">
                            Hello ${username},<br><br>
                            Your password has been successfully updated.<br><br>
                            If you did not make this change, please contact our support team immediately.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                        <p style="color: #6b7280; font-size: 14px;">
                            For security reasons, you may want to reset your password if you didn't authorize this change.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    );
};

// Verification email function
const sendVerificationEmail = async (email, code) => {
    return sendEmail(
        email,
        'Verify Your Email Address',
        `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Email Verification</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                            Hello,<br><br>
                            Thank you for registering! Please use the verification code below to complete your registration:
                        </p>
                        
                        <div style="background-color: #f3f4f6; border: 2px dashed #6366f1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                            <h2 style="color: #4f46e5; letter-spacing: 8px; margin: 0; font-size: 32px; font-weight: 700;">
                                ${code}
                            </h2>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 24px;">
                            This code will expire in <span style="color: #ef4444; font-weight: 600;">10 minutes</span>.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                        <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0;">
                            If you didn't request this verification code, please ignore this email.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    );
};

// Password reset email function
const sendPasswordResetEmail = async (email, code, token) => {
    try {
        // Create reset link with both token and code
        const resetLink = `http://localhost:3000/reset-password?token=${token}&code=${code}&email=${encodeURIComponent(email)}`;

        return sendEmail(
            email,
            'Password Reset Request',
            `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                                Hello,<br><br>
                                We received a request to reset your password. Please click the button below to reset your password:
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; letter-spacing: 0.5px;">
                                    Reset Password
                                </a>
                            </div>

                            <div style="background-color: #f3f4f6; border: 2px dashed #6366f1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                <p style="color: #4b5563; margin: 0 0 10px 0; font-size: 14px;">
                                    Or use this code on the reset page:
                                </p>
                                <h2 style="color: #4f46e5; letter-spacing: 8px; margin: 0; font-size: 32px; font-weight: 700;">
                                    ${code}
                                </h2>
                            </div>

                            <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 24px;">
                                If the button doesn't work, you can copy and paste this link into your browser:<br>
                                <a href="${resetLink}" style="color: #4f46e5; word-break: break-all;">${resetLink}</a>
                            </p>

                            <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 24px;">
                                This link and code will expire in <span style="color: #ef4444; font-weight: 600;">10 minutes</span>.<br>
                                If you did not request this password reset, please ignore this email or contact support if you have concerns.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding:30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0;">
                                For security reasons, never share this link or code with anyone.
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `
        );
    } catch (error) {
        console.error('Send password reset email error:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendRegistrationNotification,
    sendPasswordUpdateNotification
};