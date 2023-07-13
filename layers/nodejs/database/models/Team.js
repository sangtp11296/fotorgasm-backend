import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    avatar: {
        data: Buffer,
        contentType: String
    }
});

const Team = mongoose.model('Team', teamSchema);

export { Team };