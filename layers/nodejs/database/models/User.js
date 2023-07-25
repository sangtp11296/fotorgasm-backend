import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    team:[
        {
            name: {
                type: String,
                unique: true
            },
            role: [
                {
                    type: String
                }
            ],
            avatar: {
                type: String
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

export { User };