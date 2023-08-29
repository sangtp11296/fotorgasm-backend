import { S3Client, CreateMultipartUploadCommand, PutObjectCommand, GetObjectCommand, CompleteMultipartUploadCommand, UploadPartCommand, AbortMultipartUploadCommand  } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';


// Set the AWS Region.
const REGION = process.env.region; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3 = new S3Client({ region: REGION });
const uploadBucket = process.env.fotorgasmDataUpload;
const URL_EXPIRATION_SECONDS = 3600    // Specify how long the pre-signed URL will be valid for

export const uploadDraftImage = async (event) => {
    try{
        console.log(JSON.parse(event.body))
        const { fileName, fileType } = JSON.parse(event.body);
        // Random uploaded avatar name
        const name = uuid();
        const key = `${name}-${fileName}`;
        //Get signed URL form S3
        const s3Params = {
            Bucket: uploadBucket,
            Key: `draft/${key}`,
            ContentType: fileType,
            ACL: 'bucket-owner-full-control'
        }
        const command = new PutObjectCommand(s3Params)
        const presignedUrl = await getSignedUrl(s3, command, {expiresIn: URL_EXPIRATION_SECONDS});
        return Responses._200({
            body: JSON.stringify({ 
                presignedUrl,
                key: `draft/${key}`,
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

export const uploadPostThumbnail = async (event) => {
    try{
        const { fileName, fileType } = JSON.parse(event.body);
        // Random uploaded avatar name
        const key = `${fileName}`;
        //Get signed URL form S3
        const s3Params = {
            Bucket: uploadBucket,
            Key: `cover/${key}`,
            ContentType: fileType,
            ACL: 'bucket-owner-full-control'
        }
        const command = new PutObjectCommand(s3Params)
        const presignedUrl = await getSignedUrl(s3, command, {expiresIn: URL_EXPIRATION_SECONDS});
        return Responses._200({
            body: JSON.stringify({ 
                presignedUrl
            })
        })
    } catch (err) {
        console.log('Error generating presigned URL ' + err);
        return Responses._500({
            body: JSON.stringify({ error: 'Error generating presigned URL ' + err })
        })
    };
};

// Start Multipart Upload
export const startMultiPartUpload = async (event) => {
    try{
        const data = JSON.parse(event.body);
        const numberOfFiles = data.numberOfFiles;
        const createMultipartUploadParams = {
            Bucket: uploadBucket,
            Key: `draft/${data.fileName}`
        }

        const createMultipartUploadCommand = new CreateMultipartUploadCommand(createMultipartUploadParams);
        const res = await s3.send(createMultipartUploadCommand);

        const uploadId = res.UploadId;
        const presignedUrls = [];

        // Generate presignedUrl for each part
        for (let partNumber = 1; partNumber <= numberOfFiles; partNumber++){
            const getSignedUrlParams = {
                Bucket: uploadBucket,
                Key: `draft/${data.fileName}`,
                PartNumber: partNumber,
                UploadId: uploadId,
            }
            const command = new UploadPartCommand(getSignedUrlParams)
            const presignedUrl = await getSignedUrl(s3, command, {expiresIn: URL_EXPIRATION_SECONDS});

            presignedUrls.push({ 
                partNumber, 
                url: presignedUrl
            });
        }
        return Responses._200({
            presignedUrls,
            uploadId
        })
    } catch (error) {
        console.log(error)
        return Responses._500({
            error: 'Error generating presigned URL ' + error
        })
    }
}

// Complete Multipart Upload
export const completeMultiPartUpload = async (event) => {
    try{
        const data = JSON.parse(event.body);
        const { uploadId, fileName, parts } = data;
        console.log(data)
        const completeParams = {
            Bucket: uploadBucket, // Update with your bucket name
            Key: `draft/${fileName}`,  // Update with your object key
            MultipartUpload: {
                Parts: parts
            },
            UploadId: uploadId
        };
        const completeCommand = new CompleteMultipartUploadCommand(completeParams);
        const completeResponse = await s3.send(completeCommand);

        return Responses._200({
            message: 'Multipart upload completed successfully',
            result: completeResponse
        })
    } catch (error) {
        console.log(error);
        return Responses._500({
            message: 'Error completing multipart upload',
                error: error.message
        })
    }
}

// Abort Multipart Upload
export const abortMultiPartUpload = async (event) => {
    try{
        const data = JSON.parse(event.body);
        const fileName = data.fileName;
        const uploadId = data.uploadId;
        const abortMultipartUploadParams = {
            Bucket: uploadBucket,
            Key: `draft/${fileName}`,
            UploadId: uploadId
        }

        const abortMultipartUploadCommand = new AbortMultipartUploadCommand(abortMultipartUploadParams);
        const res = await s3.send(abortMultipartUploadCommand);
        console.log('Multipart upload aborted successfully.');
        return Responses._200({
            message: 'Multipart upload aborted successfully.'
        })
    } catch (error) {
        console.log(error);
        return Responses._500({
            error: 'Cannot abort uploading process ' + error
        })
    }
}