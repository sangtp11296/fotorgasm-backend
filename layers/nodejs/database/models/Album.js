import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    trackNum:{
        type: Number,
    },
    artists:{
        type: Array,
        required: false
    },
    album:{
        type: String,
    },
    composers:{
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
    date:{
        type: String
    },
    picture:{
        type: String
    },
    thumbnail:{
        type: String
    },
    srcKey:{
        type: String
    },
});
const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    bio:{
        content: {
            type: String,
        },
        summary: {
            type: String,
        }
    },
    avatar:{
        type: String,
        required: false
    },
});
const AlbumSchema = new mongoose.Schema({
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
    artists: [artistSchema],
    composers:{
        type: Array,
        required: false
    },
    genres:{
        type: Array,
        required: true
    },
    desc:{
        type: String,
    },
    distinctions:{
        type: Array
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
    dominantColor: {
        type: String
    },
    songs:[songSchema],
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
const Album = mongoose.model('Album', AlbumSchema);
export { Album }
