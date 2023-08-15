import { Post } from '/opt/nodejs/database/models/Post.js';
import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });

import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import sharp from 'sharp';
import util from 'util';

const s3 = new S3Client({ region: process.env.region});

export async function createThumbnail (event, context, callback) {

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

    // Set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
    const width  = 200;

    // Use the sharp module to resize the image and save in a buffer.
    try {    
        var outputBuffer = await sharp(contentBuffer).resize(width).toBuffer();
    } catch (error) {
        console.log('Cannot resize the image and save in a buffer', error);
        return;
    }
    
    // Upload the thumbnail image to the public bucket
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

    // Update the thumbnail url to Post model schema
    try{
        await connectToDatabase();
        // Extract the post slug from source key
        const match = srcKey.match(/\/([^/]+)-cover\.\w+$/);
        const url = `https://${process.env.fotorgasmPublicDataBucket}.s3.${process.env.region}.amazonaws.com/${destKey}`;
        if (match) {
            const postSlug = match[1];
            console.log(postSlug)
            const updatedPost = await Post.findOneAndUpdate(
                { slug: postSlug },
                { $set: { 
                    coverKey: srcKey,
                    coverThumbnail: url
                 } },
                { new: true }
            );
            if (updatedPost) {
                console.log('Avatar URL updated successfully:', updatedPost);
            } else {
                console.log('Post not found.');
            }
        } else {
            console.log('Post slug invalid!');
        }
    } catch (error) {
        console.log('Cannot update post cover thumbnail and key!', error)
    }
}