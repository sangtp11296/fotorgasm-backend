import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import { Album } from '/opt/nodejs/database/models/Album.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js'


export const getAlbums = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try {
        const page = parseInt(event.queryStringParameters.page) || 1;
        console.log(page);
        const perPage = parseInt(event.queryStringParameters.perPage) || 5;
        console.log(perPage);
        const skip = (page - 1) * perPage;

        // Count total albums before applying skip and limit
        const totalAlbums = await Album.countDocuments(); 

        const albums = await Album.find()
            .sort({ createdAt: -1 }) //Sort by title in ascending order (1) or descending order (-1)
            .skip(skip)
            .limit(perPage);

        return Responses._200 ({
            message: 'albums gotten successfully',
            albums: albums,
            totalAlbums: totalAlbums
        })
    } catch (error) {
        console.error('Error getting albums', error);
        return Responses._500 ({
            message: 'Error getting albums', 
            error: error.message 
        })
    }
};
export const getAlbum = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    try{
        const slug = event.pathParameters.slug;
        console.log(slug);

        const album = await Album.findOne({ slug });
        if (album) {
            // Sort the songs by trackNum
            album.songs.sort((a, b) => a.trackNum - b.trackNum);
            return Responses._200({
                message: 'Album is gotten successfully',
                album: album
            })
        } else {
            return Responses._404({
                message: 'Album not found',
            })
        }
    } catch (err) {
        return Responses._500 ({
            message: 'Error getting Album', 
            error: err.message 
        })
    }
}