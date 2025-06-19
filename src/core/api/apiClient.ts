// src/core/api/apiClient.ts
//
// This file provides the API client configuration and service layer for making HTTP requests to the backend API.
// It uses Axios for HTTP requests, sets up interceptors for authentication and error handling, and exports a reusable ApiService class.

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, NetworkError, AuthenticationError, ErrorCodes } from './apiErrors';

/**
 * Interface for API error responses.
 */
interface ApiErrorResponse {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
}

/**
 * API environment configuration constants.
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  VERSION: 'v1'
};

/**
 * Creates and configures an Axios instance for API requests.
 * Sets up interceptors for authentication and error handling.
 * @returns Configured AxiosInstance
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Request interceptor to add authentication token to headers
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for standardized error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (!error.response) {
        // Network error or timeout
        return Promise.reject(new NetworkError(
          'Could not connect to the server. Please check your internet connection.',
          error as Error
        ));
      }

      const { response } = error;
      const status = response.status;
      const data = response.data || {};

      // Extract error details from response
      const errorCode = data.code || ErrorCodes.UNKNOWN_ERROR;
      const errorMessage = data.message || 'An unknown error occurred';
      const errorDetails = data.details;

      // Handle specific HTTP status codes
      if (status === 401) {
        // Authentication error
        return Promise.reject(new AuthenticationError(
          errorMessage,
          errorCode,
          status
        ));
      }

      // Create a specific API error
      return Promise.reject(new ApiError(
        errorCode,
        errorMessage,
        status,
        errorDetails
      ));
    }
  );

  return instance;
};

// Create the API client instance
export const apiClient = createApiClient();

/**
 * ApiService
 *
 * Provides a wrapper around Axios for common HTTP operations (GET, POST, PUT, PATCH, DELETE).
 * Handles typed responses and allows for custom configuration per request.
 */
export class ApiService {
  constructor(private readonly instance: AxiosInstance = apiClient) {}

  /**
   * Perform a GET request.
   * @param url Endpoint to request
   * @param config Optional Axios config
   * @returns Typed Axios response
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  /**
   * Perform a POST request.
   * @param url Endpoint to request
   * @param data Data to send
   * @param config Optional Axios config
   * @returns Typed Axios response
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  /**
   * Perform a PUT request.
   * @param url Endpoint to request
   * @param data Data to send
   * @param config Optional Axios config
   * @returns Typed Axios response
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  /**
   * Perform a PATCH request.
   * @param url Endpoint to request
   * @param data Data to send
   * @param config Optional Axios config
   * @returns Typed Axios response
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  /**
   * Perform a DELETE request.
   * @param url Endpoint to request
   * @param config Optional Axios config
   * @returns Typed Axios response
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

// Export a global instance of the API service
export const apiService = new ApiService(apiClient);