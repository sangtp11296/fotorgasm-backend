import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {User} from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import bcrypt from 'bcryptjs'

export const registerUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase();
  
    try{
        const {email, username, password, avatar, role} = JSON.parse(event.body);
        
        // Check if the user already exists
        const existingUser = await User.findOne({ username });

        if (existingUser){
            return Responses._400({message: 'Username already exists' });
        }
        // Check if the email already exists
        const existingEmail = await User.findOne({ email });

        if (existingEmail){
            return Responses._400({message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in MongoDB
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            avatar,
            role
        });

        return Responses._200({ message: 'User registered successfully'});

        } catch (error){
            console.error('Registration error:', error);
            return Responses._500({ message: 'Internal server error'});
        }
};