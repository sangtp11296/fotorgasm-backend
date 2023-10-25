import { Song } from "@/types/Album.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    playlist: [] as Song[],
    shuffle: false,
    repeat: 'off',
    next: {} as Song,
    current: {} as Song,
    prev: {} as Song,
    isPlay: false
}

const playlistSlice = createSlice({
    name: 'playlist',
    initialState: initialState,
    reducers: {
        updatePlaylist: (state, action: PayloadAction<Song[]>) => {
            state.playlist = action.payload
        },
        toggleShuffle:  (state, action: PayloadAction<boolean>) => {
            state.shuffle = action.payload
        },
        toggleRepeat:  (state, action: PayloadAction<string>) => {
            state.repeat = action.payload
        },
        updateCurrentSong:  (state, action: PayloadAction<Song>) => {
            state.current = action.payload
        },
        updateNextSong:  (state, action: PayloadAction<Song>) => {
            state.next = action.payload
        },
        updatePrevSong:  (state, action: PayloadAction<Song>) => {
            state.prev = action.payload
        },
        togglePlay:  (state, action: PayloadAction<boolean>) => {
            state.isPlay = action.payload
        },
    }
})

export const { updatePlaylist, toggleShuffle, toggleRepeat, updateCurrentSong, updateNextSong, updatePrevSong, togglePlay } = playlistSlice.actions;
const playlistReducer = playlistSlice.reducer;

export default playlistReducer;