import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Post} from '/opt/nodejs/database/models/Post.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'

export const getPosts = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try {
        const page = parseInt(event.queryStringParameters.page) || 1;
        const limit = parseInt(event.queryStringParameters.limit) || 5;
        
        const skip = (page - 1) * limit;

        // Count total posts before applying skip and limit
        const totalPosts = await Post.find().count(); 

        const posts = await Post.find().skip(skip).limit(limit).toArray();

        return Responses._200 ({
            message: 'Posts gotten successfully',
            post: posts,
            totalPosts: totalPosts
        })
    } catch (error) {
        console.error('Error getting posts', error);
        return Responses._500 ({
            message: 'Error getting posts', 
            error: error.message 
        })
    }
};