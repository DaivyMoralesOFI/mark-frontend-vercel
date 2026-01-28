// store.ts
//
// This file configures and exports the Redux store for the application.
// It applies the root reducer and custom middleware, and exports types for RootState and AppDispatch.

import { configureStore } from "@reduxjs/toolkit";
import { loggerMiddleware } from "./middleware";

// Import root reducer
import rootReducer from "./rootReducer";

/**
 * store
 *
 * Configures the Redux store with the root reducer and custom middleware.
 * Exports the store instance, RootState, and AppDispatch types.
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

// RootState type for use with selectors and throughout the app
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type for use with dispatching actions
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
