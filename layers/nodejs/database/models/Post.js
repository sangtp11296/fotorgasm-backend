import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    commenter: {
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    replies: [{
        replier: {
            type: String,
            required: true
        },
        reply: {
            type: String,
            required: true
        }
    }]
});

const PostSchema = new mongoose.Schema({
    format:{
        type: String,
        required: true
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
    desc:{
        type: String,
        required: true
    },
    coverKey:{
        type: String,
        required: false
    },
    coverThumbnail:{
        type: String,
        required: false
    },
    author:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    tags:{
        type: Array,
        required: false
    },
    content:{
        type: String,
        required: false
    },
    videoSrc:{
        high: {
            type: String,
            required: false
        },
        medium: {
            type: String,
            required: false
        },
        low: {
            type: String,
            required: false
        },
    },
    likes:{
        type: Number,
        default: 0
    },
    comments:[commentSchema],
    views: {
        type: Number,
        default: 0
    },
    status:{
        type: String,
        required: false
    }
},{timestamps: true});

const Post = mongoose.model('Post', PostSchema);
export { Post }
