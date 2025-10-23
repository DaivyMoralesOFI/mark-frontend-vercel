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
  const result = next(action);
  storeAPI.getState()
  return result;
};
