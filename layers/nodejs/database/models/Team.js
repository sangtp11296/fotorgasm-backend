import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    role: {
        type: Array
    }
});

const Team = mongoose.model('Team', teamSchema);

export { Team };