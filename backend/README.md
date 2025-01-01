# Authentication API

A complete authentication system with email verification and password reset functionality.

## Features

- User registration with email verification
- JWT-based authentication
- Password reset functionality
- Email notifications
- Token blacklisting for logout
- Input validation
- Error handling
- Security best practices

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000                                    # Application port number

# Database Configuration
DB_CONNECT=mongodb://localhost:27017/reviewcart   # Your MongoDB connection string

# Security Configuration
JWT_SECRET=your-super-secret-key             # JWT secret key for token generation

# Email Configuration
EMAIL_USERNAME=your-email@gmail.com          # Gmail address for sending emails
EMAIL_APP_PASSWORD=your-app-password         # Gmail app-specific password
ADMIN_EMAIL=admin-email@gmail.com            # Admin notification email

```

4. Start the server:

```bash
npm start
```

## Dependencies

- express
- mongoose
- jsonwebtoken
- bcrypt
- nodemailer
- express-validator
- cookie-parser
- cors
- dotenv

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Email verification
- Token blacklisting
- Input validation and sanitization
- HTTP-only cookies
- CORS configuration
- Rate limiting
- Error handling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
