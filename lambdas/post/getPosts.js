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
        console.log(page);
        const perPage = parseInt(event.queryStringParameters.perPage) || 5;
        console.log(perPage);
        const skip = (page - 1) * perPage;

        // Count total posts before applying skip and limit
        const totalPosts = await Post.countDocuments(); 

        const posts = await Post.find()
            .sort({ title: 1 }) //Sort by title in ascending order (1) or descending order (-1)
            .skip(skip)
            .limit(perPage);

        return Responses._200 ({
            message: 'Posts gotten successfully',
            posts: posts,
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