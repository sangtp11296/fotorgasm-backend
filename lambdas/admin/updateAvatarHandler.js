import { User } from '/opt/nodejs/database/models/User.js';
import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });

import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import sharp from 'sharp';
import util from 'util';

const s3 = new S3Client({ region: process.env.region});

export async function updateAvatarHandler(event, context, callback) {

    // Read options from the event parameter and get the source bucket
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const destBucket = process.env.fotorgasmPublicDataBucket;
    const destKey = srcKey;

    // Infer the image type from the file suffix
    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }
    // Check that the image type is supported
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "jpeg" && imageType != "png") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }
    // Get the image from the source bucket. GetObjectCommand returns a stream.
    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey
        };
        var response = await s3.send(new GetObjectCommand(params));
        var stream = response.Body;
    // Convert stream to buffer to pass to public bucket.
        if (stream instanceof Readable) {
            var contentBuffer = Buffer.concat(await stream.toArray());
        } else {
            throw new Error('Unknown object stream type');
        }
    } catch (error) {
        console.log('Cannot convert stream to buffer', error);
        return;
    }

    // Set avatar width. Resize will set the height automatically to maintain aspect ratio.
    const width  = 200;

    // Use the sharp module to resize the image and save in a buffer.
    try {    
        var outputBuffer = await sharp(contentBuffer).resize(width).toBuffer();
    } catch (error) {
        console.log('Cannot resize the image and save in a buffer', error);
        return;
    }
    
    // Upload the avatar image to the public bucket
    try {
        const destParams = {
            Bucket: destBucket,
            Key: destKey,
            Body: outputBuffer,
            ContentType: `image/${imageType}`,
            ACL: 'public-read'
        };
        const putResult = await s3.send(new PutObjectCommand(destParams));
        console.log('Successfully resized ' + srcBucket + '/' + srcKey + ' and uploaded to ' + destBucket + '/' + destKey);
    } catch (error) {
        console.log("Cannot upload the avatar to the public bucket", error);
        return Responses._400({ message: error.message || 'Failed to upload avatar!' });
    }

    // Update the avatar url to User model schema
    try{
        await connectToDatabase();
        // Extract the user Id from source key
        const startIndex = srcKey.lastIndexOf('/') + 1;
        const endIndex = srcKey.indexOf('-');
        const url = `https://${process.env.fotorgasmPublicDataBucket}.s3.${process.env.region}.amazonaws.com/${destKey}`;
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const userID = srcKey.substring(startIndex, endIndex);
            const updatedUser = await User.findByIdAndUpdate(
                userID,
                { $set: { avatar: url } },
                { new: true }
            );
            if (updatedUser) {
                console.log('Avatar URL updated successfully:', updatedUser);
            } else {
                console.log('User not found.');
            }
        } else {
            console.log('UserID not found.');
        }

    } catch (error) {
        console.log('Cannot update avatar url!', error)
    }
}