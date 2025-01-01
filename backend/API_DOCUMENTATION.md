# API Documentation

## Authentication Endpoints

### Register User

```http
POST /users/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "password": "Password123@"
}
```

**Success Response (201):**

```json
{
  "message": "Registration successful. Please check your email for verification code.",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "isEmailVerified": false
  }
}
```

**Error Response (400) - Validation Error:**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "password123",
      "msg": "Password must contain: 8 characters long, one uppercase letter, one number, one special character (@$!%*?&)",
      "path": "password",
      "location": "body"
    }
  ]
}
```

**Error Response (400) - Existing Email:**

```json
{
  "status": "error",
  "message": "This email is already registered. Please login or use a different email",
  "action": "registration_failed"
}
```

### Verify Email

```http
POST /users/verify-email
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Success Response (200):**

```json
{
  "message": "Email verified successfully",
  "isEmailVerified": true
}
```

**Error Response (400):**

```json
{
  "message": "Invalid or expired verification code"
}
```

### Resend Verification Code

```http
POST /users/resend-verification
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "Verification code resent successfully. Please check your email."
}
```

**Error Response (404):**

```json
{
  "message": "User not found"
}
```

**Error Response (400):**

```json
{
  "message": "Email is already verified"
}
```

### Request Password Reset

```http
POST /users/forgot-password
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "Password reset instructions sent to your email"
}
```

**Error Response (404):**

```json
{
  "message": "User not found"
}
```

### Reset Password

```http
POST /users/reset-password
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewPassword123@"
}
```

**Success Response (200):**

```json
{
  "message": "Password reset successful"
}
```

**Error Response (400) - Invalid Code:**

```json
{
  "message": "Invalid or expired reset code"
}
```

**Error Response (400) - Password Validation:**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "password123",
      "msg": "Password must contain: 8 characters long, one uppercase letter, one number, one special character (@$!%*?&)",
      "path": "newPassword",
      "location": "body"
    }
  ]
}
```

### Login User

```http
POST /users/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123@"
}
```

**Success Response (200):**

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "isEmailVerified": true
  }
}
```

**Error Response (401):**

```json
{
  "message": "Invalid email or password"
}
```

**Error Response (401) - Unverified Email:**

```json
{
  "message": "Please verify your email before logging in",
  "isEmailVerified": false
}
```

### Get User Profile

```http
GET /users/profile
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Success Response (200):**

```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "isEmailVerified": true
  }
}
```

### Logout User

```http
GET /users/logout
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

## Validation Rules

### Password Requirements

- Must be at least 8 characters long
- Must contain at least one uppercase letter (A-Z)
- Must contain at least one lowercase letter (a-z)
- Must contain at least one number (0-9)
- Must contain at least one special character (@$!%\*?&)

### Email Requirements

- Must be a valid email address
- Will be normalized (trimmed and converted to lowercase)

### Name Requirements

- First name must be at least 3 characters long
- Last name (if provided) must be at least 3 characters long
- Names will be trimmed and escaped for security

### Verification/Reset Code Requirements

- Must be exactly 6 digits
- Numeric only (0-9)
- Expires after 10 minutes

## Security Notes

- JWT tokens expire after 24 hours
- Tokens are blacklisted upon logout
- All passwords are hashed using bcrypt with salt round 10
- Email verification is required before login
- Rate limiting is applied to all authentication endpoints
- All responses use appropriate HTTP status codes
- Error messages are user-friendly but do not expose system details
- Input validation is performed on both client and server side
- Session tokens are stored in HTTP-only cookies
- CSRF protection is implemented for all authenticated routes
