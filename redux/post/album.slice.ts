import { DraftAlbum } from "@/types/Album.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DraftAlbum = {
    submit: false,
    _id: '',
    format: '',
    title: '',
    slug: '',
    composers: [],
    songs: [],
    genres: [],
    artists: [],
    tags: [],
    distinctions: [],
    desc: '',
    year: 0,
    coverThumbnail: '',
    coverUrl: '',
    coverKey: '',
    coverRes: {
        width: 0,
        height: 0
    },
    dominantColor: '',    
    views: '',     // Add views
    likes: 0,     // Add likes
    status: 'draft'
}

const AlbumSlice = createSlice({
    name: 'draft',
    initialState: initialState,
    reducers: {
        albumTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        albumFormat: (state, action: PayloadAction<string>) => {
            state.format = action.payload
        },
        albumSlug: (state, action: PayloadAction<string>) => {
            state.slug = action.payload
        },
        albumComposers: (state, action: PayloadAction<string[]>) => {
            state.composers = action.payload
        },
        albumArtists: (state, action: PayloadAction<string[]>) => {
            state.artists = action.payload
        },
        albumSongs: (state, action: PayloadAction<string[]>) => {
            state.songs = action.payload
        },
        albumGenres: (state, action: PayloadAction<string[]>) => {
            state.genres = action.payload
        },
        albumTags: (state, action: PayloadAction<string[]>) => {
            state.tags = action.payload
        },
        albumDistinctions: (state, action: PayloadAction<string[]>) => {
            state.distinctions = action.payload
        },
        albumDesc: (state, action: PayloadAction<string>) => {
            state.desc = action.payload
        },
        albumYear: (state, action: PayloadAction<number>) => {
            state.year = action.payload
        },
        albumCoverThumbnail: (state, action: PayloadAction<string>) => {
            state.coverThumbnail = action.payload
        },
        albumCoverUrl: (state, action: PayloadAction<string>) => {
            state.coverUrl = action.payload
        },
        albumCoverKey: (state, action: PayloadAction<string>) => {
            state.coverKey = action.payload
        },
        albumCoverRes: (state, action: PayloadAction<{width: number, height: number}>) => {
            state.coverRes = action.payload
        },
        albumDominantColor: (state, action: PayloadAction<string>) => {
            state.dominantColor = action.payload
        },
        albumStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload
        },
        albumId: (state, action: PayloadAction<string>) => {
            state._id = action.payload
        },
        clearAlbum: () => initialState,
        submitAlbum: (state, action: PayloadAction<boolean>) => {
            state.submit = action.payload
        }
    }
})

export const { albumId, albumTitle, albumFormat, albumSlug, albumArtists, albumComposers, albumGenres, albumTags, albumDistinctions, albumDesc, albumYear,albumCoverThumbnail, albumCoverUrl, albumCoverKey, albumCoverRes, albumDominantColor, albumSongs, albumStatus, clearAlbum, submitAlbum } = AlbumSlice.actions;
const albumReducer = AlbumSlice.reducer;

export default albumReducer;