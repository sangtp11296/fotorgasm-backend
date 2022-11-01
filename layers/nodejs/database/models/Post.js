import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    postType:{
        type: String,
        require: true
    },
    title:{
        type: String,
        required: true,
        unique: true
    },
    slug:{
        type: String,
        require: true,
        unique: true
    },
    desc:{
        type: String,
        required: true
    },
    coverPhoto:{
        type: String,
        required: true
    },
    photographer:{
        type: String,
        required: false
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
    }
},{timestamps: true});

export const Post = mongoose.model('Post', PostSchema);
