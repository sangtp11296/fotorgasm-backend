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
        required: true
    },
    coverThumbnail:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    categories:{
        type: Array,
        required: true
    },
    tag:{
        type: String,
        required: false
    },
    content:{
        type: String,
        required: true
    },
    likes:{
        type: Number,
        default: 0
    },
    comments:[commentSchema],
    views: {
        type: Number,
        default: 0
    }
},{timestamps: true});

const Post = mongoose.model('Post', PostSchema);
export { Post }
