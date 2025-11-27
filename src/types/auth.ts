export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  authenticated: boolean;
  email: string;
}

export interface RegisterRequest {
  name: string;
  phoneNumber: string;
  email: string;
  dob: Date;
  city: string;
  address: string;
  genre: boolean;
  password: string;
  confirmPassword: string;
}

export interface AuthProps {
  email: string;
  token: string;
}

export interface AuthContextProps {
  auth: AuthProps | null;
  saveAuth: () => Promise<void>;
  removeAuth: () => Promise<void>;
}

export interface ResetPasswordProps {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordRequestProps {
  email: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}
