export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export type PasswordStrength = "weak" | "medium" | "strong" | string;

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

export interface FullName {
  firstname: string;
  lastname: string;
}

export interface RegisterPayload {
  email: string;
  fullname: FullName;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

export interface ForgotPasswordProps {
  redirectUrl?: string;
  apiEndpoint?: string;
}

// types/types.ts
export interface User {
  _id: string;
  email: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
  isEmailVerified: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
