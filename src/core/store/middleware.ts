// middleware.ts
//
// This file defines custom Redux middleware for logging actions and state changes.
// The loggerMiddleware logs every dispatched action and the resulting state, useful for debugging.

// src/store/middleware.ts
import { Middleware } from '@reduxjs/toolkit';

/**
 * loggerMiddleware
 *
 * Redux middleware that logs every dispatched action and the next state.
 * Useful for debugging Redux state changes.
 */
export const loggerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  console.log('Dispatching:', action); // Log the action being dispatched
  const result = next(action);
  console.log('Next state:', storeAPI.getState()); // Log the next state after the action
  return result;
};
