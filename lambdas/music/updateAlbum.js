import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import {Album} from '/opt/nodejs/database/models/Album.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'

export const updateAlbum = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try {
        const albumId = event.pathParameters.id;
        const formUpdate = JSON.parse(event.body);
        console.log(formUpdate);
        
        // Convert formUpdate to an update object
        const updateData = {
            $set: {
                artists: formUpdate.artists,
                composers: formUpdate.composers,
                genres: formUpdate.genres,
                format: formUpdate.format,
                title: formUpdate.title,
                slug: formUpdate.slug,
                tags: formUpdate.tags,
                distinctions: formUpdate.distinctions,
                desc: formUpdate.desc,
                year: formUpdate.year,
                dominantColor: formUpdate.dominantColor,
            },
        };
        const result = await Album.updateOne({ _id: albumId }, updateData);

        console.log(result)
        return Responses._200 ({
            message: 'Album updated successfully',
            post: result
        })
    } catch (error) {
        console.error('Error updating album', error);
        return Responses._500 ({
            message: 'Error updating album', 
            error: error.message 
        })
    }
};