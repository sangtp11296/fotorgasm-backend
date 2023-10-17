import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Album} from '/opt/nodejs/database/models/Album.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'

export const createAlbum = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try {
        const data = JSON.parse(event.body);
        // Create a new Post document
        const newAlbum = new Album({
            artists: data.artists,
            composers: data.composers,
            genres: data.genres,
            coverRes: {
                width: data.coverRes.width,
                height: data.coverRes.height
            },
            format: data.format,
            title: data.title,
            slug: data.slug,
            tags: data.tags,
            year: data.year,
            status: 'published'
        });
        console.log(newAlbum)
        // Save the new post to the database
        const savedAlbum = await newAlbum.save();

        return Responses._200 ({
            message: 'New album created successfully',
            post: savedAlbum
        })
    } catch (error) {
        console.error('Error creating album', error);
        return Responses._500 ({
            message: 'Error creating album', 
            error: error.message 
        })
    }
};