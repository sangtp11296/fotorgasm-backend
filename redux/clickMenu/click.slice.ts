import { DraftPost } from "@/types/Posts.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    mainMenu: 'all',
    editorMode: false
}

const clickSlice = createSlice({
    name: 'click',
    initialState: initialState,
    reducers: {
        updateMainMenu: (state, action: PayloadAction<string>) => {
            state.mainMenu = action.payload
        },
        toggleEditor: (state, action: PayloadAction<boolean>) => {
            state.editorMode = action.payload
        }
    }
})

export const { updateMainMenu, toggleEditor } = clickSlice.actions;
const clickReducer = clickSlice.reducer;

export default clickReducer;