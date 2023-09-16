import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Post} from '/opt/nodejs/database/models/Post.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'

export const updatePost = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try {
        const postId = event.pathParameters.id;
        const formUpdate = JSON.parse(event.body);
        console.log(formUpdate);
        
        // Convert formUpdate to an update object
        const updateData = {
            $set: {
                author: formUpdate.author,
                category: formUpdate.category,
                content: formUpdate.content,
                desc: formUpdate.desc,
                format: formUpdate.format,
                title: formUpdate.title,
                slug: formUpdate.slug,
                tags: formUpdate.tags,
            },
        };
        const result = await Post.updateOne({ _id: postId }, updateData);

        console.log(result)
        return Responses._200 ({
            message: 'Post updated successfully',
            post: result
        })
    } catch (error) {
        console.error('Error updating post', error);
        return Responses._500 ({
            message: 'Error updating post', 
            error: error.message 
        })
    }
};