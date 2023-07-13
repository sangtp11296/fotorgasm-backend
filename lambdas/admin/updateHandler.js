import { User } from '/opt/nodejs/database/models/User.js';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';
import { v4 as uuid } from 'uuid';
import { S3Client } from '@aws-sdk/client-s3';
import * as fileType from 'file-type';
import parser  from 'lambda-multipart-parser'

const s3 = new S3Client({ region: process.env.region});

const allowedMimes = ['image/jpeg','image/png','image/jpg', 'image/gif'];

export async function updateHandler(event, context, callback) {
    try{
        // const parsedData = parse(event);
        // console.log(parsedData)
        // const imageBuffer = fs.readFileSync(parsedData.avatar.path);
        const parsedData = await parser.parse(event)
        console.log(parsedData);

        const fileInfo = await fileType.fileTypeFromBuffer(imageBuffer);
        const detectedExt = fileInfo.ext;
        const detectedMime = fileInfo.mime;

        if(!allowedMimes.includes(detectedMime)){
            return Responses._400({ message: 'Mime types dont match!' })
        }
        const name = uuid();
        const key = `${name}.${detectedExt}`;

        console.log(`Writting image to bucket called ${key}`);

        await s3.
            putObject({
                Body: imageBuffer,
                Key: key,
                ContentType: detectedMime,
                Bucket: process.env.fotorgasmImagesUploadBucket,
                ACL: 'public-read',
            })
            .promise();
        const url = `https://${process.env.fotorgasmImagesUploadBucket}.s3-${process.env.region}.amazonaws.com/${key}`;

        // Update avatar url to User Model
        User.findByIdAndUpdate();
        return Responses._200({
            imageURL: url,
        });
    } catch (err) {
        console.log('error', err);
        return Responses._400({ message: err.message || 'Failed to upload avatar!' });
    }
}