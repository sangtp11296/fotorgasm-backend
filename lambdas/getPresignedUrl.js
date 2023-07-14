import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';


// Set the AWS Region.
const REGION = process.env.region; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3 = new S3Client({ region: REGION });
const uploadBucket = process.env.fotorgasmImagesUploadBucket;
const URL_EXPIRATION_SECONDS = 30000    // Specify how long the pre-signed URL will be valid for

export const getPresignedUrl = async (event) => {
    try{
        const { userID, fileName, fileType } = JSON.parse(event.body);
        console.log(fileName,fileType)
        // Random uploaded file name
        const name = uuid();
        const key = `${name}'-'${fileName}`;

        //Get signed URL form S3
        const s3Params = {
            Bucket: uploadBucket,
            Key: `${userID}/${key}`,
            ContentType: fileType,
            Expires: URL_EXPIRATION_SECONDS,
        }

        const presignedUrl = await s3.getSignedUrlPromise('putObject', s3Params);

        return Responses._200({
            body: JSON.stringify({ presignedUrl })
        })
    } catch (err) {
        return Responses._500({
            body: JSON.stringify({ error: 'Error generating presigned URL' })
        })
    };
};