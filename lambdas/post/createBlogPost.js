import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Post} from '/opt/nodejs/database/models/Post.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });

export const createPost = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try {
        const data = JSON.parse(event.body);

        // Create a new Post document
        const newPost = new Post({
            author: data.author,
            category: data.category,
            content: data.content,
            cover: data.cover,
            coverRes: {
                width: data.coverRes.width,
                height: data.coverRes.height
            },
            coverUrl: data.coverUrl,
            description: data.description,
            format: data.format,
            id: data.id,
            slug: data.slug,
            tags: data.tags,
            title: data.title
        });

        // Save the new post to the database
        const savedPost = await newPost.save();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'New post created successfully', post: savedPost })
        };
    } catch (error) {
        console.error('Error creating post', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating post', error: error.message })
        };
    }
};