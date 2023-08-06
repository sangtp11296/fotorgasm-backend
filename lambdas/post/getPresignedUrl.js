import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';


// Set the AWS Region.
const REGION = process.env.region; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3 = new S3Client({ region: REGION });
const uploadBucket = process.env.fotorgasmImagesUploadBucket;
const URL_EXPIRATION_SECONDS = 3600    // Specify how long the pre-signed URL will be valid for

export const uploadDraftImage = async (event) => {
    try{
        const { fileName, fileType, postSlug } = JSON.parse(event.body);
        console.log(postSlug)
        // Random uploaded avatar name
        const name = uuid();
        const key = `${name}-${fileName}`;
        //Get signed URL form S3
        const s3Params = {
            Bucket: uploadBucket,
            Key: `draft/${postSlug}/${key}`,
            ContentType: fileType,
            ACL: 'bucket-owner-full-control'
        }
        const command = new PutObjectCommand(s3Params)
        const presignedUrl = await getSignedUrl(s3, command, {expiresIn: URL_EXPIRATION_SECONDS});
        return Responses._200({
            body: JSON.stringify({ 
                presignedUrl,
                key: `draft/${postSlug}/${key}`,
            })
        })
    } catch (err) {
        return Responses._500({
            body: JSON.stringify({ error: 'Error generating presigned URL ' + err })
        })
    };
};

export const getDraftImage = async (event) => {
    try{
        const { key } = JSON.parse(event.body);
        
        //Get signed URL form S3
        const s3Params = {
            Bucket: uploadBucket,
            Key: key,
        }
        const command = new GetObjectCommand(s3Params)
        const presignedUrl = await getSignedUrl(s3, command, {expiresIn: URL_EXPIRATION_SECONDS});
        return Responses._200({
            body: JSON.stringify({ 
                presignedUrl
            })
        })
    } catch (err) {
        return Responses._500({
            body: JSON.stringify({ error: 'Error getting presigned URL ' + err })
        })
    };
}