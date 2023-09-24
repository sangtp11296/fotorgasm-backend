
import { FetchedPost } from "@/types/Posts.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PostsState {
    slugs: string[];
  }
const initialState: PostsState = {
    slugs: [],
}

const fetchedPost = createSlice({
    name: 'fetchedPosts',
    initialState: initialState,
    reducers: {
        updateFetchedPost: (state, action: PayloadAction<[]>) => {
             // Extract and store post slugs from the fetched posts
            const newSlugs = action.payload.map((post: FetchedPost) => post.slug);
            state.slugs = [...state.slugs, ...newSlugs]
        }
    }
})

export const { updateFetchedPost } = fetchedPost.actions;
const fetchedPostReducer = fetchedPost.reducer;

export default fetchedPostReducer;