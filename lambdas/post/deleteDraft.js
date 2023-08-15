import { S3Client, ListObjectsV2Command, DeleteObjectCommand,  DeleteObjectsCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';


// Set the AWS Region.
const REGION = process.env.region; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3 = new S3Client({ region: REGION });
const uploadBucket = process.env.fotorgasmImagesUploadBucket;
const folderKey = `draft/`;

export const deleteDraft = async (event) => {
    try{
        
        const listParams = {
            Bucket: uploadBucket,
            Prefix: folderKey
        }
        const listCommand = await s3.send(new ListObjectsV2Command(listParams));
        
        if (listCommand.length === 0) {
            return Responses._200({
                message: 'Folder is empty already!'
            })
        }
        const listedObjects = listCommand.Contents.map(obj => ({
            Key: obj.Key
        }));
        const deleteParams = {
            Bucket: uploadBucket,
            Delete: {
                Objects: listedObjects,
            }
        }

        await s3.send(new DeleteObjectsCommand(deleteParams))
        return Responses._200({
            message: 'Objects in folder deleted successfully!'
        })
    } catch (err) {
        console.log(err);
        return Responses._500({
            error: 'Error deleting objects ' + err
        })
    };
};

export const moveDraft = async (event, context) => {
    try {

        const slug = JSON.parse(event.body);
        const destinationFolder = `posts/${slug}/`;

        // List the objects in the source folder
        const listObjectsResponse = await s3.send(new ListObjectsV2Command({ 
            Bucket: uploadBucket, 
            Prefix: folderKey 
        }));

        // Sort the objects by LastModified time (ascending)
        const sortedObjects = listObjectsResponse.Contents.sort((a, b) => a.LastModified - b.LastModified);

        // Move and rename each object in the destination folder
        const movePromises = sortedObjects.map(async (object, index) => {
            const sourceKey = object.Key;
            const destinationKey = `${destinationFolder}${getNewFileName(slug, index + 1, sourceKey)}`;

            const copyCommand = new CopyObjectCommand({
                CopySource: `${folderKey}/${sourceKey}`,
                Bucket: uploadBucket,
                Key: destinationKey
            });
            await s3.send(copyCommand);

            const deleteCommand = new DeleteObjectCommand({
                Bucket: sourceBucket,
                Key: sourceKey
            });
            await s3.send(deleteCommand);
        });

        await Promise.all(movePromises);

        return Responses._200({
            message: 'Files moved and renamed successfully!'
        });
    } catch (error) {
        console.error('Error moving files:', error);
        return Responses._500({
            error: 'Error moving files ' + error
        });
    }
}

// Helper function to generate the new file name
function getNewFileName(baseName, index, originalFileName) {
    const parts = originalFileName.split('.');
    const extension = parts.pop();

    return `${baseName} (${index}).${extension}`;
}