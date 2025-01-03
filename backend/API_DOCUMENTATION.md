# API Documentation

## Authentication Endpoints

### Register User

```http
POST /api/users/register
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

### Verify Email

```http
POST /api/users/verify-email
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

### Request Password Reset

```http
POST /api/users/forgot-password
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
  "message": "If your email is registered, you will receive reset instructions."
}
```

### Verify Reset Token

```http
POST /api/users/verify-reset-token
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "token": "reset_token_here",
  "code": "123456"
}
```

**Success Response (200):**

```json
{
  "message": "Reset credentials verified successfully"
}
```

### Reset Password

```http
POST /api/users/reset-password
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "token": "reset_token_here",
  "code": "123456",
  "newPassword": "NewPassword123@",
  "confirmPassword": "NewPassword123@"
}
```

**Success Response (200):**

```json
{
  "message": "Password reset successful. Please login with your new password."
}
```

### Login User

```http
POST /api/users/login
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

### Protected Routes (Require Authentication)

All protected routes require the JWT token in the Authorization header:

```http
Authorization: Bearer jwt_token_here
```

### Get User Profile

```http
GET /api/users/profile
```

### Update Profile

```http
PUT /api/users/profile/update
```

**Request Body:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

### Change Password

```http
POST /api/users/change-password
```

**Request Body:**

```json
{
  "currentPassword": "CurrentPassword123@",
  "newPassword": "NewPassword123@",
  "confirmPassword": "NewPassword123@"
}
```

### Delete Account

```http
DELETE /api/users/account
```

**Request Body:**

```json
{
  "password": "CurrentPassword123@"
}
```

### Logout

```http
POST /api/users/logout
```

### Logout All Devices

```http
POST /api/users/logout-all
```

## Security Features

### Rate Limiting

- Password reset: 3 attempts per 30 minutes
- Reset verification: 5 attempts per 5 minutes
- Login: 5 attempts per 15 minutes

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%\*?&)
- Cannot reuse last 5 passwords
- Must be different from current password

### Security Measures

- Double authentication for password reset (token + code)
- Secure random token generation using crypto
- Token hashing before storage
- Password history tracking
- Session invalidation on password change
- HTTP-only cookies for tokens
- CSRF protection
- Generic error messages for security
- Input sanitization and validation
- Rate limiting on sensitive endpoints
- Automatic session expiry (24 hours)
- Multi-device logout support

### Verification Codes

- 6-digit numeric code
- 10-minute expiration
- Rate-limited verification attempts
- Unique code per request

### Error Handling

All endpoints return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Server Error

## Development Notes

### Environment Variables Required

```env
JWT_SECRET=your_jwt_secret
EMAIL_USERNAME=your_email
EMAIL_APP_PASSWORD=your_app_password
```

### Cookie Settings

```javascript
{
  httpOnly: true,
  secure: true, // Production only
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}
```

### Security Headers

```javascript
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}
```
