import { DraftPost } from "@/types/Posts.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DraftPost = {
    toggle: false,
    id: '',
    format: '',
    title: '',
    slug: '',
    author: '',
    category: '',
    description: '',
    tags: [],
    cover: null,
    coverUrl: '',
    content: '',
    coverRes: {
        width: 0,
        height: 0
    }
}

const draftSlice = createSlice({
    name: 'draft',
    initialState: initialState,
    reducers: {
        updateTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        updateFormat: (state, action: PayloadAction<string>) => {
            state.format = action.payload
        },
        updateSlug: (state, action: PayloadAction<string>) => {
            state.slug = action.payload
        },
        updateAuthor: (state, action: PayloadAction<string>) => {
            state.author = action.payload
        },
        updateCat: (state, action: PayloadAction<string>) => {
            state.category = action.payload
        },
        updateDesc: (state, action: PayloadAction<string>) => {
            state.description = action.payload
        },
        updateTag: (state, action: PayloadAction<string[]>) => {
            state.tags = action.payload
        },
        updateCover: (state, action: PayloadAction<string | null>) => {
            state.cover = action.payload
        },
        updateCoverUrl: (state, action: PayloadAction<string>) => {
            state.coverUrl = action.payload
        },
        updateCoverRes: (state, action: PayloadAction<{width: number, height: number}>) => {
            state.coverRes = action.payload
        },
        updateContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload
        },
        clearDraft: () => initialState,
        openDraft: (state) => {
            state.toggle = true
        }
    }
})

export const { updateTitle, updateFormat, updateSlug, updateAuthor, updateCat, updateDesc, updateTag, updateCover, updateCoverUrl, updateCoverRes, updateContent, clearDraft, openDraft } = draftSlice.actions;
const draftReducer = draftSlice.reducer;

export default draftReducer;