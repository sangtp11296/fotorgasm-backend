import { DraftPost } from "@/types/Posts.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    mainMenu: 'all'
}

const clickSlice = createSlice({
    name: 'click',
    initialState: initialState,
    reducers: {
        updateMainMenu: (state, action: PayloadAction<string>) => {
            state.mainMenu = action.payload
        },
    }
})

export const { updateMainMenu } = clickSlice.actions;
const clickReducer = clickSlice.reducer;

export default clickReducer;