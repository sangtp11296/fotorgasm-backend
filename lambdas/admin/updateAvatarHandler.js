import { User } from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';
import { v4 as uuid } from 'uuid';
import { S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import * as fileType from 'file-type';
import sharp from 'sharp';
import util from 'util';

const s3 = new S3Client({ region: process.env.region});

const allowedMimes = ['image/jpeg','image/png','image/jpg'];

export async function updateAvatarHandler(event, context, callback) {

    // Read options from the event parameter and get the source bucket
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters
    const srcKey = 'avatar/' + decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const destBucket = process.env.fotorgasmPublicDataBucket;
    const destKey = `avatar/${srcKey}`;

    // Infer the image type from the file suffix
    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }
    // Check that the image type is supported
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "jepg" && imageType != "png") {
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
        console.log(error);
        return;
    }

    // Set avatar width. Resize will set the height automatically to maintain aspect ratio.
    const width  = 200;

    // Use the sharp module to resize the image and save in a buffer.
    try {    
        var outputBuffer = await sharp(contentBuffer).resize(width).toBuffer();
    } catch (error) {
        console.log(error);
        return;
    }
    
    // Upload the avatar image to the public bucket
    try {
        const destParams = {
            Bucket: destBucket,
            Key: destKey,
            Body: outputBuffer,
            ContentType: "image"
        };
        const putResult = await s3.send(new PutObjectCommand(destParams));
        const url = `https://${process.env.fotorgasmPublicDataBucket}.s3-${process.env.region}.amazonaws.com/${destKey}`;
        console.log('Successfully resized ' + srcBucket + '/' + srcKey + ' and uploaded to ' + destBucket + '/' + destKey);
        return Responses._200({
            imageURL: url,
        });
    } catch (error) {
        console.log(error);
        return Responses._400({ message: error.message || 'Failed to upload avatar!' });
    }
    
    

    // try{
        
    //     const fileInfo = await fileType.fileTypeFromBuffer(parsedData.files.content);
    //     const detectedExt = fileInfo.ext;
    //     const detectedMime = fileInfo.mime;

    //     if(!allowedMimes.includes(detectedMime)){
    //         return Responses._400({ message: 'Mime types dont match!' })
    //     }
    //     const name = uuid() + `-${parsedData.fileName}`;
    //     const key = `${name}.${detectedExt}`;

    //     console.log(`Writting image to bucket called ${key}`);

    //     await s3.
    //         putObject({
    //             Body: imageBuffer,
    //             Key: key,
    //             ContentType: detectedMime,
    //             Bucket: process.env.fotorgasmImagesUploadBucket,
    //             ACL: 'public-read',
    //         })
    //         .promise();
    //     const url = `https://${process.env.fotorgasmImagesUploadBucket}.s3-${process.env.region}.amazonaws.com/${key}`;

    //     // Update avatar url to User Model
    //     User.findByIdAndUpdate();
    //     return Responses._200({
    //         imageURL: url,
    //     });
    // } catch (err) {
    //     console.log('error', err);
    //     return Responses._400({ message: err.message || 'Failed to upload avatar!' });
    // }
}