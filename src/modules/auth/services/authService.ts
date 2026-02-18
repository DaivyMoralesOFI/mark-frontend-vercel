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
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * AuthResponse
 * Response from the backend after login or registration.
 */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * AuthService
 *
 * Provides methods for authentication operations such as login, registration, and token checks.
 */
class AuthService {
  private readonly endpoints = {
    login: '/auth/login',
    register: '/auth/register',
  };

  /**
   * Logs in with the provided credentials.
   * @param credentials Login credentials
   * @returns AuthResponse with user and tokens
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(this.endpoints.login, credentials);
    return response.data;
  }

  /**
   * Registers a new user.
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

// Alternative API URL for direct login
const API_URL = "https://auth.sofiatechnology.ai/auth";

/**
 * login
 *
 * Logs in using the alternative API endpoint with username and password.
 * @param username The user's username
 * @param password The user's password
 * @returns The response data from the backend
 */
export async function login(username: string, password: string) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const response = await axios.post(
    `${API_URL}/login`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
      }
    }
  );
  return response.data;
}

// Export a singleton instance of AuthService
export const authService = new AuthService();

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  UserCredential
} from "firebase/auth";
import app from "@/core/config/firebase-database";

// const auth = getAuth(app); // Removed unused variable

export const signInWithEmailAndPasswordsupafast = async (email: string, password: string): Promise<UserCredential> => {
  const auth = getAuth(app);
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  const auth = getAuth(app);
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithApple = async (): Promise<UserCredential> => {
  const auth = getAuth(app);
  const provider = new OAuthProvider('apple.com');
  return signInWithPopup(auth, provider);
};