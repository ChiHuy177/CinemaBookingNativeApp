// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
}

// Auth DTOs
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  authenticated: boolean;
  email: string;
}

export interface RegisterRequestDTO {
  name: string;
  phoneNumber: string;
  email: string;
  doB: string;
  city: string;
  address: string;
  genre: boolean;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordCodeRequestDTO {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// User context
export interface User {
  email: string;
  token: string;
  authenticated: boolean;
}
