import { configureStore } from "@reduxjs/toolkit";
import draftReducer from "./post/draft.slice";
import clickReducer from "./clickMenu/click.slice";
import fetchedPostReducer from "./post/fetchPosts.slice";

export const store = configureStore({
  reducer: {
    draft: draftReducer,
    click: clickReducer,
    fetchedPost: fetchedPostReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
