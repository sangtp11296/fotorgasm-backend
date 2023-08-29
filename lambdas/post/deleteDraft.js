import { S3Client, ListObjectsV2Command, DeleteObjectCommand,  DeleteObjectsCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { Responses } from '/opt/nodejs/functions/common/API_Responses.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './variables.env' });
import {connectToDatabase} from '/opt/nodejs/functions/connectDB.js';
import { Post } from '/opt/nodejs/database/models/Post.js';



// Set the AWS Region.
const REGION = process.env.region; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3 = new S3Client({ region: REGION });
const uploadBucket = process.env.fotorgasmDataUpload;
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

        const data = JSON.parse(event.body);
        const slug = data.slug;
        const format = data.format;
        const destinationFolder = `posts/${slug}/`;

        // List the objects in the source folder
        const listObjectsResponse = await s3.send(new ListObjectsV2Command({ 
            Bucket: uploadBucket, 
            Prefix: folderKey 
        }));
        if (format === 'image'){
            // Sort the objects by LastModified time (ascending)
            const sortedObjects = listObjectsResponse.Contents.sort((a, b) => a.LastModified - b.LastModified);

            // Move and rename each object in the destination folder
            const movePromises = sortedObjects.map(async (object, index) => {
                const sourceKey = object.Key;
                const destinationKey = `${destinationFolder}${getNewFileName(slug, index + 1, sourceKey)}`;

                const copyCommand = new CopyObjectCommand({
                    CopySource: `/${uploadBucket}/${sourceKey}`,
                    Bucket: uploadBucket,
                    Key: destinationKey
                });
                await s3.send(copyCommand);

                const deleteCommand = new DeleteObjectCommand({
                    Bucket: uploadBucket,
                    Key: sourceKey
                });
                await s3.send(deleteCommand);
            });

            await Promise.all(movePromises);

            return Responses._200({
                message: 'Files moved and renamed successfully!'
            });
        } else if (format === 'video'){
            // Connect to the database
            context.callbackWaitsForEmptyEventLoop = false;
            await connectToDatabase();

            // Sort the objects by video size (ascending)
            const sortedObjects = listObjectsResponse.Contents.sort((a, b) => a.Size - b.Size);

            // Move and rename each object in the destination folder
            const movePromises = sortedObjects.map(async (object, index) => {
                const sourceKey = object.Key;
                const destinationKey = `${destinationFolder}${getNewVideoName(slug, index, sourceKey)}`;

                const copyCommand = new CopyObjectCommand({
                    CopySource: `/${uploadBucket}/${sourceKey}`,
                    Bucket: uploadBucket,
                    Key: destinationKey
                });
                await s3.send(copyCommand);

                const deleteCommand = new DeleteObjectCommand({
                    Bucket: uploadBucket,
                    Key: sourceKey
                });
                await s3.send(deleteCommand);
                
                // Update video keys to Post model
                if (index === 0){
                    const updatedPost = await Post.findOneAndUpdate(
                        { slug: slug },
                        { $set: { 
                            'videoSrc.low': destinationKey
                         } },
                        { new: true }
                    );
                } else if (index === 1){
                    const updatedPost = await Post.findOneAndUpdate(
                        { slug: slug },
                        { $set: { 
                            'videoSrc.medium': destinationKey
                         } },
                        { new: true }
                    );
                } else if (index === 2){
                    const updatedPost = await Post.findOneAndUpdate(
                        { slug: slug },
                        { $set: { 
                            'videoSrc.high': destinationKey
                         } },
                        { new: true }
                    );
                }
            });

            await Promise.all(movePromises);

            
            return Responses._200({
                message: 'Files moved, renamed and updated successfully!'
            });
        }
        
    } catch (error) {
        console.error('Error moving files:', error);
        return Responses._500({
            error: 'Error moving files ' + error
        });
    }
}

// Delete a file in draft folder
export const deleteFile = async (event) => {
    try{
        const data = JSON.parse(event.body);
        const fileName = data.fileName;

        const deleteCommand = new DeleteObjectCommand({
            Bucket: uploadBucket,
            Key: `draft/${fileName}`,
          });

        await s3.send(deleteCommand);
        console.log('Object deleted successfully.');
        return Responses._200({
            message: `File ${fileName} deleted successfully!`
        })
    } catch (error) {
        console.log(error);
        return Responses._500({
            error: `Error deleting file ${fileName} ` + err
        })
    }

}

// Helper function to generate the new file name
function getNewFileName(baseName, index, originalFileName) {
    const parts = originalFileName.split('.');
    const extension = parts.pop();

    return `${baseName} (${index}).${extension}`;
}
function getNewVideoName(baseName, index, originalFileName) {
    if (index === 0) {
        const parts = originalFileName.split('.');
        const extension = parts.pop();
    
        return `${baseName} (low).${extension}`;
    } else if (index === 1) {
        const parts = originalFileName.split('.');
        const extension = parts.pop();
    
        return `${baseName} (medium).${extension}`;
    } else if (index === 2) {
        const parts = originalFileName.split('.');
        const extension = parts.pop();
    
        return `${baseName} (high).${extension}`;
    }
}