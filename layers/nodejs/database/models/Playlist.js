import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    format:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true,
        unique: true
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    artists:{
        type: Array,
        required: true
    },
    composer:{
        type: Array,
        required: false
    },
    genres:{
        type: Array,
        required: true
    },
    year:{
        type: Number,
        default: null
    },
    tags:{
        type: Array,
        required: false
    },
    coverKey:{
        type: String,
        required: false
    },
    coverThumbnail:{
        type: String,
        required: false
    },
    coverRes: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    },
    songs:{
        type: Array,
        required: true
    },
    likes:{
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    status:{
        type: String,
        required: false
    }
},{timestamps: true});

const Playlist = mongoose.model('Playlist', PlaylistSchema);
export { Playlist }
