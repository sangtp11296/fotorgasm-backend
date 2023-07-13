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

const VideoSchema = new mongoose.Schema({
    format:{
        type: String,
        require: true
    },
    orientation:{
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
    caption:{
        type: String,
        required: true
    },
    cover:{
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
        required: false
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

const Video = mongoose.model('Video', VideoSchema);
export { Video };
