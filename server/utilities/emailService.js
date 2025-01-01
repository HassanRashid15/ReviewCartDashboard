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

// Send email to both user and admin
const sendNotificationEmails = async (userEmail, subject, userHtml, adminHtml) => {
    try {
        // Send to user
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: userEmail,
            subject: subject,
            html: userHtml
        });

        // Send to admin
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: ADMIN_EMAIL,
            subject: `Admin Notification: ${subject}`,
            html: adminHtml
        });

        return true;
    } catch (error) {
        console.error('Send notification emails error:', error);
        throw new Error('Failed to send notification emails');
    }
};

// Registration notification
const sendRegistrationNotification = async (userEmail, username) => {
    const subject = 'Welcome to Our Platform';

    const userHtml = `
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
    `;

    const adminHtml = `
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
    `;

    return sendNotificationEmails(userEmail, subject, userHtml, adminHtml);
};

// Password update notification
const sendPasswordUpdateNotification = async (userEmail, username) => {
    const subject = 'Password Updated Successfully';

    const userHtml = `
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
    `;

    const adminHtml = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Password Update Alert</h2>
            <p>A user has updated their password.</p>
            <p><strong>User Details:</strong></p>
            <ul>
                <li>Email: ${userEmail}</li>
                <li>Name: ${username}</li>
                <li>Update Time: ${new Date().toLocaleString()}</li>
            </ul>
        </body>
        </html>
    `;

    return sendNotificationEmails(userEmail, subject, userHtml, adminHtml);
};

// Verification email function
const sendVerificationEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Email Verification</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                                    Hello,<br><br>
                                    Thank you for registering! Please use the verification code below to complete your registration:
                                </p>
                                
                                <!-- Verification Code Box -->
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
                        
                        <!-- Footer -->
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
        };

        // Send to user
        await transporter.sendMail(mailOptions);

        // Send notification to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: ADMIN_EMAIL,
            subject: 'Admin Notification: New Email Verification Request',
            html: `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>New Email Verification Request</h2>
                    <p>A user has requested email verification.</p>
                    <p><strong>User Details:</strong></p>
                    <ul>
                        <li>Email: ${email}</li>
                        <li>Request Time: ${new Date().toLocaleString()}</li>
                    </ul>
                </body>
                </html>
            `
        };

        await transporter.sendMail(adminMailOptions);
        return true;
    } catch (error) {
        console.error('Send verification email error:', error);
        throw new Error('Failed to send verification email');
    }
};

// Password reset email function
const sendPasswordResetEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 8px 8px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                                    Hello,<br><br>
                                    We received a request to reset your password. Please use the code below to reset your password:
                                </p>
                                
                                <!-- Reset Code Box -->
                                <div style="background-color: #f3f4f6; border: 2px dashed #6366f1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                    <h2 style="color: #4f46e5; letter-spacing: 8px; margin: 0; font-size: 32px; font-weight: 700;">
                                        ${code}
                                    </h2>
                                </div>
                                
                                <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 24px;">
                                    This code will expire in <span style="color: #ef4444; font-weight: 600;">10 minutes</span>.<br>
                                    If you did not request this password reset, please ignore this email or contact support if you have concerns.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding:30px; text-align: center; border-radius: 0 0 8px 8px;">
                                <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0;">
                                    For security reasons, never share this code with anyone.
                                </p>
                                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                        This is an automated message, please do not reply.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        // Send to user
        await transporter.sendMail(mailOptions);

        // Send notification to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: ADMIN_EMAIL,
            subject: 'Admin Notification: Password Reset Request',
            html: `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Password Reset Request</h2>
                    <p>A user has requested a password reset.</p>
                    <p><strong>User Details:</strong></p>
                    <ul>
                        <li>Email: ${email}</li>
                        <li>Request Time: ${new Date().toLocaleString()}</li>
                    </ul>
                </body>
                </html>
            `
        };

        await transporter.sendMail(adminMailOptions);
        return true;
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