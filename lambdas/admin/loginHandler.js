import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {User} from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import bcrypt from 'bcryptjs'


export const loginUser = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    connectToDatabase();
    try{
        const { username, password } = JSON.parse(event.body);

        // Check if the user already exists
        const user = await User.findOne({ username });
        console.log(user);
        // If the user is not found, return an error response
        if (!user){
            return Responses._404({ message: 'User not found!'})
        }
        // Compare the provided password with the hased password in the  database
        const passwordMatch =  await bcrypt.compare(password, user.password)
        if (!passwordMatch){
            return Responses._401({ message: 'Incorrect password!'})
        }

        return Responses._200({ message: 'Login successful!', userData: {
            id: user._id, 
            username: user.username, 
            email: user.email, 
            avatar: user.avatar,
            team: user.team,
            role: user.role,
        }});

        } catch (error){
            console.error('Registration error:', error);
            return Responses._500({ message: 'Error during login!'});
        }
};