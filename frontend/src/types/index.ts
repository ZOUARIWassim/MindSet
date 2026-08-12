export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  goals?: string;
}
