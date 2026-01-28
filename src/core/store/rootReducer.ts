// rootReducer.ts
//
// This file defines the root reducer for the Redux store by combining all feature reducers.
// It exports the combined reducer and the RootState type for use throughout the application.

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../modules/auth/store/authSlice";
import postReducer from "../../modules/content-post/store/postSlice";
import chatReducer from "../../modules/chat-coach-modal/store/chatModalSlice";
import chatCoachReducer from "../../modules/chat-coach/store/chatSlice";
import createPostReducer from "../../modules/create-post/store/createPostSlice";
import brandDnaReducer from "../../modules/brand-dna/store/brandDnaSlice";

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
  brandDna: brandDnaReducer,
  brands: brandReducer,
});

// RootState type for use with selectors and throughout the app
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
