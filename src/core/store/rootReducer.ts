// rootReducer.ts
//
// This file defines the root reducer for the Redux store by combining all feature reducers.
// It exports the combined reducer and the RootState type for use throughout the application.

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/domains/auth/store/authSlice";
import postReducer from "@/domains/dashboard/calendar/content-post/store/postSlice";
import chatReducer from "@/domains/creation-studio/chat-coach/chat-coach-modal/store/chatModalSlice";
import chatCoachReducer from "@/domains/creation-studio/chat-coach/store/chatSlice";
import createPostReducer from "@/domains/creation-studio/post-creator/store/createPostSlice";

import brandReducer from "./brandSlice";

/**
 * rootReducer
 *
 * Combines all feature reducers into a single root reducer for the Redux store.
 *
 * @returns Combined reducer
 */
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  chatModal: chatReducer,
  chat: chatCoachReducer,
  createPost: createPostReducer,
  brands: brandReducer,
});

// RootState type for use with selectors and throughout the app
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
