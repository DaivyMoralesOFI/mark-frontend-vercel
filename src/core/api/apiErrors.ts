// src/core/api/apiErrors.ts
//
// This file defines custom error classes and error codes for handling API, network, and authentication errors in a standardized way.
// These classes are used throughout the API client and service layer to provide consistent error handling and messaging.

/**
 * ApiError
 *
 * Represents a business logic error returned by the API.
 * Includes an error code, HTTP status, and optional details.
 */
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 400,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * NetworkError
 *
 * Represents a network connectivity error (e.g., no internet, timeout).
 * Optionally includes the original error object.
 */
export class NetworkError extends Error {
  constructor(
    message: string = 'Connection error. Please check your internet connection and try again.',
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * AuthenticationError
 *
 * Represents an authentication or authorization error (e.g., invalid token, session expired).
 * Extends ApiError for compatibility with API error handling.
 */
export class AuthenticationError extends ApiError {
  constructor(
    message: string = 'Your session has expired or you do not have permission to access this resource.',
    code: string = 'AUTH_REQUIRED',
    status: number = 401
  ) {
    super(code, message, status);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * ErrorCodes
 *
 * Common error codes for standardizing API error handling across the application.
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;