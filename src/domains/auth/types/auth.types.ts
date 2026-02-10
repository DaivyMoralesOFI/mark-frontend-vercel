// auth.types.ts
//
// This file defines TypeScript types and interfaces for the authentication module.
// It includes the shape of the user and authentication state.

/**
 * User
 * Represents a user in the authentication system.
 */
export interface User {
  id: string;         // Unique identifier for the user
  email: string;      // User's email address
  name: string;       // User's display name
}

/**
 * AuthState
 * Redux state shape for authentication.
 */
export interface AuthState {
  user: User | null;      // The current user, or null if not authenticated
  token: string | null;   // Authentication token
  isLoading: boolean;     // Loading state for authentication actions
  error: string | null;   // Error message if authentication fails
}