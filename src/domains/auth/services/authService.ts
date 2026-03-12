// src/services/authService.ts
//
// This file defines the AuthService class and related functions, which provide authentication operations such as login, registration, and token management.
// It uses Axios and a custom apiService for HTTP requests and is used by the Redux slice and hooks to interact with the authentication backend.

import { apiService } from '@/core/api/apiClient';
import axios from "axios";

/**
 * User
 * Represents a user in the authentication system.
 */
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  subscription_type: string;
  subscription_status: string;
  can_access_mark: boolean;
  can_access_hr: boolean;
}

/**
 * LoginCredentials
 * Credentials for logging in.
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * RegisterData
 * Data for registering a new user.
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * AuthTokens
 * Authentication tokens returned by the backend.
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * AuthResponse
 * Response from the backend after login or registration.
 */
export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
  };
}
/**
 * AuthService
 *
 * Provides methods for authentication operations such as login, registration, and token checks.
 */
class AuthService {
  private readonly endpoints = {
    login: '/sia-api/api/auth/login/',
    register: '/auth/register',
  };

  /**
   * Logs in with the provided credentials.
   * @param credentials Login credentials
   * @returns AuthResponse with user and tokens
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // We use axios directly instead of apiService to ensure the relative URL
    // hit the current origin (Vite dev server) so the proxy can catch it.
    // Otherwise, apiService would use the local backend base URL.
    const response = await axios.post<AuthResponse>(this.endpoints.login, credentials);
    return response.data;
  }

  /**
   * Registers a new user.
...
   * @param userData Registration data
   * @returns AuthResponse with user and tokens
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(this.endpoints.register, userData);
    return response.data;
  }

  /**
   * Checks if an authentication token is stored.
   * @returns true if a token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

// Export a singleton instance of AuthService
export const authService = new AuthService();